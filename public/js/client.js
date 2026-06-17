// ===== ESTADO =====
let ws = null;
let playerId = null;
let isHost = false;
let timeLeft = 25;
let timerInterval = null;
let selectedAnswer = null;
let isMyTurn = false;
let animeList = [];
let photoAnswered = false;
let bgmTracks = [];
let bgmAudio = null;
let bgmIndex = -1;
let bgmEnabled = true;

// Draw
let drawCanvas, drawCtx;
let drawing = false;
let drawHue = 0;       // 0-360
let drawSat = 0;       // 0-100 (saturación HSV)
let drawVal = 0;       // 0-100 (valor/brillo HSV) -> empieza en negro
let drawColor = "#000000";
let drawSize = 3;
let drawTool = "lapiz"; // lapiz | rotulador | goma | rectangulo | circulo | cubo
let drawMarkerAlpha = 0.55; // opacidad del rotulador (0.1 - 1)
let lastDrawPoint = null;
let drawHistory = []; // snapshots ImageData para el deshacer (solo en el dibujante)
const MAX_HISTORY = 30;
const CANVAS_BG = "#f4f1ea";
const DRAW_TIME = 180; // debe coincidir con room.DRAW_TIME en server.js
let isMyDrawGuesser = false; // true si soy un espectador en la ronda de draw (puedo adivinar)
let currentQuestionTimeLimit = 0;
let myPlayerName = "";
let timerContext = "question"; // "question" | "choose" - controla cuándo suena el tick

function $(id) { return document.getElementById(id); }

// ===== MÚSICA DE FONDO =====
function startBgm() {
  if (!bgmEnabled || !bgmTracks || bgmTracks.length === 0) return;
  if (!bgmAudio) {
    bgmAudio = $("sound-bgm");
    if (!bgmAudio) return;
    bgmAudio.addEventListener("ended", playNextBgm);
  }
  playNextBgm();
}

function playNextBgm() {
  if (!bgmAudio || !bgmTracks.length) return;
  // Elige una pista aleatoria distinta a la actual si hay más de una
  let next = Math.floor(Math.random() * bgmTracks.length);
  if (bgmTracks.length > 1 && next === bgmIndex) {
    next = (next + 1) % bgmTracks.length;
  }
  bgmIndex = next;
  bgmAudio.src = bgmTracks[bgmIndex];
  bgmAudio.volume = 0.35;
  bgmAudio.play().catch(() => {});
}

function stopBgm() {
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
  }
  bgmIndex = -1;
}

function toggleBgm() {
  bgmEnabled = !bgmEnabled;
  const btn = $("bgm-toggle-btn");
  if (btn) btn.textContent = bgmEnabled ? "🔊 Música: ON" : "🔇 Música: OFF";
  if (!bgmEnabled) {
    stopBgm();
  } else if (bgmTracks.length) {
    startBgm();
  }
}

function updateBgmButtonVisibility() {
  const btn = $("bgm-toggle-btn");
  if (!btn) return;
  btn.style.display = (bgmTracks && bgmTracks.length > 0) ? "flex" : "none";
}

function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(`screen-${name}`).classList.add("active");
  if (name !== "game") {
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
    $("screen-game").classList.remove("wide");
  }
  updateBooButton();
}

function showToast(msg, type = "") {
  const t = $("toast");
  t.textContent = msg;
  t.className = "show " + type;
  setTimeout(() => t.className = "", 3000);
}

function getName() {
  const n = $("input-name").value.trim();
  if (!n) { showToast("Escribe tu nombre primero", "error"); return null; }
  return n;
}

function connectWS(callback) {
  const proto = location.protocol === "https:" ? "wss" : "ws";
  ws = new WebSocket(`${proto}://${location.host}`);
  ws.onopen = callback;
  ws.onmessage = (e) => handleMessage(JSON.parse(e.data));
  ws.onclose = () => showToast("Conexión perdida. Recarga la página.", "error");
  ws.onerror = () => showToast("Error de conexión", "error");
}

function send(data) { ws.send(JSON.stringify(data)); }

// ===== HOME =====
function goToCreate() {
  const name = getName(); if (!name) return;
  connectWS(() => send({ type: "create_room", name }));
}

function goToJoin() {
  const name = getName(); if (!name) return;
  $("join-section").style.display = "block";
  $("input-code").focus();
}

function joinRoom() {
  const name = getName(); if (!name) return;
  const code = $("input-code").value.trim().toUpperCase();
  if (code.length < 3) { showToast("Introduce el código de sala", "error"); return; }
  connectWS(() => send({ type: "join_room", name, code }));
}

