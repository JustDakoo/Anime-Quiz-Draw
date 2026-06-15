const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const {
  trivia, openings, osts, photoRounds, animeList, drawCharacters, bgmTracks,
  DIFFICULTY_CONFIG, WRONG_PENALTY_RATIO
} = require("./data/questions");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, "public")));

const rooms = new Map();

// ---------------------------------------------------------------
// UTILIDADES
// ---------------------------------------------------------------
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createRoom(code) {
  return {
    code,
    players: new Map(),       // id -> { ws, name, score, isHost }
    state: "lobby",           // lobby | choosing | question | reveal | turn_scoreboard | stage_intro | finished
    stages: [],                // lista de etapas en orden: ['trivia','openings','photos']
    stageIndex: 0,
    turnsPerStage: 0,          // nº de turnos (preguntas) por etapa, calculado al iniciar
    turnOrder: [],
    turnIndex: 0,              // turno global (incrementa cada pregunta)
    turnInStage: 0,            // turno dentro de la etapa actual
    currentQuestion: null,     // pregunta activa ya resuelta (con dificultad si aplica)
    currentDifficulty: null,
    photoHintIndex: 0,         // para preguntas de fotos: índice de imagen actual (0-4)
    photoUsedAnimes: new Set(),
    usedTrivia: { facil: new Set(), media: new Set(), dificil: new Set() },
    usedOpenings: new Set(),
    usedOSTs: new Set(),
    usedDrawCharacters: new Set(),
    drawChoices: null,
    drawAnswer: null,
    drawGuessers: new Set(),
    DRAW_CHOOSE_TIME: 12,
    DRAW_TIME: 180,
    questionTimer: null,
    answerTimer: null,
    CHOOSE_TIME: 15,
    QUESTION_TIME: 25,
    RESULTS_TIME: 5,
    SCOREBOARD_TIME: 4,
    STAGE_INTRO_TIME: 3,
  };
}

function broadcast(room, data) {
  for (const [, p] of room.players) {
    if (p.ws && p.ws.readyState === WebSocket.OPEN) {
      p.ws.send(JSON.stringify(data));
    }
  }
}

function currentTurnId(room) {
  if (room.turnOrder.length === 0) return null;
  return room.turnOrder[room.turnIndex % room.turnOrder.length];
}

function getRoomPublicState(room) {
  const players = [...room.players.entries()].map(([id, p]) => ({
    id, name: p.name, score: p.score, isHost: p.isHost,
  }));
  const activeId = currentTurnId(room);
  return {
    code: room.code,
    state: room.state,
    players,
    stages: room.stages,
    stageIndex: room.stageIndex,
    currentStage: room.stages[room.stageIndex] || null,
    turnInStage: room.turnInStage,
    turnsPerStage: room.turnsPerStage,
    currentTurnId: activeId,
    currentTurnName: room.players.get(activeId)?.name || "",
  };
}

// ---------------------------------------------------------------
// SELECCIÓN DE PREGUNTAS
// ---------------------------------------------------------------
function pickTriviaQuestion(room, difficulty) {
  const pool = trivia[difficulty] || [];
  const used = room.usedTrivia[difficulty];
  let candidates = pool.filter((_, i) => !used.has(i));
  if (candidates.length === 0) {
    used.clear();
    candidates = pool;
  }
  const idx = pool.indexOf(shuffle(candidates)[0]);
  used.add(idx);
  return pool[idx];
}

function pickOpeningQuestion(room) {
  let candidates = openings.filter((_, i) => !room.usedOpenings.has(i));
  if (candidates.length === 0) {
    room.usedOpenings.clear();
    candidates = openings;
  }
  const chosen = shuffle(candidates)[0];
  room.usedOpenings.add(openings.indexOf(chosen));
  return chosen;
}

function pickOSTQuestion(room) {
  let candidates = osts.filter((_, i) => !room.usedOSTs.has(i));
  if (candidates.length === 0) {
    room.usedOSTs.clear();
    candidates = osts;
  }
  const chosen = shuffle(candidates)[0];
  room.usedOSTs.add(osts.indexOf(chosen));
  return chosen;
}

