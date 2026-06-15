Coloca aquí tus archivos de música de fondo (mp3/ogg).
Luego añade sus rutas en data/questions.js, en el array `bgmTracks`:

const bgmTracks = [
  "/audio/bgm/track1.mp3",
  "/audio/bgm/track2.mp3",
];

Se reproducirán en bucle (orden aleatorio) desde que empieza la
partida hasta que se muestran los resultados finales. Si dejas el
array vacío, no habrá música de fondo y el botón no aparecerá.