// ===== LOBBY =====
function renderLobby(roomState) {
  $("lobby-code").textContent = roomState.code;
  const list = $("lobby-players");
  list.innerHTML = "";
  roomState.players.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="player-avatar">${p.name.slice(0,2).toUpperCase()}</div>
      <span>${p.name}</span>
      ${p.isHost ? '<span class="host-badge">HOST</span>' : ''}
    `;
    list.appendChild(li);
  });

  if (isHost) {
    $("host-controls").style.display = "block";
    $("guest-waiting").style.display = "none";
    const canStart = roomState.players.length >= 1;
    $("btn-start").disabled = !canStart;
    $("btn-start").textContent = canStart
      ? `▶ Empezar (${roomState.players.length} jugadores)`
      : "Esperando jugadores…";
  } else {
    $("host-controls").style.display = "none";
    $("guest-waiting").style.display = "block";
  }
}

function startGame() {
  const stages = [];
  if ($("stage-trivia").checked) stages.push("trivia");
  if ($("stage-openings").checked) stages.push("openings");
  if ($("stage-osts").checked) stages.push("osts");
  if ($("stage-photos").checked) stages.push("photos");
  if ($("stage-draw").checked) stages.push("draw");

  if (stages.length === 0) {
    showToast("Selecciona al menos una etapa", "error");
    return;
  }

  const turnsPerStage = parseInt($("input-turns").value);
  send({ type: "start_game", stages, turnsPerStage });
}

// ===== STAGE INTRO =====
const STAGE_INFO = {
  trivia: {
    icon: "❓",
    title: "Etapa 1: Preguntas tipo test",
    desc: "En cada turno elegirás la dificultad de tu pregunta: fácil, media o difícil. A más dificultad, más puntos… ¡pero también más riesgo si fallas!"
  },
  openings: {
    icon: "🎵",
    title: "Etapa 2: Adivina el opening",
    desc: "Escucha el clip de audio y adivina a qué anime pertenece entre las opciones."
  },
  osts: {
    icon: "🎼",
    title: "Etapa 3: Original Soundtracks",
    desc: "Escucha el fragmento de banda sonora (OST) y adivina a qué anime pertenece entre las opciones."
  },
  photos: {
    icon: "🖼️",
    title: "Etapa 4: Adivina el anime por la foto",
    desc: "Verás una imagen y deberás escribir el nombre del anime. Si fallas, irán apareciendo pistas más fáciles, hasta llegar al logo del anime."
  },
  draw: {
    icon: "✏️",
    title: "Etapa 5: Draw",
    desc: "El jugador activo elige un personaje de entre 3 opciones y lo dibuja. El resto debe escribir quién es. ¡Cuanto más rápido aciertes, más puntos!"
  }
};

function showStageIntro(stage) {
  showScreen("stage-intro");
  const info = STAGE_INFO[stage] || { icon: "🎮", title: "Siguiente etapa", desc: "" };
  $("stage-intro-icon").textContent = info.icon;
  $("stage-intro-title").textContent = info.title;
  $("stage-intro-desc").textContent = info.desc;
}

// ===== CHOOSE DIFFICULTY =====
function renderChooseDifficulty(msg) {
  showScreen("choose");
  clearInterval(timerInterval);
  timeLeft = msg.timeLimit;
  currentQuestionTimeLimit = msg.timeLimit;
  timerContext = "choose";

  isMyTurn = msg.roomState.currentTurnId === playerId;

  if (isMyTurn) {
    $("choose-active-card").style.display = "block";
    $("choose-spectator-card").style.display = "none";
    const wrap = $("difficulty-options");
    wrap.innerHTML = "";
    msg.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = `diff-option diff-${opt.key}`;
      btn.innerHTML = `
        <span class="diff-name">${opt.label}</span>
        <span class="diff-points">+${opt.points} pts</span>
        <span class="diff-penalty">si fallas: -${opt.penalty} pts</span>
      `;
      btn.onclick = () => {
        wrap.querySelectorAll(".diff-option").forEach(b => b.disabled = true);
        send({ type: "choose_difficulty", difficulty: opt.key });
      };
      wrap.appendChild(btn);
    });
  } else {
    $("choose-active-card").style.display = "none";
    $("choose-spectator-card").style.display = "block";
    $("choose-spectator-text").textContent =
      `${msg.roomState.currentTurnName} está eligiendo la dificultad de su pregunta…`;
  }

  $("choose-turn-name").textContent = msg.roomState.currentTurnName;
  updateBooButton();

  updateChooseTimer(timeLeft);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateChooseTimer(timeLeft);
    if (timeLeft <= 0) clearInterval(timerInterval);
  }, 1000);
}

function updateChooseTimer(t) {
  const el = $("choose-timer");
  el.textContent = t;
  el.className = "timer-display" + (t <= 5 ? " danger" : t <= 10 ? " warning" : "");
  updateTimerBar("choose-timer", t, currentQuestionTimeLimit);
}

// ===== PREGUNTA =====
function showQuestion(msg) {
  showScreen("game");
  selectedAnswer = null;
  photoAnswered = false;
  clearInterval(timerInterval);
  timeLeft = msg.timeLimit;
  currentQuestionTimeLimit = msg.timeLimit;
  timerContext = "question";

  isMyTurn = msg.roomState.currentTurnId === playerId;

  // Banner de turno
  const banner = $("turn-banner");
  const turnName = $("turn-name");
  const turnLabel = $("turn-label");
  banner.style.display = "block";
  if (isMyTurn) {
    banner.className = "turn-banner";
    turnLabel.textContent = "¡Es tu turno!";
    turnName.textContent = "Responde tú";
  } else {
    banner.className = "turn-banner spectating";
    turnLabel.textContent = "Turno de";
    turnName.textContent = msg.roomState.currentTurnName;
  }

  // Meta
  $("q-category").textContent = msg.category;
  $("q-points").textContent = `+${msg.points} pts`;

  $("answer-feedback").style.display = "none";

  if (msg.questionType === "photo") {
    showPhotoQuestion(msg);
  } else if (msg.questionType === "draw") {
    showDrawQuestion(msg);
  } else {
    showTriviaOrOpeningQuestion(msg);
  }

  updateBooButton();

  updateTimer(timeLeft);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer(timeLeft);
    if (timeLeft <= 0) clearInterval(timerInterval);
  }, 1000);
}

function showTriviaOrOpeningQuestion(msg) {
  $("trivia-block").style.display = "block";
  $("photo-block").style.display = "none";
  $("draw-block").classList.remove("active");
  $("screen-game").classList.remove("wide");
  document.documentElement.classList.remove("no-scroll");
  document.body.classList.remove("no-scroll");

  // Progreso
  $("q-progress-label").textContent =
    `${msg.roomState.currentStage === "openings" ? "Opening" : msg.roomState.currentStage === "osts" ? "OST" : "Pregunta"} · Turno ${msg.roomState.turnInStage + 1} de ${msg.roomState.turnsPerStage}`;
  const pct = (msg.roomState.turnInStage / msg.roomState.turnsPerStage) * 100;
  $("progress-bar").style.width = pct + "%";

  // Imagen de contexto / pista (solo trivia)
  const imgCard = $("q-image-card");
  const audioCard = $("q-audio-card");
  if (msg.questionType === "trivia" && msg.image) {
    imgCard.style.display = "block";
    audioCard.style.display = "none";
    $("q-image").src = msg.image;
    $("q-image-caption").textContent = msg.isCharacterClue
      ? "💡 Esta imagen es una pista para responder"
      : "Imagen de contexto del anime";
  } else if (msg.questionType === "opening" || msg.questionType === "ost") {
    imgCard.style.display = "none";
    audioCard.style.display = "block";
    $("q-audio-prompt").textContent = msg.questionType === "ost"
      ? "🎼 Escucha la banda sonora y adivina el anime"
      : "🎵 Escucha el opening y adivina el anime";
    const audio = $("q-audio");
    audio.src = msg.audio;
    audio.load();
    audio.volume = 0.6;
    audio.play().catch(() => {
      // Si el navegador bloquea el autoplay, queda el control manual visible
    });
    if (bgmAudio) bgmAudio.volume = 0.08; // bajar música de fondo mientras suena el opening/OST
  } else {
    imgCard.style.display = "none";
    audioCard.style.display = "none";
  }

  // Pregunta
  if (msg.questionType === "opening") {
    $("question-text").textContent = "¿A qué anime pertenece este opening?";
  } else if (msg.questionType === "ost") {
    $("question-text").textContent = "¿A qué anime pertenece esta banda sonora?";
  } else {
    $("question-text").textContent = msg.question;
  }

  // Opciones
  const grid = $("options-grid");
  grid.innerHTML = "";
  msg.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    if (isMyTurn) {
      btn.className = "option-btn";
      btn.onclick = () => submitAnswer(i);
    } else {
      btn.className = "option-btn spectator";
      btn.disabled = true;
    }
    btn.textContent = opt;
    grid.appendChild(btn);
  });
}

function showPhotoQuestion(msg) {
  $("trivia-block").style.display = "none";
  $("photo-block").style.display = "block";
  $("draw-block").classList.remove("active");
  $("screen-game").classList.remove("wide");
  document.documentElement.classList.remove("no-scroll");
  document.body.classList.remove("no-scroll");

  $("photo-hint-label").textContent = `Pista ${msg.hintIndex + 1} de ${msg.totalHints}` +
    (msg.isLastHint ? " · ¡Esta es la última pista (logo)!" : "");
  $("photo-image").src = msg.image;

  $("photo-input").value = "";
  $("photo-suggestions").innerHTML = "";

  if (isMyTurn) {
    $("photo-answer-card").style.display = "block";
    $("photo-spectator-card").style.display = "none";
    $("photo-input").disabled = false;
    $("photo-submit-btn").disabled = false;
    setTimeout(() => $("photo-input").focus(), 100);
  } else {
    $("photo-answer-card").style.display = "none";
    $("photo-spectator-card").style.display = "block";
    $("photo-spectator-text").textContent =
      `${msg.roomState.currentTurnName} está intentando adivinar el anime…`;
  }

  // Timer compartido para fotos
  $("photo-timer").className = "timer-display";
}

// Autocompletado
document.addEventListener("input", (e) => {
  if (e.target.id !== "photo-input") return;
  const val = e.target.value.trim().toLowerCase();
  const list = $("photo-suggestions");
  list.innerHTML = "";
  if (!val) return;

  const matches = animeList
    .filter(a => a.toLowerCase().startsWith(val))
    .slice(0, 8);

  matches.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    li.onclick = () => {
      $("photo-input").value = name;
      list.innerHTML = "";
    };
    list.appendChild(li);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.target.id === "photo-input" && e.key === "Enter") {
    submitPhotoAnswer();
  }
});

function submitPhotoAnswer() {
  if (!isMyTurn || photoAnswered) return;
  const guess = $("photo-input").value.trim();
  if (!guess) { showToast("Escribe un anime antes de responder", "error"); return; }
  photoAnswered = true;
  $("photo-input").disabled = true;
  $("photo-submit-btn").disabled = true;
  $("photo-suggestions").innerHTML = "";
  send({ type: "answer_photo", guess });
}

// ===== DRAW: ELECCIÓN DE PERSONAJE =====
function renderDrawChoice(msg) {
  showScreen("draw-choice");
  clearInterval(timerInterval);
  timeLeft = msg.timeLimit;
  currentQuestionTimeLimit = msg.timeLimit;
  timerContext = "choose";

  isMyTurn = msg.roomState.currentTurnId === playerId;

  if (isMyTurn) {
    $("draw-choose-active-card").style.display = "block";
    $("draw-choose-spectator-card").style.display = "none";
    const wrap = $("draw-choice-options");
    wrap.innerHTML = "";
    msg.options.forEach(name => {
      const btn = document.createElement("button");
      btn.className = "diff-option";
      btn.innerHTML = `<span class="diff-name">${name}</span>`;
      btn.onclick = () => {
        wrap.querySelectorAll(".diff-option").forEach(b => b.disabled = true);
        send({ type: "draw_choice", character: name });
      };
      wrap.appendChild(btn);
    });
  } else {
    $("draw-choose-active-card").style.display = "none";
    $("draw-choose-spectator-card").style.display = "block";
    $("draw-choose-spectator-text").textContent =
      `${msg.roomState.currentTurnName} está elegiendo a quién dibujar…`;
  }

  $("draw-choose-turn-name").textContent = msg.roomState.currentTurnName;
  updateBooButton();

  updateDrawChooseTimer(timeLeft);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateDrawChooseTimer(timeLeft);
    if (timeLeft <= 0) clearInterval(timerInterval);
  }, 1000);
}

function updateDrawChooseTimer(t) {
  const el = $("draw-choose-timer");
  el.textContent = t;
  el.className = "timer-display" + (t <= 5 ? " danger" : t <= 10 ? " warning" : "");
  updateTimerBar("draw-choose-timer", t, currentQuestionTimeLimit);
}

// ===== DRAW: RONDA DE DIBUJO =====
function showDrawQuestion(msg) {
  $("trivia-block").style.display = "none";
  $("photo-block").style.display = "none";
  $("draw-block").classList.add("active");
  $("screen-game").classList.add("wide");
  document.documentElement.classList.add("no-scroll");
  document.body.classList.add("no-scroll");

  $("progress-bar").style.width =
    ((msg.roomState.turnInStage / msg.roomState.turnsPerStage) * 100) + "%";

  initDrawCanvas();
  resetDrawColor();
  drawHistory = [];
  clearDrawCanvas(false);
  $("draw-chat").innerHTML = "";
  $("draw-reveal-image-card").style.display = "none";
  $("draw-main-row").style.display = "flex";

  const isDrawer = msg.characterToDraw !== null && msg.characterToDraw !== undefined;
  isMyDrawGuesser = !isDrawer;

  if (isDrawer) {
    $("draw-toolbar").style.display = "flex";
    $("draw-guess-card").style.display = "none";
    $("draw-drawer-card").style.display = "block";
    drawCanvas.style.cursor = "crosshair";
    const badge = $("q-points");
    if (badge) badge.textContent = "+30 pts por acierto";

    // El que dibuja ya sabe que es su turno: ocultar el banner para
    // dejar más espacio.
    $("turn-banner").style.display = "none";

    const refCard = $("draw-reference-card");
    const refImg = $("draw-reference-image");
    $("draw-reference-name").textContent = msg.characterToDraw;
    if (msg.characterImage) {
      refImg.src = msg.characterImage;
      refImg.style.display = "block";
      refImg.onerror = () => { refImg.style.display = "none"; };
      refImg.onload = () => { refImg.style.display = "block"; };
    } else {
      refImg.style.display = "none";
    }
    refCard.style.display = "flex";
  } else {
    $("turn-banner").style.display = "block";
    $("draw-toolbar").style.display = "none";
    $("draw-guess-card").style.display = "block";
    $("draw-drawer-card").style.display = "none";
    $("draw-reference-card").style.display = "none";
    drawCanvas.style.cursor = "default";
    $("draw-guess-input").value = "";
    $("draw-guess-input").disabled = false;
    setTimeout(() => $("draw-guess-input").focus(), 100);
    updateDrawPointsBadge(timeLeft);
  }
}

// Calcula los puntos que se ganarían si se responde ahora mismo en
// la ronda de Draw (misma fórmula que el servidor) y actualiza el badge.
function updateDrawPointsBadge(t) {
  const remainingRatio = Math.max(0, Math.min(1, t / DRAW_TIME));
  const points = Math.max(50, Math.round(50 + remainingRatio * 150));
  const badge = $("q-points");
  if (badge) badge.textContent = `+${points} pts`;
}

function initDrawCanvas() {
  if (drawCanvas) return;
  drawCanvas = $("draw-canvas");
  drawCtx = drawCanvas.getContext("2d");

  initColorPicker();

  document.querySelectorAll(".draw-size-btn").forEach(btn => {
    btn.onclick = () => {
      drawSize = parseInt(btn.dataset.size);
      document.querySelectorAll(".draw-size-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
    if (parseInt(btn.dataset.size) === drawSize) btn.classList.add("active");
  });

  document.querySelectorAll(".draw-tool-btn").forEach(btn => {
    btn.onclick = () => {
      drawTool = btn.dataset.tool;
      document.querySelectorAll(".draw-tool-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
    if (btn.dataset.tool === drawTool) btn.classList.add("active");
  });

  // Eventos de dibujo (ratón y táctil)
  const getPos = (e) => {
    const rect = drawCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (drawCanvas.width / rect.width),
      y: (clientY - rect.top) * (drawCanvas.height / rect.height),
    };
  };

  const SHAPE_TOOLS = ["circulo", "rectangulo"];
  let shapeSnapshot = null;

  // Guarda el estado actual del lienzo para poder deshacer
  const saveHistory = () => {
    const snap = drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
    drawHistory.push(snap);
    if (drawHistory.length > MAX_HISTORY) drawHistory.shift();
  };

  const startDraw = (e) => {
    if ($("draw-toolbar").style.display === "none") return; // solo el dibujante
    const pos = getPos(e);

    if (drawTool === "cubo") {
      saveHistory();
      floodFill(pos, drawColor);
      send({ type: "draw_fill", fill: { x: pos.x, y: pos.y, color: drawColor } });
      return;
    }

    saveHistory(); // guarda antes de comenzar el trazo
    drawing = true;
    lastDrawPoint = pos;

    if (SHAPE_TOOLS.includes(drawTool)) {
      shapeSnapshot = drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
    }
  };
  const moveDraw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPos(e);

    if (SHAPE_TOOLS.includes(drawTool)) {
      // Restaura el lienzo y dibuja la forma en su tamaño actual (vista previa en vivo)
      drawCtx.putImageData(shapeSnapshot, 0, 0);
      drawShape({ tool: drawTool, from: lastDrawPoint, to: pos, color: drawColor, size: drawSize });
      return;
    }

    const stroke = { from: lastDrawPoint, to: pos, color: drawColor, size: drawSize, tool: drawTool };
    drawSegment(stroke);
    send({ type: "draw_stroke", stroke });
    lastDrawPoint = pos;
  };
  const endDraw = (e) => {
    if (!drawing) return;
    if (SHAPE_TOOLS.includes(drawTool) && lastDrawPoint) {
      const pos = e ? (e.changedTouches ? getPos({ touches: e.changedTouches }) : getPos(e)) : lastDrawPoint;
      const shape = { tool: drawTool, from: lastDrawPoint, to: pos, color: drawColor, size: drawSize };
      drawCtx.putImageData(shapeSnapshot, 0, 0);
      drawShape(shape);
      send({ type: "draw_shape", shape });
      shapeSnapshot = null;
    }
    drawing = false;
    lastDrawPoint = null;
  };

  drawCanvas.addEventListener("mousedown", startDraw);
  drawCanvas.addEventListener("mousemove", moveDraw);
  drawCanvas.addEventListener("mouseup", endDraw);
  drawCanvas.addEventListener("mouseleave", endDraw);
  drawCanvas.addEventListener("touchstart", startDraw);
  drawCanvas.addEventListener("touchmove", moveDraw);
  drawCanvas.addEventListener("touchend", endDraw);
}

// ----- Selector de color cuadrado (saturación/valor + matiz, modelo HSV) -----
function hsvToHex(h, s, v) {
  s /= 100; v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  const toHex = n => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Refleja drawHue/drawSat/drawVal en el selector de color (cursores y vista previa)
function syncColorPickerUI() {
  const svBox = $("color-picker-sv");
  const svCursor = $("color-picker-sv-cursor");
  const hueBar = $("color-picker-hue");
  const hueCursor = $("color-picker-hue-cursor");
  const preview = $("color-picker-preview");
  if (!svBox || !svCursor || !hueBar || !hueCursor || !preview) return;

  svBox.style.setProperty("--picker-hue", drawHue);
  preview.style.background = drawColor;
  // Posición del cursor SV: x = saturación, y = (100 - valor)
  svCursor.style.left = drawSat + "%";
  svCursor.style.top = (100 - drawVal) + "%";
  hueCursor.style.top = (drawHue / 360 * 100) + "%";
}

// Reinicia el color de dibujo a negro al empezar una nueva ronda de Draw
function resetDrawColor() {
  drawHue = 0;
  drawSat = 0;
  drawVal = 0;
  drawColor = "#000000";
  syncColorPickerUI();
}

function initColorPicker() {
  const svBox = $("color-picker-sv");
  const svCursor = $("color-picker-sv-cursor");
  const hueBar = $("color-picker-hue");
  const hueCursor = $("color-picker-hue-cursor");
  const preview = $("color-picker-preview");

  function updatePreview() {
    drawColor = hsvToHex(drawHue, drawSat, drawVal);
    syncColorPickerUI();
  }

  function setFromSV(clientX, clientY) {
    const rect = svBox.getBoundingClientRect();
    let x = (clientX - rect.left) / rect.width;
    let y = (clientY - rect.top) / rect.height;
    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));
    drawSat = Math.round(x * 100);
    drawVal = Math.round((1 - y) * 100);
    updatePreview();
  }

  function setFromHue(clientY) {
    const rect = hueBar.getBoundingClientRect();
    let y = (clientY - rect.top) / rect.height;
    y = Math.max(0, Math.min(1, y));
    drawHue = Math.round(y * 360);
    updatePreview();
  }

  let draggingSV = false, draggingHue = false;

  svBox.addEventListener("mousedown", e => { draggingSV = true; setFromSV(e.clientX, e.clientY); });
  svBox.addEventListener("touchstart", e => { draggingSV = true; setFromSV(e.touches[0].clientX, e.touches[0].clientY); });

  hueBar.addEventListener("mousedown", e => { draggingHue = true; setFromHue(e.clientY); });
  hueBar.addEventListener("touchstart", e => { draggingHue = true; setFromHue(e.touches[0].clientY); });

  window.addEventListener("mousemove", e => {
    if (draggingSV) setFromSV(e.clientX, e.clientY);
    if (draggingHue) setFromHue(e.clientY);
  });
  window.addEventListener("touchmove", e => {
    if (draggingSV) { e.preventDefault(); setFromSV(e.touches[0].clientX, e.touches[0].clientY); }
    if (draggingHue) { e.preventDefault(); setFromHue(e.touches[0].clientY); }
  }, { passive: false });

  window.addEventListener("mouseup", () => { draggingSV = false; draggingHue = false; });
  window.addEventListener("touchend", () => { draggingSV = false; draggingHue = false; });

  updatePreview();
}

function drawSegment(stroke) {
  const tool = stroke.tool || "lapiz";
  let color = stroke.color;
  let size = stroke.size;
  let alpha = 1;

  if (tool === "rotulador") {
    // Rotulador: trazo más grueso y semitransparente, tipo marcador
    size = stroke.size * 2.2;
    alpha = 0.55;
  } else if (tool === "goma") {
    // Goma de borrar: pinta con el color de fondo del lienzo
    color = CANVAS_BG;
    size = stroke.size * 3;
    alpha = 1;
  }

  drawCtx.save();
  drawCtx.globalAlpha = alpha;
  drawCtx.strokeStyle = color;
  drawCtx.lineWidth = size;
  drawCtx.lineCap = "round";
  drawCtx.lineJoin = "round";
  drawCtx.beginPath();
  drawCtx.moveTo(stroke.from.x, stroke.from.y);
  drawCtx.lineTo(stroke.to.x, stroke.to.y);
  drawCtx.stroke();
  drawCtx.restore();
}

function drawShape(shape) {
  const { from, to, color, size, tool } = shape;
  drawCtx.save();
  drawCtx.strokeStyle = color;
  drawCtx.lineWidth = size;
  drawCtx.lineJoin = "round";

  if (tool === "rectangulo") {
    const x = Math.min(from.x, to.x);
    const y = Math.min(from.y, to.y);
    const w = Math.abs(to.x - from.x);
    const h = Math.abs(to.y - from.y);
    drawCtx.strokeRect(x, y, w, h);
  } else if (tool === "circulo") {
    const cx = (from.x + to.x) / 2;
    const cy = (from.y + to.y) / 2;
    const rx = Math.abs(to.x - from.x) / 2;
    const ry = Math.abs(to.y - from.y) / 2;
    drawCtx.beginPath();
    drawCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    drawCtx.stroke();
  }
  drawCtx.restore();
}

// ----- Cubo de pintura: relleno por inundación (flood fill) -----
function hexToRgba(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
    255,
  ];
}

function floodFill(pos, hexColor) {
  const w = drawCanvas.width, h = drawCanvas.height;
  const imgData = drawCtx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const x0 = Math.floor(pos.x), y0 = Math.floor(pos.y);
  if (x0 < 0 || y0 < 0 || x0 >= w || y0 >= h) return;

  const startIdx = (y0 * w + x0) * 4;
  const target = [data[startIdx], data[startIdx + 1], data[startIdx + 2], data[startIdx + 3]];
  const fill = hexToRgba(hexColor);

  // Si ya es del color de relleno, no hacer nada
  if (target[0] === fill[0] && target[1] === fill[1] && target[2] === fill[2]) return;

  const tolerance = 30;
  const matches = (idx) => {
    return Math.abs(data[idx] - target[0]) <= tolerance &&
           Math.abs(data[idx + 1] - target[1]) <= tolerance &&
           Math.abs(data[idx + 2] - target[2]) <= tolerance &&
           Math.abs(data[idx + 3] - target[3]) <= tolerance;
  };

  const stack = [[x0, y0]];
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    const idx = (y * w + x) * 4;
    if (!matches(idx)) continue;

    data[idx] = fill[0];
    data[idx + 1] = fill[1];
    data[idx + 2] = fill[2];
    data[idx + 3] = fill[3];

    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  drawCtx.putImageData(imgData, 0, 0);
}

function handleDrawShape(msg) {
  if (!drawCtx) return;
  drawShape(msg.shape);
}

function handleDrawFill(msg) {
  if (!drawCtx) return;
  floodFill({ x: msg.fill.x, y: msg.fill.y }, msg.fill.color);
}

function clearDrawCanvas(notify) {
  if (!drawCtx) return;
  drawHistory = []; // al borrar todo se limpia el historial
  drawCtx.fillStyle = CANVAS_BG;
  drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
  if (notify) send({ type: "draw_clear" });
}

function undoDraw() {
  if (!drawCtx || drawHistory.length === 0) return;
  const snap = drawHistory.pop();
  drawCtx.putImageData(snap, 0, 0);
  // Enviar el estado actual del lienzo a los espectadores como imagen
  const dataUrl = drawCanvas.toDataURL("image/png");
  send({ type: "draw_undo", dataUrl });
}

function handleDrawStroke(msg) {
  if (!drawCtx) return;
  drawSegment(msg.stroke);
}

function handleDrawClear() {
  clearDrawCanvas(false);
}

function handleDrawUndo(msg) {
  if (!drawCtx || !msg.dataUrl) return;
  const img = new Image();
  img.onload = () => {
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    drawCtx.drawImage(img, 0, 0);
  };
  img.src = msg.dataUrl;
}

function submitDrawGuess() {
  const input = $("draw-guess-input");
  const guess = input.value.trim();
  if (!guess || input.disabled) return;
  send({ type: "draw_guess", guess, timeLeft });
  addDrawChatLine(`Tú: ${guess}`, "pending");
  input.value = "";
  input.focus();
}

function submitDrawerChat() {
  const input = $("draw-drawer-chat-input");
  const text = input.value.trim();
  if (!text) return;
  send({ type: "draw_chat", text });
  addDrawChatLine(`Tú: ${text}`, "pending");
  input.value = "";
  input.focus();
}

document.addEventListener("keydown", (e) => {
  if (e.target.id === "draw-guess-input" && e.key === "Enter") {
    submitDrawGuess();
  }
  if (e.target.id === "draw-drawer-chat-input" && e.key === "Enter") {
    submitDrawerChat();
  }
  // Ctrl+Z o Cmd+Z: deshacer último trazo (solo si el dibujante tiene el foco fuera de inputs)
  if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.target.tagName !== "INPUT") {
    undoDraw();
    e.preventDefault();
  }
});

function addDrawChatLine(text, type) {
  const li = document.createElement("li");
  li.className = "draw-chat-line " + (type || "");
  li.textContent = text;
  const chat = $("draw-chat");
  chat.appendChild(li);
  chat.scrollTop = chat.scrollHeight;
}

function handleDrawGuessCorrect(msg) {
  addDrawChatLine(`✓ ${msg.name} acertó (+${msg.points} pts)`, "correct");
  // Si yo acerté, deshabilito mi input
  if (msg.name === myPlayerName) {
    const input = $("draw-guess-input");
    if (input) input.disabled = true;
  }
}

function handleDrawGuessWrong(msg) {
  addDrawChatLine(`${msg.name}: ${msg.guess}`, "wrong");
}

function revealDraw(msg) {
  clearInterval(timerInterval);
  stopTickSound();
  isMyDrawGuesser = false;
  $("draw-timer").textContent = "";
  $("draw-guess-input").disabled = true;

  // Ocultar el lienzo y el chat, mostrar la revelación
  $("draw-main-row").style.display = "none";

  const revealCard = $("draw-reveal-image-card");
  const img = $("draw-reveal-image");
  const nameEl = $("draw-reveal-name");

  if (msg.image) {
    img.src = msg.image;
    img.style.display = "block";
    img.onerror = () => { img.style.display = "none"; };
  } else {
    img.style.display = "none";
  }
  nameEl.textContent = `El personaje era: ${msg.correctAnswer}`;
  revealCard.style.display = "flex";

  const fb = $("answer-feedback");
  fb.style.display = "block";
  if (msg.guessers && msg.guessers.length) {
    fb.className = "answer-feedback correct";
    fb.textContent = `✓ Acertaron: ${msg.guessers.join(", ")}`;
  } else {
    fb.className = "answer-feedback wrong";
    fb.textContent = `¡Nadie lo adivinó!`;
  }
}



function updateTimerBar(elId, t, total) {
  const bar = $(`${elId}-bar`);
  if (!bar) return;
  const pct = total > 0 ? Math.max(0, Math.min(100, (t / total) * 100)) : 0;
  bar.style.width = pct + "%";
  bar.className = "timer-bar" + (t <= 5 ? " danger" : t <= 10 ? " warning" : "");
}

function updateTimer(t, timerKind) {
  ["timer", "photo-timer", "draw-timer"].forEach(id => {
    const el = $(id);
    if (!el) return;
    el.textContent = t;
    el.className = "timer-display" + (t <= 5 ? " danger" : t <= 10 ? " warning" : "");
    updateTimerBar(id, t, currentQuestionTimeLimit);
  });

  const tick = $("sound-tick");
  const threshold = 10;

  if (t > 0 && t <= threshold) {
    if (tick) { tick.currentTime = 0; tick.volume = 1.0; tick.play().catch(() => {}); }
  } else if (t <= 0) {
    // Parar el sonido de cuenta atrás inmediatamente al terminar la ronda
    if (tick) { tick.pause(); tick.currentTime = 0; }
  }

  // Actualizar el badge de puntos en directo durante la ronda de Draw
  if (isMyDrawGuesser && timeLeft != null) {
    updateDrawPointsBadge(t);
  }
}

function stopTickSound() {
  const tick = $("sound-tick");
  if (tick) { tick.pause(); tick.currentTime = 0; }
}

// ===== ABUCHEO =====
function sendBoo() {
  send({ type: "boo" });
  const btn = $("boo-btn");
  btn.disabled = true;
  setTimeout(() => btn.disabled = false, 2000);
}

function updateBooButton() {
  const btn = $("boo-btn");
  if (!btn) return;
  const activeScreens = ["choose", "game", "draw-choice"];
  const onActiveScreen = activeScreens.some(s => $(`screen-${s}`)?.classList.contains("active"));
  btn.style.display = (onActiveScreen && !isMyTurn) ? "flex" : "none";
}

function handleBoo(msg) {
  const sound = $("sound-boo");
  if (sound) { sound.currentTime = 0; sound.play().catch(() => {}); }

  const fromName = msg.from === myPlayerName ? "Tú" : msg.from;
  const targetName = msg.target === myPlayerName ? "ti" : msg.target;

  const drawChatActive = $("screen-game")?.classList.contains("active") &&
    $("draw-block")?.classList.contains("active");

  if (drawChatActive) {
    const text = targetName
      ? `📣 ${fromName} ${fromName === "Tú" ? "abucheas" : "abuchea"} a ${targetName}`
      : `📣 ${fromName} ${fromName === "Tú" ? "estás abucheando" : "está abucheando"}`;
    addDrawChatLine(text, "boo");
  } else {
    const popup = $("boo-popup");
    popup.textContent = msg.target === myPlayerName
      ? `📣 ¡${fromName} te está abucheando!`
      : `📣 ${fromName} abuchea a ${targetName || "alguien"}`;
    popup.className = "show";
    setTimeout(() => popup.className = "", 2500);
  }
}

function submitAnswer(index) {
  if (!isMyTurn || selectedAnswer !== null) return;
  selectedAnswer = index;

  const btns = $("options-grid").querySelectorAll(".option-btn");
  btns.forEach(b => b.disabled = true);
  btns[index].classList.add("selected");

  clearInterval(timerInterval);
  send({ type: "answer", index, timeLeft });
}

// ===== REVEAL =====
function revealAnswer(msg) {
  clearInterval(timerInterval);
  stopTickSound();

  if (msg.questionType === "photo") {
    revealPhoto(msg);
    return;
  }
  if (msg.questionType === "draw") {
    revealDraw(msg);
    return;
  }

  $("timer").textContent = "";

  const btns = $("options-grid").querySelectorAll(".option-btn");
  btns.forEach((b, i) => {
    b.disabled = true;
    b.classList.remove("spectator");
    if (i === msg.correctIndex) b.classList.add("correct");
    else if (i === msg.answeredIndex && msg.answeredIndex !== msg.correctIndex) b.classList.add("wrong");
  });

  if (msg.questionType === "opening" || msg.questionType === "ost") {
    if (msg.image) {
      const audio = $("q-audio");
      audio.pause();
      audio.currentTime = 0;
      if (bgmAudio) bgmAudio.volume = 0.35;
      $("q-image-card").style.display = "block";
      $("q-audio-card").style.display = "block";
      $("q-image").src = msg.image;
      $("q-image-caption").textContent = `Era: ${msg.correctAnime}`;
    }
  }

  const fb = $("answer-feedback");
  if (isMyTurn && msg.answeredIndex !== null && msg.answeredIndex !== undefined) {
    fb.style.display = "block";
    if (msg.answeredIndex === msg.correctIndex) {
      fb.className = "answer-feedback correct";
      fb.textContent = "✓ ¡Correcto!";
    } else {
      fb.className = "answer-feedback wrong";
      fb.textContent = "✗ Incorrecto";
    }
  } else if (isMyTurn && (msg.answeredIndex === null || msg.answeredIndex === undefined)) {
    fb.style.display = "block";
    fb.className = "answer-feedback wrong";
    fb.textContent = "⏱ Tiempo agotado";
  } else {
    const activeName = msg.roomState.currentTurnName;
    fb.style.display = "block";
    if (msg.answeredIndex === msg.correctIndex) {
      fb.className = "answer-feedback correct";
      fb.textContent = `✓ ${activeName} acertó`;
    } else if (msg.answeredIndex === null || msg.answeredIndex === undefined) {
      fb.className = "answer-feedback wrong";
      fb.textContent = `⏱ ${activeName} no respondió a tiempo`;
    } else {
      fb.className = "answer-feedback wrong";
      fb.textContent = `✗ ${activeName} falló`;
    }
  }
}

function revealPhoto(msg) {
  clearInterval(timerInterval);
  $("photo-timer").textContent = "";
  $("photo-image").src = msg.finalImage;
  $("photo-hint-label").textContent = "Respuesta";
  $("photo-input").disabled = true;
  $("photo-submit-btn").disabled = true;
  $("photo-answer-card").style.display = "block";
  $("photo-spectator-card").style.display = "none";

  const fb = $("answer-feedback");
  fb.style.display = "block";
  if (msg.correct) {
    fb.className = "answer-feedback correct";
    fb.textContent = `✓ ¡Correcto! Era ${msg.correctAnime} (+${msg.pointsAwarded} pts)`;
  } else {
    fb.className = "answer-feedback wrong";
    if (msg.guess) {
      fb.textContent = `✗ Incorrecto. Respondiste "${msg.guess}". Era ${msg.correctAnime}`;
    } else {
      fb.textContent = `⏱ No se respondió a tiempo. Era ${msg.correctAnime}`;
    }
  }
}

// ===== PHOTO NEXT HINT (sin reveal final aún) =====
function handlePhotoNextHint(msg) {
  clearInterval(timerInterval);
  if (msg.wrongGuess) {
    showToast(`"${msg.wrongGuess}" no es correcto. Nueva pista…`, "error");
  } else {
    showToast("Tiempo agotado. Nueva pista…", "error");
  }
  $("photo-input").value = "";
  $("photo-suggestions").innerHTML = "";
  if (isMyTurn) {
    $("photo-input").disabled = false;
    $("photo-submit-btn").disabled = false;
    photoAnswered = false;
  }
}

// ===== TURN SCOREBOARD =====
function showTurnScoreboard(msg) {
  showScreen("turn-scoreboard");
  const sorted = [...msg.leaderboard].sort((a, b) => b.score - a.score);
  const list = $("turn-leaderboard");
  list.innerHTML = "";
  const medals = ["🥇", "🥈", "🥉"];
  sorted.forEach((p, i) => {
    const li = document.createElement("li");
    const rankClass = i === 0 ? "first" : i === 1 ? "second" : i === 2 ? "third" : "";
    const highlight = p.id === playerId ? " you" : "";
    li.className = highlight.trim();
    li.innerHTML = `
      <span class="rank ${rankClass}">${medals[i] || (i + 1)}</span>
      <div class="player-avatar">${p.name.slice(0,2).toUpperCase()}</div>
      <span>${p.name}${p.id === playerId ? " (tú)" : ""}</span>
      <span class="player-score">${p.score} pts</span>
    `;
    list.appendChild(li);
  });
}

// ===== FINAL =====
function showFinished(leaderboard) {
  showScreen("finished");
  const list = $("final-leaderboard");
  list.innerHTML = "";
  const medals = ["🥇", "🥈", "🥉"];
  leaderboard.forEach((p, i) => {
    const li = document.createElement("li");
    const rankClass = i === 0 ? "first" : i === 1 ? "second" : i === 2 ? "third" : "";
    li.innerHTML = `
      <span class="rank ${rankClass}">${medals[i] || (i + 1)}</span>
      <div class="player-avatar">${p.name.slice(0,2).toUpperCase()}</div>
      <span>${p.name}</span>
      <span class="player-score">${p.score} pts</span>
    `;
    list.appendChild(li);
  });
  $("host-again").style.display = isHost ? "block" : "none";
  $("guest-again").style.display = isHost ? "none" : "block";
}

function playAgain() { send({ type: "play_again" }); }

// ===== MENSAJES =====
function handleMessage(msg) {
  switch (msg.type) {
    case "room_created":
      playerId = msg.playerId; isHost = true;
      myPlayerName = $("input-name").value.trim();
      animeList = msg.animeList || [];
      bgmTracks = msg.bgmTracks || [];
      updateBgmButtonVisibility();
      showScreen("lobby"); renderLobby(msg.roomState);
      showToast(`Sala ${msg.code} creada`, "success");
      break;
    case "joined":
      playerId = msg.playerId; isHost = false;
      myPlayerName = $("input-name").value.trim();
      animeList = msg.animeList || [];
      bgmTracks = msg.bgmTracks || [];
      updateBgmButtonVisibility();
      showScreen("lobby"); renderLobby(msg.roomState);
      showToast(`Conectado a sala ${msg.code}`, "success");
      break;
    case "player_joined":
      renderLobby(msg.roomState); showToast("Un jugador se ha unido");
      break;
    case "player_left":
      renderLobby(msg.roomState); showToast("Un jugador ha salido");
      break;
    case "game_starting":
      showToast("¡La partida empieza!", "success");
      startBgm();
      break;
    case "stage_intro":
      showStageIntro(msg.stage);
      break;
    case "choose_difficulty":
      renderChooseDifficulty(msg);
      break;
    case "draw_choose":
      renderDrawChoice(msg);
      break;
    case "question":
      showQuestion(msg);
      break;
    case "timer":
      timeLeft = msg.remaining;
      if (timerContext === "question") {
        updateTimer(msg.remaining, msg.timerKind);
      }
      // Durante las fases de elección (dificultad / personaje a dibujar),
      // el contador propio (updateChooseTimer/updateDrawChooseTimer) ya
      // gestiona su visualización; no debe sonar el tick aquí.
      break;
    case "answer_result":
      // El jugador activo ya sabe si acertó; el reveal lo confirma para todos
      break;
    case "photo_next_hint":
      handlePhotoNextHint(msg);
      break;
    case "draw_stroke":
      handleDrawStroke(msg);
      break;
    case "draw_shape":
      handleDrawShape(msg);
      break;
    case "draw_fill":
      handleDrawFill(msg);
      break;
    case "draw_clear":
      handleDrawClear();
      break;
    case "draw_undo":
      handleDrawUndo(msg);
      break;
    case "draw_guess_correct":
      handleDrawGuessCorrect(msg);
      break;
    case "draw_guess_wrong":
      handleDrawGuessWrong(msg);
      break;
    case "draw_chat":
      addDrawChatLine(`${msg.name}: ${msg.text}`, "");
      break;
    case "boo":
      handleBoo(msg);
      break;
    case "reveal":
      revealAnswer(msg);
      break;
    case "turn_scoreboard":
      showTurnScoreboard(msg);
      break;
    case "finished":
      showFinished(msg.leaderboard);
      stopBgm();
      break;
    case "back_to_lobby":
      showScreen("lobby"); renderLobby(msg.roomState);
      showToast("De vuelta al lobby", "success");
      stopBgm();
      break;
    case "error":
      showToast(msg.message, "error");
      break;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  $("input-code")?.addEventListener("keydown", e => { if (e.key === "Enter") joinRoom(); });
  $("input-name")?.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      $("join-section").style.display === "block" ? joinRoom() : goToCreate();
    }
  });
});