function pickPhotoRound(room) {
  let candidates = photoRounds.filter(r => !room.photoUsedAnimes.has(r.anime));
  if (candidates.length === 0) {
    room.photoUsedAnimes.clear();
    candidates = photoRounds;
  }
  const chosen = shuffle(candidates)[0];
  room.photoUsedAnimes.add(chosen.anime);
  return chosen;
}

// ---------------------------------------------------------------
// FLUJO DE JUEGO
// ---------------------------------------------------------------
function startTurn(room) {
  // Comprobar si la etapa actual ha terminado
  if (room.turnInStage >= room.turnsPerStage) {
    room.stageIndex++;
    room.turnInStage = 0;
    if (room.stageIndex >= room.stages.length) {
      endGame(room);
      return;
    }
    showStageIntro(room);
    return;
  }

  const stage = room.stages[room.stageIndex];

  if (stage === "trivia") {
    // El jugador activo elige dificultad
    room.state = "choosing";
    broadcast(room, {
      type: "choose_difficulty",
      roomState: getRoomPublicState(room),
      options: Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => ({
        key, label: cfg.label, points: cfg.points, penalty: Math.floor(cfg.points * WRONG_PENALTY_RATIO)
      })),
      timeLimit: room.CHOOSE_TIME,
    });

    let remaining = room.CHOOSE_TIME;
    room.questionTimer = setInterval(() => {
      remaining--;
      broadcast(room, { type: "timer", remaining });
      if (remaining <= 0) {
        clearInterval(room.questionTimer);
        // Si no elige, dificultad por defecto: media
        beginTriviaQuestion(room, "media");
      }
    }, 1000);
  } else if (stage === "openings") {
    beginOpeningQuestion(room);
  } else if (stage === "osts") {
    beginOSTQuestion(room);
  } else if (stage === "photos") {
    beginPhotoQuestion(room);
  } else if (stage === "draw") {
    beginDrawChoice(room);
  }
}

function showStageIntro(room) {
  room.state = "stage_intro";
  broadcast(room, {
    type: "stage_intro",
    stage: room.stages[room.stageIndex],
    roomState: getRoomPublicState(room),
  });
  setTimeout(() => startTurn(room), room.STAGE_INTRO_TIME * 1000);
}

// ---- ETAPA 1: TRIVIA CON DIFICULTAD ----
function beginTriviaQuestion(room, difficulty) {
  clearInterval(room.questionTimer);
  const q = pickTriviaQuestion(room, difficulty);
  const cfg = DIFFICULTY_CONFIG[difficulty];

  room.currentQuestion = { type: "trivia", data: q };
  room.currentDifficulty = difficulty;
  room.state = "question";

  let remaining = room.QUESTION_TIME;

  broadcast(room, {
    type: "question",
    questionType: "trivia",
    question: q.question,
    options: q.options,
    category: q.category,
    difficulty,
    difficultyLabel: cfg.label,
    points: cfg.points,
    penalty: Math.floor(cfg.points * WRONG_PENALTY_RATIO),
    image: q.image,
    isCharacterClue: q.isCharacterClue,
    timeLimit: room.QUESTION_TIME,
    roomState: getRoomPublicState(room),
  });

  room.questionTimer = setInterval(() => {
    remaining--;
    broadcast(room, { type: "timer", remaining });
    if (remaining <= 0) {
      clearInterval(room.questionTimer);
      revealTriviaAnswer(room, null);
    }
  }, 1000);
}

function revealTriviaAnswer(room, answeredIndex) {
  clearInterval(room.questionTimer);
  const q = room.currentQuestion.data;
  const cfg = DIFFICULTY_CONFIG[room.currentDifficulty];
  room.state = "reveal";

  broadcast(room, {
    type: "reveal",
    questionType: "trivia",
    correctIndex: q.answer,
    answeredIndex,
    roomState: getRoomPublicState(room),
  });

  room.answerTimer = setTimeout(() => showTurnScoreboard(room), room.RESULTS_TIME * 1000);
}

