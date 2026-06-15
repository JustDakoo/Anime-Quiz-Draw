Coloca aquí tus clips de banda sonora (OST) en mp3/ogg para la etapa
"Original Soundtracks" (adivina el anime por su banda sonora).

Funciona exactamente igual que la carpeta de openings: cada entrada del
array `osts` en data/questions.js tiene un campo "audio" con la ruta
esperada, por ejemplo:

  { anime: "Naruto", audio: "/audio/osts/naruto_ost.mp3", ... }

Sube un archivo con ese nombre exacto a esta carpeta (naruto_ost.mp3)
para que se reproduzca durante la ronda. Si el archivo no existe, el
reproductor de audio simplemente quedará vacío.

Puedes añadir, quitar o modificar entradas del array `osts` para usar
tus propias bandas sonoras y opciones.
