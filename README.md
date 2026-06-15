# 🎌 AnimeQuiz — Trivial multijugador de anime

Juego de preguntas estilo trivial para 2–8 jugadores, con servidor en tiempo real (WebSockets).  
Categorías: Personajes · Animes clásicos · Animes recientes · Openings/Música · Tramas y arcos · Manga y conocimiento general.

---

## Requisitos

- [Node.js](https://nodejs.org/) v18 o superior

---

## Instalación y arranque local

```bash
# 1. Entra a la carpeta del proyecto
cd animequiz

# 2. Instala las dependencias
npm install

# 3. Arranca el servidor
npm start
```

Abre tu navegador en **http://localhost:3000**

---

## ¿Cómo jugar en línea con amigos?

Para que tus amigos se conecten desde sus casas necesitas que el servidor sea accesible por internet.  
Tienes dos opciones gratuitas:

---

### Opción A — Railway (recomendada, gratis)

1. Crea cuenta en https://railway.app
2. En el dashboard → **New Project → Deploy from GitHub**
3. Sube el código a GitHub (o usa **Deploy from local** con la CLI)
4. Railway detecta automáticamente que es Node.js y ejecuta `npm start`
5. Ve a **Settings → Networking → Generate Domain**
6. Comparte esa URL con tus amigos (ej. `https://animequiz-production.up.railway.app`)

---

### Opción B — Render (también gratis)

1. Crea cuenta en https://render.com
2. **New → Web Service → Connect a repository**
3. Build Command: `npm install`  
   Start Command: `npm start`
4. Una vez desplegado, copia la URL pública y compártela

---

### Opción C — Ngrok (para partidas rápidas desde tu PC)

Si no quieres subir a ningún servidor, puedes exponer tu localhost temporalmente:

```bash
# Instala ngrok desde https://ngrok.com
# Con el servidor corriendo en otra terminal:
ngrok http 3000
```

Ngrok te dará una URL tipo `https://xxxx.ngrok.io` — compártela con tus amigos.  
⚠️ Solo funciona mientras tu PC esté encendido.

---

## Cómo jugar

1. **El host** entra a la URL, escribe su nombre y pulsa **Crear sala**
2. Se genera un **código de 5 letras** (ej. `AB3XZ`)
3. **Los demás jugadores** entran a la misma URL, escriben su nombre, pulsan **Unirse a sala** e introducen el código
4. Cuando todos estén listos, el host elige el número de preguntas y pulsa **Empezar**
5. Cada pregunta tiene **20 segundos**. Responder rápido da puntos extra (bonus de velocidad)
6. Al final se muestra la **clasificación completa** con podio

---

## Sistema de puntuación

| Acción | Puntos |
|--------|--------|
| Respuesta correcta | 100 pts |
| Bonus por velocidad | hasta +100 pts (5 pts × segundos restantes) |
| Respuesta incorrecta | 0 pts |

---

## Añadir más preguntas

Edita el archivo `data/questions.js` y añade objetos con este formato:

```js
{
  category: "Personajes",          // categoría libre
  question: "¿Quién es...?",       // texto de la pregunta
  options: ["A", "B", "C", "D"],   // exactamente 4 opciones
  answer: 0,                        // índice de la opción correcta (0-3)
  difficulty: "media"               // "fácil" | "media" | "difícil"
}
```

---

## Estructura del proyecto

```
animequiz/
├── server.js           — Servidor Node.js + WebSockets
├── package.json
├── data/
│   └── questions.js    — Base de datos de preguntas
└── public/
    ├── index.html      — Interfaz del juego
    ├── css/
    │   └── style.css
    └── js/
        └── client.js   — Lógica del cliente
```