// ---- ETAPA 2: OPENINGS ----
function beginOpeningQuestion(room) {
  clearInterval(room.questionTimer);
  const q = pickOpeningQuestion(room);
  room.currentQuestion = { type: "opening", data: q };
  room.state = "question";

  let remaining = room.QUESTION_TIME;

  broadcast(room, {
    type: "question",
    questionType: "opening",
    audio: q.audio,
    options: q.options,
    category: "Openings / Música",
    points: 150,
    penalty: 75,
    timeLimit: room.QUESTION_TIME,
    roomState: getRoomPublicState(room),
  });

  room.questionTimer = setInterval(() => {
    remaining--;
    broadcast(room, { type: "timer", remaining });
    if (remaining <= 0) {
      clearInterval(room.questionTimer);
      revealOpeningAnswer(room, null);
    }
  }, 1000);
}

function revealOpeningAnswer(room, answeredIndex) {
  clearInterval(room.questionTimer);
  const q = room.currentQuestion.data;
  room.state = "reveal";

  broadcast(room, {
    type: "reveal",
    questionType: "opening",
    correctIndex: q.answer,
    correctAnime: q.anime,
    image: q.image,
    answeredIndex,
    roomState: getRoomPublicState(room),
  });

  room.answerTimer = setTimeout(() => showTurnScoreboard(room), room.RESULTS_TIME * 1000);
}

// ---- ETAPA 2b: ORIGINAL SOUNDTRACKS (OST) ----
function beginOSTQuestion(room) {
  clearInterval(room.questionTimer);
  const q = pickOSTQuestion(room);
  room.currentQuestion = { type: "ost", data: q };
  room.state = "question";

  let remaining = room.QUESTION_TIME;

  broadcast(room, {
    type: "question",
    questionType: "ost",
    audio: q.audio,
    options: q.options,
    category: "Original Soundtracks",
    points: 150,
    penalty: 75,
    timeLimit: room.QUESTION_TIME,
    roomState: getRoomPublicState(room),
  });

  room.questionTimer = setInterval(() => {
    remaining--;
    broadcast(room, { type: "timer", remaining });
    if (remaining <= 0) {
      clearInterval(room.questionTimer);
      revealOSTAnswer(room, null);
    }
  }, 1000);
}

function revealOSTAnswer(room, answeredIndex) {
  clearInterval(room.questionTimer);
  const q = room.currentQuestion.data;
  room.state = "reveal";

  broadcast(room, {
    type: "reveal",
    questionType: "ost",
    correctIndex: q.answer,
    correctAnime: q.anime,
    image: q.image,
    answeredIndex,
    roomState: getRoomPublicState(room),
  });

  room.answerTimer = setTimeout(() => showTurnScoreboard(room), room.RESULTS_TIME * 1000);
}

// ---- ETAPA 3: FOTOS CON AUTOCOMPLETADO ----
function beginPhotoQuestion(room) {
  clearInterval(room.questionTimer);
  const q = pickPhotoRound(room);
  room.currentQuestion = { type: "photo", data: q };
  room.photoHintIndex = 0;
  room.state = "question";

  sendPhotoHint(room);
}

function sendPhotoHint(room) {
  clearInterval(room.questionTimer);
  const q = room.currentQuestion.data;
  const isLast = room.photoHintIndex >= q.images.length - 1;
  // Puntuación decrece con cada pista usada
  const basePoints = [250, 200, 150, 100, 50];
  const points = basePoints[room.photoHintIndex] ?? 50;

  let remaining = room.QUESTION_TIME;

  broadcast(room, {
    type: "question",
    questionType: "photo",
    image: q.images[room.photoHintIndex],
    hintIndex: room.photoHintIndex,
    totalHints: q.images.length,
    isLastHint: isLast,
    category: "Fotos / Adivina el anime",
    points,
    penalty: 0, // sin penalización en esta etapa, solo se reduce el premio
    timeLimit: room.QUESTION_TIME,
    roomState: getRoomPublicState(room),
  });

  room.questionTimer = setInterval(() => {
    remaining--;
    broadcast(room, { type: "timer", remaining });
    if (remaining <= 0) {
      clearInterval(room.questionTimer);
      handlePhotoTimeoutOrWrong(room);
    }
  }, 1000);
}

