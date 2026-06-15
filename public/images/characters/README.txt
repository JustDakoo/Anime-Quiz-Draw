Coloca aquí las imágenes de los personajes del modo Pinturillo.
Cada personaje en data/questions.js (drawCharacters) ya tiene un
campo "image" con la ruta esperada, generada automáticamente a
partir de su nombre, por ejemplo:

  { name: "Monkey D. Luffy (One Piece)", ..., image: "/images/characters/monkey_d_luffy.jpg" }

Para que aparezca la imagen al revelar la respuesta de una ronda de
dibujo, sube un archivo con ese nombre exacto a esta carpeta
(monkey_d_luffy.jpg). Si el archivo no existe, simplemente no se
mostrará ninguna imagen (no da error).

Formatos aceptados: cualquier extensión que pongas en el campo
"image" del personaje (jpg, png, webp...).