function handlePhotoTimeoutOrWrong(room) {
  const q = room.currentQuestion.data;
  if (room.photoHintIndex >= q.images.length - 1) {
    // Última pista (logo) y no acertó -> revelar
    revealPhotoAnswer(room, false, null);
  } else {
    room.photoHintIndex++;
    broadcast(room, {
      type: "photo_next_hint",
      roomState: getRoomPublicState(room),
    });
    setTimeout(() => sendPhotoHint(room), 1500);
  }
}

function revealPhotoAnswer(room, correct, guess) {
  clearInterval(room.questionTimer);
  const q = room.currentQuestion.data;
  room.state = "reveal";

  const basePoints = [250, 200, 150, 100, 50];
  const points = basePoints[room.photoHintIndex] ?? 50;

  broadcast(room, {
    type: "reveal",
    questionType: "photo",
    correctAnime: q.anime,
    guess,
    correct,
    pointsAwarded: correct ? points : 0,
    finalImage: q.images[q.images.length - 1],
    roomState: getRoomPublicState(room),
  });

  room.answerTimer = setTimeout(() => showTurnScoreboard(room), room.RESULTS_TIME * 1000);
}

// ---- ETAPA 4: DRAW (DIBUJAR Y ADIVINAR) ----
function pickDrawChoices(room) {
  let candidates = drawCharacters.filter(c => !room.usedDrawCharacters.has(c.name));
  if (candidates.length < 3) {
    room.usedDrawCharacters.clear();
    candidates = drawCharacters;
  }
  return shuffle(candidates).slice(0, 3);
}

function beginDrawChoice(room) {
  clearInterval(room.questionTimer);
  room.drawChoices = pickDrawChoices(room);
  room.drawAnswer = null;
  room.drawGuessers = new Set();
  room.state = "choosing";

  let remaining = room.DRAW_CHOOSE_TIME;

  broadcast(room, {
    type: "draw_choose",
    roomState: getRoomPublicState(room),
    options: room.drawChoices.map(c => c.name),
    timeLimit: room.DRAW_CHOOSE_TIME,
  });

  room.questionTimer = setInterval(() => {
    remaining--;
    broadcast(room, { type: "timer", remaining });
    if (remaining <= 0) {
      clearInterval(room.questionTimer);
      beginDrawRound(room, 0);
    }
  }, 1000);
}

function beginDrawRound(room, choiceIndex) {
  clearInterval(room.questionTimer);
  const character = room.drawChoices[choiceIndex] || room.drawChoices[0];
  room.drawAnswer = character;
  room.usedDrawCharacters.add(character.name);
  room.currentQuestion = { type: "draw", data: character };
  room.state = "question";

  let remaining = room.DRAW_TIME;

  for (const [id, p] of room.players) {
    if (p.ws.readyState !== WebSocket.OPEN) continue;
    p.ws.send(JSON.stringify({
      type: "question",
      questionType: "draw",
      category: "Draw",
      points: 200,
      penalty: 0,
      timeLimit: room.DRAW_TIME,
      characterToDraw: id === currentTurnId(room) ? character.name : null,
      characterImage: id === currentTurnId(room) ? character.image : null,
      roomState: getRoomPublicState(room),
    }));
  }

  room.questionTimer = setInterval(() => {
    remaining--;
    broadcast(room, { type: "timer", remaining, timerKind: "draw" });
    if (remaining <= 0) {
      clearInterval(room.questionTimer);
      revealDrawAnswer(room);
    }
  }, 1000);
}

function revealDrawAnswer(room) {
  clearInterval(room.questionTimer);
  room.state = "reveal";
  const character = room.drawAnswer;

  broadcast(room, {
    type: "reveal",
    questionType: "draw",
    correctAnswer: character.name,
    image: character.image,
    guessers: [...room.drawGuessers].map(id => room.players.get(id)?.name).filter(Boolean),
    roomState: getRoomPublicState(room),
  });

  room.answerTimer = setTimeout(() => showTurnScoreboard(room), room.RESULTS_TIME * 1000);
}


function showTurnScoreboard(room) {
  clearTimeout(room.answerTimer);
  room.state = "turn_scoreboard";

  const sorted = [...room.players.entries()]
    .map(([id, p]) => ({ id, name: p.name, score: p.score }))
    .sort((a, b) => b.score - a.score);

  broadcast(room, {
    type: "turn_scoreboard",
    leaderboard: sorted,
    roomState: getRoomPublicState(room),
  });

  setTimeout(() => {
    room.turnIndex++;
    room.turnInStage++;
    startTurn(room);
  }, room.SCOREBOARD_TIME * 1000);
}

function endGame(room) {
  room.state = "finished";
  clearInterval(room.questionTimer);
  clearTimeout(room.answerTimer);

  const sorted = [...room.players.entries()]
    .map(([id, p]) => ({ id, name: p.name, score: p.score }))
    .sort((a, b) => b.score - a.score);

  broadcast(room, { type: "finished", leaderboard: sorted });
}

// ---------------------------------------------------------------
// WEBSOCKET
// ---------------------------------------------------------------
let clientIdCounter = 0;

wss.on("connection", (ws) => {
  const clientId = String(++clientIdCounter);
  ws.clientId = clientId;

  ws.on("message", (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {

      case "create_room": {
        const code = Math.random().toString(36).substr(2, 5).toUpperCase();
        const room = createRoom(code);
        room.players.set(clientId, { ws, name: msg.name, score: 0, isHost: true });
        rooms.set(code, room);
        ws.roomCode = code;
        ws.send(JSON.stringify({
          type: "room_created", code, playerId: clientId,
          roomState: getRoomPublicState(room),
          animeList, bgmTracks,
        }));
        break;
      }

      case "join_room": {
        const room = rooms.get(msg.code?.toUpperCase());
        if (!room) { ws.send(JSON.stringify({ type: "error", message: "Sala no encontrada" })); return; }
        if (room.state !== "lobby") { ws.send(JSON.stringify({ type: "error", message: "La partida ya ha empezado" })); return; }
        if (room.players.size >= 7) { ws.send(JSON.stringify({ type: "error", message: "Sala llena (máx. 7)" })); return; }
        room.players.set(clientId, { ws, name: msg.name, score: 0, isHost: false });
        ws.roomCode = msg.code.toUpperCase();
        ws.send(JSON.stringify({
          type: "joined", code: room.code, playerId: clientId,
          roomState: getRoomPublicState(room),
          animeList, bgmTracks,
        }));
        broadcast(room, { type: "player_joined", roomState: getRoomPublicState(room) });
        break;
      }

      case "start_game": {
        const room = rooms.get(ws.roomCode);
        if (!room) return;
        const player = room.players.get(clientId);
        if (!player?.isHost) return;

        // Etapas seleccionadas y nº de turnos por etapa
        room.stages = msg.stages && msg.stages.length ? msg.stages : ["trivia", "openings", "osts", "photos"];
        room.turnsPerStage = msg.turnsPerStage || 6;

        room.stageIndex = 0;
        room.turnInStage = 0;
        room.turnIndex = 0;
        room.turnOrder = shuffle([...room.players.keys()]);
        room.usedTrivia = { facil: new Set(), media: new Set(), dificil: new Set() };
        room.usedOpenings = new Set();
        room.usedOSTs = new Set();
        room.photoUsedAnimes = new Set();
        room.usedDrawCharacters = new Set();
        for (const [, p] of room.players) p.score = 0;

        broadcast(room, { type: "game_starting", roomState: getRoomPublicState(room) });
        setTimeout(() => showStageIntro(room), 1500);
        break;
      }

      // El jugador activo elige dificultad en la etapa trivia
      case "choose_difficulty": {
        const room = rooms.get(ws.roomCode);
        if (!room || room.state !== "choosing") return;
        if (clientId !== currentTurnId(room)) return;
        if (!DIFFICULTY_CONFIG[msg.difficulty]) return;
        beginTriviaQuestion(room, msg.difficulty);
        break;
      }

      // Respuesta a pregunta tipo test (trivia u openings)
      case "answer": {
        const room = rooms.get(ws.roomCode);
        if (!room || room.state !== "question") return;
        if (clientId !== currentTurnId(room)) return;
        const player = room.players.get(clientId);
        const cq = room.currentQuestion;

        if (cq.type === "trivia") {
          const q = cq.data;
          const cfg = DIFFICULTY_CONFIG[room.currentDifficulty];
          const correct = msg.index === q.answer;
          if (correct) player.score += cfg.points;
          else player.score = Math.max(0, player.score - Math.floor(cfg.points * WRONG_PENALTY_RATIO));

          player.ws.send(JSON.stringify({ type: "answer_result", correct, score: player.score }));
          setTimeout(() => revealTriviaAnswer(room, msg.index), 400);

        } else if (cq.type === "opening") {
          const q = cq.data;
          const correct = msg.index === q.answer;
          if (correct) player.score += 150;
          else player.score = Math.max(0, player.score - 75);

          player.ws.send(JSON.stringify({ type: "answer_result", correct, score: player.score }));
          setTimeout(() => revealOpeningAnswer(room, msg.index), 400);

        } else if (cq.type === "ost") {
          const q = cq.data;
          const correct = msg.index === q.answer;
          if (correct) player.score += 150;
          else player.score = Math.max(0, player.score - 75);

          player.ws.send(JSON.stringify({ type: "answer_result", correct, score: player.score }));
          setTimeout(() => revealOSTAnswer(room, msg.index), 400);
        }
        break;
      }

      // Respuesta de texto (etapa de fotos)
      case "answer_photo": {
        const room = rooms.get(ws.roomCode);
        if (!room || room.state !== "question") return;
        if (clientId !== currentTurnId(room)) return;
        const cq = room.currentQuestion;
        if (cq.type !== "photo") return;

        const player = room.players.get(clientId);
        const q = cq.data;
        const guess = (msg.guess || "").trim().toLowerCase();
        const correctName = q.anime.trim().toLowerCase();
        const correct = guess === correctName;

        if (correct) {
          const basePoints = [250, 200, 150, 100, 50];
          const points = basePoints[room.photoHintIndex] ?? 50;
          player.score += points;
          player.ws.send(JSON.stringify({ type: "answer_result", correct: true, score: player.score }));
          revealPhotoAnswer(room, true, msg.guess);
        } else {
          player.ws.send(JSON.stringify({ type: "answer_result", correct: false, score: player.score }));
          if (room.photoHintIndex >= q.images.length - 1) {
            revealPhotoAnswer(room, false, msg.guess);
          } else {
            room.photoHintIndex++;
            broadcast(room, { type: "photo_next_hint", wrongGuess: msg.guess, roomState: getRoomPublicState(room) });
            setTimeout(() => sendPhotoHint(room), 1500);
          }
        }
        break;
      }

      case "draw_choice": {
        const room = rooms.get(ws.roomCode);
        if (!room || room.state !== "choosing") return;
        if (clientId !== currentTurnId(room)) return;
        if (!room.drawChoices) return;
        const idx = room.drawChoices.findIndex(c => c.name === msg.character);
        if (idx === -1) return;
        beginDrawRound(room, idx);
        break;
      }

      case "draw_stroke": {
        const room = rooms.get(ws.roomCode);
        if (!room || room.state !== "question") return;
        if (clientId !== currentTurnId(room)) return;
        if (!room.currentQuestion || room.currentQuestion.type !== "draw") return;
        for (const [id, p] of room.players) {
          if (id === clientId) continue;
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(JSON.stringify({ type: "draw_stroke", stroke: msg.stroke }));
          }
        }
        break;
      }

      case "draw_shape": {
        const room = rooms.get(ws.roomCode);
        if (!room || room.state !== "question") return;
        if (clientId !== currentTurnId(room)) return;
        if (!room.currentQuestion || room.currentQuestion.type !== "draw") return;
        for (const [id, p] of room.players) {
          if (id === clientId) continue;
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(JSON.stringify({ type: "draw_shape", shape: msg.shape }));
          }
        }
        break;
      }

      case "draw_fill": {
        const room = rooms.get(ws.roomCode);
        if (!room || room.state !== "question") return;
        if (clientId !== currentTurnId(room)) return;
        if (!room.currentQuestion || room.currentQuestion.type !== "draw") return;
        for (const [id, p] of room.players) {
          if (id === clientId) continue;
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(JSON.stringify({ type: "draw_fill", fill: msg.fill }));
          }
        }
        break;
      }

      case "draw_clear": {
        const room = rooms.get(ws.roomCode);
        if (!room || room.state !== "question") return;
        if (clientId !== currentTurnId(room)) return;
        for (const [id, p] of room.players) {
          if (id === clientId) continue;
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(JSON.stringify({ type: "draw_clear" }));
          }
        }
        break;
      }

      case "draw_guess": {
        const room = rooms.get(ws.roomCode);
        if (!room || room.state !== "question") return;
        if (clientId === currentTurnId(room)) return;
        if (!room.currentQuestion || room.currentQuestion.type !== "draw") return;
        const player = room.players.get(clientId);
        if (!player) return;
        if (room.drawGuessers.has(clientId)) return;

        const guess = (msg.guess || "").trim().toLowerCase();
        const character = room.currentQuestion.data;
        const correct = character.answers.includes(guess);

        if (correct) {
          const remainingRatio = Math.max(0, Math.min(1, (msg.timeLeft || 0) / room.DRAW_TIME));
          const points = Math.max(50, Math.round(50 + remainingRatio * 150));
          player.score += points;
          room.drawGuessers.add(clientId);

          const drawer = room.players.get(currentTurnId(room));
          if (drawer) drawer.score += 30;

          player.ws.send(JSON.stringify({ type: "answer_result", correct: true, score: player.score, points }));
          broadcast(room, {
            type: "draw_guess_correct",
            name: player.name,
            points,
            roomState: getRoomPublicState(room),
          });

          const totalSpectators = room.players.size - 1;
          if (room.drawGuessers.size >= totalSpectators && totalSpectators > 0) {
            revealDrawAnswer(room);
          }
        } else {
          player.ws.send(JSON.stringify({ type: "answer_result", correct: false, score: player.score }));
          for (const [id, p] of room.players) {
            if (id === clientId) continue;
            if (p.ws.readyState === WebSocket.OPEN) {
              p.ws.send(JSON.stringify({ type: "draw_guess_wrong", name: player.name, guess: msg.guess }));
            }
          }
        }
        break;
      }

      case "draw_chat": {
        const room = rooms.get(ws.roomCode);
        if (!room || room.state !== "question") return;
        if (!room.currentQuestion || room.currentQuestion.type !== "draw") return;
        const player = room.players.get(clientId);
        if (!player) return;
        const text = (msg.text || "").trim().slice(0, 200);
        if (!text) return;
        for (const [id, p] of room.players) {
          if (id === clientId) continue;
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(JSON.stringify({ type: "draw_chat", name: player.name, text }));
          }
        }
        break;
      }

      case "boo": {
        const room = rooms.get(ws.roomCode);
        if (!room) return;
        if (clientId === currentTurnId(room)) return;
        const fromPlayer = room.players.get(clientId);
        const activePlayer = room.players.get(currentTurnId(room));
        broadcast(room, {
          type: "boo",
          from: fromPlayer?.name || "Alguien",
          target: activePlayer?.name || "",
        });
        break;
      }

      case "play_again": {
        const room = rooms.get(ws.roomCode);
        if (!room) return;
        if (!room.players.get(clientId)?.isHost) return;
        room.state = "lobby";
        room.stageIndex = 0;
        room.turnInStage = 0;
        room.turnIndex = 0;
        room.stages = [];
        room.turnOrder = [];
        for (const [, p] of room.players) p.score = 0;
        broadcast(room, { type: "back_to_lobby", roomState: getRoomPublicState(room) });
        break;
      }
    }
  });

  ws.on("close", () => {
    const room = rooms.get(ws.roomCode);
    if (!room) return;
    room.players.delete(clientId);
    room.turnOrder = room.turnOrder.filter(id => id !== clientId);
    if (room.players.size === 0) {
      clearInterval(room.questionTimer);
      clearTimeout(room.answerTimer);
      rooms.delete(ws.roomCode);
    } else {
      const first = room.players.values().next().value;
      if (first) first.isHost = true;
      broadcast(room, { type: "player_left", roomState: getRoomPublicState(room) });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🎌 AnimeQuiz server corriendo en http://localhost:${PORT}\n`);
});
