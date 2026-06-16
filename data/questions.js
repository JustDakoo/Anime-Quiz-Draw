// ============================================================
// BANCO DE DATOS DEL JUEGO
// ============================================================
//
// 1) trivia      -> Preguntas tipo test (Etapa 1), agrupadas por dificultad
// 2) openings    -> Preguntas de "adivina el opening" (Etapa 2)
// 3) photoRounds -> Preguntas de "adivina el anime por la imagen" (Etapa 3)
// 4) animeList   -> Lista de animes para el autocompletado del cuadro de texto
//
// IMPORTANTE SOBRE IMÁGENES Y AUDIO:
// Los campos "image" están rellenos con URLs de ejemplo de
// Wikipedia/Wikimedia Commons (de uso libre). Para los openings
// necesitarás subir tus propios clips de audio (mp3/ogg) a la
// carpeta public/audio/ y poner aquí la ruta, por ejemplo:
// "/audio/naruto_op1.mp3"
// Para las fotos de personajes/escenas, sustituye las URLs por las
// tuyas siguiendo el mismo formato (array de 5, de más difícil a más
// fácil, siendo la última el logo del anime).
// ============================================================

// ---------------------------------------------------------------
// 1) TRIVIA - preguntas tipo test, organizadas por dificultad
// ---------------------------------------------------------------
// Campos:
//  - category: para mostrar un badge
//  - question: texto de la pregunta
//  - options: array de 4 opciones
//  - answer: índice (0-3) de la opción correcta
//  - isCharacterClue: true si la imagen es una PISTA para adivinar
//        (ej. una foto del personaje del que se pregunta).
//        Si es false/no existe, la imagen es solo CONTEXTO del anime.
//  - image: URL de la imagen (contexto o pista)
const trivia = {
  facil: [
    {
      category: "Personajes",
      question: "¿Cómo se llama esta rana extraterrestre?",
      options: ["Dororo", "Kururu", "Tamama", "ro"],
      answer: 3,
      isCharacterClue: false,
      image: "https://i.imgur.com/ZTpozXo.png"
    },
    {
      category: "Personajes",
      question: "¿Cómo se llama el protagonista de Blue Exorcist?",
      options: ["Yukio Okumura", "Rin Okumura", "Amaimon", "Mephisto Pheles"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/6ZZ9fD0.png"
    },
    {
      category: "Personajes",
      question: "¿Cuál es el nombre completo del clan al que pertenece Itachi?",
      options: ["Clan Uchiha", "Clan Senju", "Clan Hyuga", "Clan Uzumaki"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/baXSuM2.png"
    },
    {
      category: "Personajes",
      question: "¿Cómo se llama el detective atrapado en el cuerpo de un niño en Detective Conan?",
      options: ["Kaito Kid", "Shinichi Kudo", "Heiji Hattori", "Kogoro Mori"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/7JDXQN5.jpeg"
    },
    {
      category: "Personajes",
      question: "¿Cuál es el nombre completo del protagonista de Death Note?",
      options: ["Light Yagami", "L. Lawliet", "Mecha Nate River", "Mello Tero Keehl"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/VVXzbJv.jpeg"
    },
    {
      category: "Personajes",
      question: "¿Cómo se llama la protagonista principal de Elfen Lied?",
      options: ["Lucy", "Nana", "Mariko", "Yuka"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/OhDGEBW.png"
    },
    {
      category: "Personajes",
      question: "¿Qué técnica usa Naruto Uzumaki para crear copias de sí mismo?",
      options: ["Kage Bunshin no Jutsu", "Rasengan", "Sexy Jutsu", "Summoning Jutsu"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/nuIiMT7.png"
    },
    {
      category: "Personajes",
      question: "¿Quién se comió la fruta del Diablo Gomu Gomu?",
      options: ["Zoro", "Luffy", "Shanks", "Ace"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/IQnyqG6.png"
    },
    {
      category: "Personajes",
      question: "¿Cómo se llama el demonio que vive dentro de Naruto?",
      options: ["Kyubi - Kurama", "Hachibi", "Ichibi - Shukaku", "Nibi - Matatabi"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/Y6rI2sS.png"
    },
    {
      category: "Animes clásicos",
      question: "¿En qué ciudad ficticia se desarrolla la mayor parte de Dragon Ball Z en sus inicios?",
      options: ["Ciudad Este", "Ciudad Oeste", "Pueblo Pingüino", "Ciudad Naranja"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/xiNAPe5.jpeg"
    },
    {
      category: "Animes recientes",
      question: "¿Cuál es el nombre del grupo de cazadores de demonios en Demon Slayer: Kimetsu no Yaiba?",
      options: ["Cuerpo de Exterminio de Demonios", "Escuadrón de Asesinos Demoníacos", "Cazadores de Demonios", "Los 5 Pilares de Hierro"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/1v505a7.jpeg"
    },
    {
      category: "Personajes",
      question: "¿Qué científico revive a la humanidad en Dr. Stone?",
      options: ["Chrome", "Gen", "Taiju", "Senku"],
      answer: 3,
      isCharacterClue: false,
      image: "https://i.imgur.com/ZLAGu0T.jpeg"
    },
    {
      category: "Personajes",
      question: "¿Cuál es el sueño de Monkey D. Luffy?",
      options: ["Ser el mejor espadachín", "Convertirse en el Rey de los Piratas", "Encontrar el One Piece para venderlo", "Ser almirante de la Marina"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/IoPFalt.png"
    },
    {
      category: "Animes recientes",
      question: "¿En qué academia estudian los protagonistas de Boku no Hero Academia?",
      options: ["U.A. High School", "U.E. Shiketsu", "L.U. Ketsubutsu", "A.U. Seijin High"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/SX6iF42.jpeg"
    },
    {
      category: "Personajes",
      question: "¿Quién es el mejor amigo y rival de Naruto desde la infancia?",
      options: ["Shikamaru Nara", "Kiba Inuzuka", "Sasuke Uchiha", "Rock Lee"],
      answer: 2,
      isCharacterClue: false,
      image: "https://i.imgur.com/01vDFzD.png"
    },
    {
      category: "Animes recientes",
      question: "¿Cuál es el apellido del protagonista de Jujutsu Kaisen, Yuji?",
      options: ["Itadori", "Fushiguro", "Gojo", "Kugisaki"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/Dc3XNaX.png"
    },
    {
      category: "Personajes",
      question: "¿Cuál es el nombre del gigante en el que Eren Jaeger puede transformarse en Attack on Titan?",
      options: ["Titán Acorazado", "Titán Bestia", "Titán de Ataque", "Titán Colosal"],
      answer: 2,
      isCharacterClue: false,
      image: "https://i.imgur.com/i86Yprh.jpeg"
    },
    {
      category: "Tramas y arcos",
      question: "¿Qué evento desencadena la trama principal de Death Note?",
      options: ["Ryuk lanza un cuaderno de muerte al mundo humano", "Light Yagami ve como matan a su madre", "Misa Amane mata a un criminal", "Near forma la SPK"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/VVXzbJv.jpeg"
    },
    {
      category: "Animes recientes",
      question: "¿Cómo se llama el dominio de Gojo Satoru en Jujutsu Kaisen?",
      options: ["Expansión de Dominio: Vacío Infinito", "Expansión de Dominio: Vacío Negro", "Expansión de Dominio:  Vacío Morado", "Expansión de Dominio: Vacío Rojo"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/WP3181Z.png"
    },
    {
      category: "Personajes",
      question: "¿Cuál es el apellido del piloto Takumi en Initial D?",
      options: ["Fujiwara", "Tachibana", "Akagi", "Takahashi"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/iUwnyYs.png"
    },
    {
      category: "Tramas y arcos",
      question: "¿En qué saga de Dragon Ball Z aparece por primera vez la transformación Super Saiyan?",
      options: ["Saga Saiyan", "Saga Freezer", "Saga Cell", "Saga Buu"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/xiNAPe5.jpeg"
    },
  ],
  media: [
    {
      category: "Manga y conocimiento general",
      question: "¿Cómo se denomina el estilo de dibujo de cabeza y ojos grandes y cuerpo pequeño?",
      options: ["Chibi", "Moe", "Kawaii", "Gyaaru"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/5End7y6.png"
    },
    {
      category: "Personajes",
      question: "¿Cómo se llama el samurái protagonista de Samurai Champloo?",
      options: ["Jin", "Mugen", "Fuu", "Sara"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/j35CrWR.jpeg"
    },
    {
      category: "Animes clásicos",
      question: "¿Qué objeto buscan los hermanos Elric en Fullmetal Alchemist?",
      options: ["La Piedra Filosofal", "El Grial Sagrado", "La Espada Sagrada", "El Anillo Perdido"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/U0wRElC.jpeg"
    }, 
    {
      category: "Tramas y arcos",
      question: "¿Cómo se llama el primer arco narrativo de One Piece?",
      options: ["Arco de Arabasta", "Arco de Romance Dawn", "Arco de Marineford", "Arco del East Blue"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/ddlhjKa.jpeg"
    },
    {
      category: "Manga y conocimiento general",
      question: "¿Qué significa la palabra japonesa 'shonen' en el contexto del manga?",
      options: ["Dirigido a chicos adolescentes", "Dirigido a chicas adolescentes", "Dirigido a hombres adultos", "Dirigido a niños pequeños"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/tzdtdSC.png"
    },
    {
      category: "Animes clásicos",
      question: "¿Cómo se llama el robot gigante que pilota Shinji Ikari en Evangelion?",
      options: ["Unit-00", "Unit-01", "Unit-02", "Unit-03"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/ESjLHaA.png"
    },
    {
      category: "Manga y conocimiento general",
      question: "¿Quién es el autor original del manga de One Piece?",
      options: ["Masashi Kishimoto", "Eiichiro Oda", "Akira Toriyama", "Tite Kubo"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/V6e6lqO.png"
    },
    {
      category: "Animes clásicos",
      question: "¿Cuál es el nombre del barco en el que viaja la tripulación de Luffy después del Going Merry?",
      options: ["Best Merry", "Burning Merry", "Thousand Sunny", "Hundred Sunny"],
      answer: 2,
      isCharacterClue: false,
      image: "https://i.imgur.com/ddlhjKa.jpeg"
    },
    {
      category: "Personajes",
      question: "¿Cuál es el nombre del Zanpakuto de Ichigo Kurosaki en Bleach?",
      options: ["Zangetsu", "Senbonzakura", "Hyorinmaru", "Zabimaru"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/du8gCr0.jpeg"
    },
    {
      category: "Animes recientes",
      question: "¿Qué habilidad especial tiene Anya Forger en Spy X Family?",
      options: ["Telequinesis", "Leer mentes", "Viajar en el tiempo", "Invisibilidad"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/UMLbgGN.png"
    },
    {
      category: "Tramas y arcos",
      question: "¿Qué organización antagonista busca los Bijuu en Naruto?",
      options: ["Akatsuki", "ANBU", "Otsutsuki Clan", "Raíz (Root)"],
      answer: 0,
      isCharacterClue: true,
      image: "https://i.imgur.com/1zQLzVu.jpeg"
    },
    {
      category: "Personajes",
      question: "¿Cómo se llama el protagonista de Soul Eater que utiliza a Soul Evans como arma?",
      options: ["Tsubaki Nakatsukasa", "Black☆Star", "Maka Albarn", "Patty Thompson"],
      answer: 2,
      isCharacterClue: false,
      image: "https://i.imgur.com/80HI17N.png"
    },
    {
      category: "Personajes",
      question: "¿Cómo se llama la espada de Roronoa Zoro hecha con acero negro maldito?",
      options: ["Wado Ichimonji", "Sandai Kitetsu", "Shusui", "Enma"],
      answer: 3,
      isCharacterClue: false,
      image: "https://i.imgur.com/V9C3JtC.png"
    },
    {
      category: "Animes clásicos",
      question: "¿Qué tipo de criatura es Totoro en la película de Studio Ghibli?",
      options: ["Un espíritu del bosque", "Un fantasma", "Un dragón dócil", "Un robot con aspecto animal"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/0LbWf7W.png"
    },
  ],

  dificil: [
    {
      category: "Personajes",
      question: "¿Qué fruta del demonio comió Trafalgar Law?",
      options: ["Mera Mera no Mi", "Ope Ope no Mi", "Hito Hito no Mi", "Gura Gura no Mi"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/aRaPWvN.png"
    },
    {
      category: "Personajes",
      question: "¿Quién es el Pokémon número 25 de la Pokédex Nacional?",
      options: ["Raichu", "Pikachu", "Eevee", "Jigglypuff"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/ZjaeNcM.png"
    },
    {
      category: "Personajes",
      question: "¿Cómo se llama el bebé tutor de Tsunayoshi Sawada en Katekyo Hitman Reborn?",
      options: ["Lambo", "Reborn", "Hibari", "Mukuro"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/6yIaYAP.png"
    },
    {
      category: "Manga y conocimiento general",
      question: "¿En qué década se publicó por primera vez el manga de Dragon Ball?",
      options: ["Años 70", "Años 80", "Años 90", "Años 2000"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/xqb0LhA.png"
    },
    {
      category: "Tramas y arcos",
      question: "¿En qué arco de Naruto se produce el enfrentamiento entre Naruto y Pain?",
      options: ["Arco de Akatsuki", "Asalto de Pain", "La conquista de Pain", "Arco de la Gran Guerra Ninja"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/ljGZPjs.jpeg"
    },
    {
      category: "Personajes",
      question: "¿Qué número de Espada era Grimmjow Jaegerjaquez en Bleach?",
      options: ["Sexta", "Cuarta", "Primera", "Octava"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/91NB7LY.png"
    },
    {
      category: "Manga y conocimiento general",
      question: "¿Cómo se llama la editorial que publica la revista Weekly Shonen Jump?",
      options: ["Kodansha", "Shueisha", "Kadokawa", "Square Enix"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/AwDs8Zh.jpeg"
    },
    {
      category: "Animes clásicos",
      question: "¿Qué estudio de animación produjo Sailor Moon?",
      options: ["Studio Ghibli", "Toei Animation", "Madhouse", "Sunrise"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/3l3LL2Z.png"
    },
    {
      category: "Manga y conocimiento general",
      question: "¿En qué año se serializó por primera vez el manga de Berserk de Kentaro Miura?",
      options: ["1985", "1989", "1992", "1996"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/XjxJOOI.png"
    },
    {
      category: "Openings / Música",
      question: "¿Qué banda interpreta el primer opening de Fullmetal Alchemist, 'Melissa'?",
      options: ["L'Arc-en-Ciel", "Porno Graffitti", "Asian Kung-Fu Generation", "Flow"],
      answer: 1,
      isCharacterClue: false,
      image: "https://i.imgur.com/U0wRElC.jpeg"
    },
    {
      category: "Personajes",
      question: "¿Cuál es el verdadero nombre del personaje conocido como 'L' en Death Note?",
      options: ["L. Lawliet", "Hideki L. Ryuga", "Lind L. Taylor", "L. Mihael Keehl"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/Qyg1qBY.jpeg"
    },
    {
      category: "Animes clásicos",
      question: "¿En qué estudio se animó originalmente Cowboy Bebop?",
      options: ["Sunrise", "Bones", "Production I.G", "Gainax"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/ahOaiLr.jpeg"
    },
    {
      category: "Personajes",
      question: "¿Cuál es el nombre del protagonista de Yu Yu Hakusho?",
      options: ["Yusuke Urameshi", "Kazuma Kuwabara", "Hiei", "Kurama"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/aCCp4XV.png"
    },
    {
      category: "Manga y conocimiento general",
      question: "¿Cuál fue el primer manga serializado de Eiichiro Oda antes de One Piece?",
      options: ["Wanted!", "Sabikui Bisco", "Monsters", "Ikkitousen"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/5P8dImN.png"
    },
    {
      category: "Openings / Música",
      question: "¿Quién compuso la banda sonora original de Cowboy Bebop, incluyendo 'Tank!'?",
      options: ["Yoko Kanno", "Joe Hisaishi", "Yuki Kajiura", "Hiroyuki Sawano"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/ahOaiLr.jpeg"
    },
    {
      category: "Manga y conocimiento general",
      question: "¿Qué significa la palabra 'seinen' aplicada a un manga?",
      options: ["Dirigido a hombres jóvenes adultos", "Dirigido a niños", "Dirigido a mujeres adultas", "Dirijido a chicas jóvenes"],
      answer: 0,
      isCharacterClue: false,
      image: "https://i.imgur.com/tzdtdSC.png"
    },
  ]
};

// Puntos y penalización por dificultad
const DIFFICULTY_CONFIG = {
  facil:   { points: 100, label: "Fácil" },
  media:   { points: 200, label: "Media" },
  dificil: { points: 300, label: "Difícil" }
};
// Si fallas, pierdes la mitad de los puntos que ibas a ganar
const WRONG_PENALTY_RATIO = 0.5;

// ---------------------------------------------------------------
// 2) OPENINGS - adivina el anime por su opening (audio)
// ---------------------------------------------------------------
// audio: ruta a tu archivo mp3/ogg (colócalo en public/audio/)
// options: 4 animes, uno de ellos es el correcto
const openings = [
  {
    anime: "Naruto",
    audio: "/audio/naruto_op.mp3",
    options: ["Naruto", "Bleach", "One Piece", "Fairy Tail"],
    answer: 0,
    image: "https://i.imgur.com/01vDFzD.png"
  },
  {
    anime: "Dragon Ball",
    audio: "/audio/db_op.mp3",
    options: ["Bleach", "Dragon Ball", "Parasyte", "Black Clover"],
    answer: 1,
    image: "https://i.imgur.com/l9oCvb8.png"
  },
  {
    anime: "Bleach",
    audio: "/audio/bleach_op.mp3",
    options: ["Black Clover", "Vinland Saga", "Death Note", "Bleach"],
    answer: 4,
    image: "https://i.imgur.com/Akd1XF8.jpeg"
  },
  {
    anime: "Attack on Titan",
    audio: "/audio/aot_op.mp3",
    options: ["Tokyo Ghoul", "Attack on Titan", "Parasyte", "Vinland Saga"],
    answer: 1,
    image: "https://i.imgur.com/i86Yprh.jpeg"
  },
  {
    anime: "Fullmetal Alchemist",
    audio: "/audio/fmab_op.mp3",
    options: ["Soul Eater", "D.Gray-man", "Fullmetal Alchemist", "Black Clover"],
    answer: 2,
    image: "https://i.imgur.com/U0wRElC.jpeg"
  },
  {
    anime: "Death Note",
    audio: "/audio/deathnote_op.mp3",
    options: ["Death Note", "Code Geass", "Monster", "Psycho-Pass"],
    answer: 0,
    image: "https://i.imgur.com/VVXzbJv.jpeg"
  },
  {
    anime: "Demon Slayer: Kimetsu no Yaiba",
    audio: "/audio/kny_op.mp3",
    options: ["Jujutsu Kaisen", "Demon Slayer: Kimetsu no Yaiba", "Dororo", "Inuyasha"],
    answer: 1,
    image: "https://i.imgur.com/1v505a7.jpeg"
  },
  {
    anime: "One Piece",
    audio: "/audio/onepiece_op.mp3",
    options: ["One Piece", "Fairy Tail", "Black Clover", "Hunter x Hunter"],
    answer: 0,
    image: "https://i.imgur.com/ddlhjKa.jpeg"
  },
  {
    anime: "Cowboy Bebop",
    audio: "/audio/bebop_op.mp3",
    options: ["Trigun", "Cowboy Bebop", "Samurai Champloo", "Black Lagoon"],
    answer: 1,
    image: "https://i.imgur.com/ahOaiLr.jpeg"
  },
  {
    anime: "Jujutsu Kaisen",
    audio: "/audio/jjk_op.mp3",
    options: ["Chainsaw Man", "Mob Psycho 100", "Jujutsu Kaisen", "Tokyo Revengers"],
    answer: 2,
    image: "https://i.imgur.com/Dc3XNaX.png"
  }
];

// ---------------------------------------------------------------
// 2b) ORIGINAL SOUNDTRACKS (OST) - adivina el anime por su banda sonora
// ---------------------------------------------------------------
// Funciona exactamente igual que "openings": coloca tus clips de
// banda sonora (mp3/ogg) en public/audio/osts/ y referencia aquí su
// ruta. options: 4 animes, uno de ellos es el correcto.
const osts = [
  {
    anime: "Naruto",
    audio: "/audio/osts/naruto_ost.mp3",
    options: ["Naruto", "Bleach", "One Piece", "Fairy Tail"],
    answer: 0,
    image: "https://i.imgur.com/01vDFzD.png"
  },
  {
    anime: "Attack on Titan",
    audio: "/audio/osts/aot_ost.mp3",
    options: ["Tokyo Ghoul", "Attack on Titan", "Parasyte", "Vinland Saga"],
    answer: 1,
    image: "https://i.imgur.com/i86Yprh.jpeg"
  },
  {
    anime: "Fullmetal Alchemist",
    audio: "/audio/osts/fmab_ost.mp3",
    options: ["Soul Eater", "D.Gray-man", "Fullmetal Alchemist", "Black Clover"],
    answer: 2,
    image: "https://i.imgur.com/U0wRElC.jpeg"
  },
  {
    anime: "Death Note",
    audio: "/audio/osts/deathnote_ost.mp3",
    options: ["Death Note", "Code Geass", "Monster", "Psycho-Pass"],
    answer: 0,
    image: "https://i.imgur.com/VVXzbJv.jpeg"
  },
  {
    anime: "Demon Slayer: Kimetsu no Yaiba",
    audio: "/audio/osts/kny_ost.mp3",
    options: ["Jujutsu Kaisen", "Demon Slayer: Kimetsu no Yaiba", "Dororo", "Inuyasha"],
    answer: 1,
    image: "https://i.imgur.com/1v505a7.jpeg"
  },
  {
    anime: "One Piece",
    audio: "/audio/osts/onepiece_ost.mp3",
    options: ["One Piece", "Fairy Tail", "Black Clover", "Hunter x Hunter"],
    answer: 0,
    image: "https://i.imgur.com/ddlhjKa.jpeg"
  },
  {
    anime: "Cowboy Bebop",
    audio: "/audio/osts/bebop_ost.mp3",
    options: ["Trigun", "Cowboy Bebop", "Samurai Champloo", "Black Lagoon"],
    answer: 1,
    image: "https://i.imgur.com/ahOaiLr.jpeg"
  },
  {
    anime: "Jujutsu Kaisen",
    audio: "/audio/osts/jjk_ost.mp3",
    options: ["Chainsaw Man", "Mob Psycho 100", "Jujutsu Kaisen", "Tokyo Revengers"],
    answer: 2,
    image: "https://i.imgur.com/Dc3XNaX.png"
  }
];

// ---------------------------------------------------------------
// 3) PHOTO ROUNDS - adivina el anime con autocompletado y pistas
// ---------------------------------------------------------------
// images: array de 5 URLs, de la MÁS DIFÍCIL (índice 0) a la MÁS
// FÁCIL. La imagen [4] (la 5ª) debe ser el LOGO/portada del anime,
// que ya prácticamente da la respuesta directamente.
//
// NOTA: por defecto se repite la misma imagen en las 5 posiciones
// como placeholder. Sustitúyelas por capturas/recortes propios,
// ordenados de más críptico (zoom muy cerrado, sin contexto) a
// menos críptico, terminando siempre en el logo del anime.
const photoRounds = [
  {
    anime: "One Piece",
    images: [
      "https://i.imgur.com/Yh1aOsQ.png",
      "https://i.imgur.com/Vf8bTk1.png",
      "https://i.imgur.com/PqmKudV.png",
      "https://i.imgur.com/BOPS3T1.jpeg",
      "https://i.imgur.com/6NvA2pk.png"
    ]
  },
  {
    anime: "Naruto",
    images: [
      "https://i.imgur.com/lZ731Ml.png",
      "https://i.imgur.com/plWAY8v.png",
      "https://i.imgur.com/ToTUG8N.png",
      "https://i.imgur.com/LTJHwn6.png",
      "https://i.imgur.com/LZZCJW3.png"
    ]
  },
  {
    anime: "Attack on Titan",
    images: [
      "https://i.imgur.com/HgryXVl.png",
      "https://i.imgur.com/2I7JWos.png",
      "https://i.imgur.com/cwTYTBh.png",
      "https://i.imgur.com/OGWNbWx.png",
      "https://i.imgur.com/vpPRcf6.png"
    ]
  },
  {
    anime: "Death Note",
    images: [
      "https://i.imgur.com/nw7tcU6.png",
      "https://i.imgur.com/YugAtBR.png",
      "https://i.imgur.com/LIBEnI4.png",
      "https://i.imgur.com/ZMbEgqE.png",
      "https://i.imgur.com/tvlxb8V.png"
    ]
  },
  {
    anime: "Jujutsu Kaisen",
    images: [
      "https://i.imgur.com/HHvAIV0.png",
      "https://i.imgur.com/TEAWKfF.png",
      "https://i.imgur.com/j7MuiUe.png",
      "https://i.imgur.com/FtHkwmX.png",
      "https://i.imgur.com/2NCMUYf.png"
    ]
  },
  {
    anime: "Fullmetal Alchemist",
    images: [
      "https://i.imgur.com/w95Nx71.jpeg",
      "https://i.imgur.com/6J2i9yw.png",
      "https://i.imgur.com/FpDvt3l.jpeg",
      "https://i.imgur.com/FI02PpN.jpeg",
      "https://i.imgur.com/IgHFe2E.jpeg"
    ]
  },
  {
    anime: "Demon Slayer: Kimetsu no Yaiba",
    images: [
      "https://i.imgur.com/g2ORMom.jpeg",
      "https://i.imgur.com/5tCHkzG.jpeg",
      "https://i.imgur.com/Zcr66ht.jpeg",
      "https://i.imgur.com/nRgjWeK.png",
      "https://i.imgur.com/KA9gfQf.jpeg"
    ]
  },
  {
    anime: "Bleach",
    images: [
      "https://i.imgur.com/Dph2bZd.jpeg",
      "https://i.imgur.com/ZjlL8z0.jpeg",
      "https://i.imgur.com/UFxA7UY.jpeg",
      "https://i.imgur.com/v1CphLn.jpeg",
      "https://i.imgur.com/EtJB6mv.jpeg"
    ]
  }
];

// ---------------------------------------------------------------
// 4) ANIME LIST - para el autocompletado del cuadro de texto
// ---------------------------------------------------------------
// Lista amplia para que el desplegable tenga sentido al escribir
// letras (ej. escribir "B" debe sugerir Bleach, Boku no Hero
// Academia, Boku Dake ga Inai Machi, etc.)
const animeList = [
"A Certain Magical Index", 
"A Certain Scientific Railgun", 
"A Couple of Cuckoos",
"A Place Further Than the Universe", 
"A Silent Voice", "86",
"Accel World", 
"Ace of Diamond", 
"Afro Samurai", 
"Air",
"Ajin", 
"Akame ga Kill!", 
"Akiba Maid War", 
"Akudama Drive",
"Akuma-kun", 
"Alderamin on the Sky",
"Alya Sometimes Hides Her Feelings in Russian",
"Amagi Brilliant Park", 
"Angel Beats!", 
"Another",
"Ao Ashi", 
"Appare-Ranman!", 
"Arifureta",
"Arslan Senki", 
"Assassination Classroom",
"Astro Boy", 
"Attack on Titan",
"Back Arrow", 
"Baki", 
"Bakemonogatari",
"Bakuman", 
"Banana Fish", 
"Bartender",
"Basilisk", 
"Beastars", 
"Beck",
"Beelzebub", 
"Berserk", 
"Beyblade",
"Birdie Wing", 
"Black Bullet", 
"Black Cat",
"Black Clover", 
"Black Lagoon", 
"Bleach",
"Blood+", 
"Blood Blockade Battlefront",
"Blue Box", 
"Blue Exorcist", 
"Blue Lock",
"Blue Period", 
"Bluelock Episode Nagi",
"Bocchi the Rock!", 
"Boku Dake ga Inai Machi",
"Boku no Hero Academia", 
"Boruto",
"Btooom!", 
"Buddy Daddies",
"Bungou Stray Dogs", 
"Busou Renkin", 
"C: The Money of Soul and Possibility Control",
"Canaan",
"Campfire Cooking in Another World",
"Cardcaptor Sakura",
"Carole & Tuesday",
"Casshern Sins",
"Cat's Eye",
"Cautious Hero",
"Cells at Work!",
"Charlotte",
"Chihayafuru",
"Children of the Whales",
"Chobits",
"Chrome Shelled Regios",
"City Hunter",
"Clannad",
"Classroom of the Elite",
"Claymore",
"Code Geass",
"Cop Craft",
"Cowboy Bebop",
"Crayon Shin-chan",
"Cross Game",
"Cyberpunk: Edgerunners",
"D.Gray-man",
"Dandadan",
"Darker than Black",
"Darling in the FranXX",
"Date A Live",
"Dead Mount Death Play",
"Deadman Wonderland",
"Deca-Dence",
"Death Note",
"Deaimon",
"Demon Slayer: Kimetsu no Yaiba",
"Detective Conan",
"Devilman Crybaby",
"Diamond no Ace",
"Domestic Girlfriend",
"Dororo",
"Dorohedoro",
"Dr. Stone",
"Dragon Ball",
"Dragon Ball Z",
"Drifters",
"Durarara!!",
"Dungeon Meshi", 
"Eden's Zero",
"Elfen Lied",
"Eminence in Shadow",
"Erased",
"Evangelion",
"Eureka Seven",
"Ergo Proxy", 
"Endride", 
"Eden of the East", 
"Escaflowne",
"Engage Kiss", 
"Excel Saga", 
"Erementar Gerad", 
"Eyeshield 21",
"Eyeshield 21", 
"Ef: A Tale of Memories", 
"Eikoku Koi Monogatari Emma",
"Fairy Tail",
"Fate/Apocrypha",
"Fate/Grand Order",
"Fate/Stay Night",
"Fate/Stay Night Unlimited Blade Works",
"Fate/Zero",
"Fire Force",
"FLCL",
"Flying Witch",
"Food Wars!",
"Fruits Basket",
"Fullmetal Alchemist",
"Fumetsu no Anata e",
"Fuufu Ijou, Koibito Miman", 
"Gabriel DropOut",
"Gachiakuta",
"Game of Laplace",
"Gankutsuou",
"Gangsta",
"Gate",
"Genocyber",
"Ghost in the Shell",
"Ghost Hunt",
"Gintama",
"Gleipnir",
"Golden Boy",
"Golden Kamuy",
"Gosick",
"Grand Blue",
"Great Pretender",
"Grimgar of Fantasy and Ash",
"Guilty Crown",
"Gungrave",
"Hajime no Ippo",
"Haganai",
"Haikyuu!!",
"Handyman Saitou in Another World",
"Happy Sugar Life",
"Hellsing",
"Hell Girl",
"Hell's Paradise",
"Highschool DxD",
"Highschool of the Dead",
"Higurashi",
"Hinamatsuri",
"Hori-san to Miyamura-kun (Horimiya)",
"Hyouka", 
"ID: Invaded",
"Iroduku",
"Inuyasha",
"Initial D",
"Isekai Ojisan",
"Isekai Quartet",
"Isekai Suicide Squad",
"Jigoku Shoujo (Hell Girl)",
"JoJo's Bizarre Adventure",
"Jormungand",
"Jujutsu Kaisen",
"Jungle wa Itsumo Hare nochi Guu", 
"Jinki:Extend", 
"Jinki:Extend: Pandora",
"Joshiraku", 
"Jubei-chan: The Ninja Girl", 
"Junjo Romantica",
"Juuou Mujin no Fafnir", 
"Jin-Roh: The Wolf Brigade",
"Juuni Taisen", 
"Jibaku Shounen Hanako-kun", 
"Jormungand: Perfect Order",
"Kaiju No. 8",
"Kakegurui",
"Kami no Tou (Tower of God)",
"Kamisama Kiss",
"Kanojo Okarishimasu (Rent-a-Girlfriend)",
"Katanagatari",
"Katekyo Hitman Reborn!",
"Kemono Jihen",
"Kenichi: The Mightiest Disciple",
"Kengan Ashura",
"Kingdom",
"Kino's Journey",
"Kiss x Sis",
"Kiznaiver",
"Kobayashi-san Chi no Maid Dragon (Miss Kobayashi's Dragon Maid)",
"Komi Can't Communicate",
"Konosuba",
"Kuroko no Basket (Kuroko's Basketball)",
"Kusuriya no Hitorigoto (The Apothecary Diaries)", 
"Land of the Lustrous",
"Legend of the Galactic Heroes",
"Little Witch Academia",
"Log Horizon",
"Love Hina",
"Love Live!",
"Lycoris Recoil",
"Lucky Star", 
"Lupin III", 
"Lain (Serial Experiments Lain)",
"Love Stage!!", 
"Last Exile", 
"Lazarus",
"Law of Ueki", 
"Level E", 
"Lodoss-tou Senki (Record of Lodoss War)",
"Lost Song", 
"Long Riders!", 
"Legendz", 
"Linebarrels of Iron",
"Magi",
"Made in Abyss",
"Major",
"Mashle",
"Medaka Box",
"Megalo Box",
"Mirai Nikki",
"Mob Psycho 100",
"Mononoke",
"Monster",
"Moriarty the Patriot",
"Mob Psycho 100 II",
"Mushishi",
"Mushoku Tensei",
"My Dress-Up Darling",
"My Hero Academia",
"Nana",
"Naruto",
"Natsume Yuujinchou (Natsume's Book of Friends)",
"Neon Genesis Evangelion",
"Nichijou",
"Nier: Automata Ver1.1a",
"No Game No Life",
"Noblesse",
"Noragami",
"Now and Then, Here and There", "Odd Taxi",
"Ojamajo Doremi",
"Oshi no Ko",
"One Outs",
"One Piece",
"One Punch Man",
"Orange",
"Orient",
"Overlord",
"Owari no Seraph (Seraph of the End)",
"Ousama Ranking (Ranking of Kings)",
"Outlaw Star",
"Paranoia Agent",
"Parasyte: The Maxim",
"Peach Boy Riverside",
"Ping Pong the Animation",
"Plastic Memories",
"Platinum End",
"Pluto",
"Prison School",
"Promare",
"Promised Neverland",
"Psycho-Pass",
"Ragna Crimson",
"Rainbow",
"Rascal Does Not Dream of Bunny Girl Senpai",
"Record of Ragnarok",
"Re:Zero",
"Recovery of an MMO Junkie",
"Rent-a-Girlfriend",
"ReLIFE",
"Rokka no Yuusha",
"Rosario + Vampire",
"Rurouni Kenshin",
"Run with the Wind", 
"Saga of Tanya the Evil",
"Saiki Kusuo no Psi-nan",
"Sailor Moon",
"Saint Seiya",
"Sakamoto Days",
"Sakamoto desu ga?",
"Samurai Champloo",
"Sankarea",
"School Days",
"School Rumble",
"Scrapped Princess",
"Seraph of the End",
"Shaman King",
"Shangri-La Frontier",
"Shiki",
"Shinsekai Yori",
"Shirobako",
"Shokugeki no Souma (Food Wars!)",
"Shomin Sample",
"Shuumatsu no Valkyrie (Record of Ragnarok)",
"Skip and Loafer",
"Sket Dance",
"Solo Leveling",
"Sonny Boy",
"Soul Eater",
"Space Dandy",
"Spice and Wolf",
"Spy x Family",
"Steins;Gate",
"Summer Time Rendering",
"Super Lovers",
"Suisei no Gargantia",
"Suzumiya Haruhi no Yuuutsu (The Melancholy of Haruhi Suzumiya)",
"Sword Art Online", 
"Takt Op. Destiny",
"Tales of Zestiria the X",
"Talentless Nana",
"Tengoku Daimakyou (Heavenly Delusion)",
"Terror in Resonance",
"The Ancient Magus' Bride",
"The Apothecary Diaries",
"The Dangers in My Heart",
"The Devil is a Part-Timer!",
"The Faraway Paladin",
"The God of High School",
"The Irregular at Magic High School",
"The Seven Deadly Sins",
"The Rising of the Shield Hero",
"The Tatami Galaxy",
"The World's Finest Assassin Gets Reincarnated in Another World",
"To Your Eternity",
"Toaru Kagaku no Accelerator",
"Toaru Kagaku no Railgun",
"Toaru Majutsu no Index",
"Tokyo Ghoul",
"Tokyo Revengers",
"Toradora!",
"Tower of God",
"Trigun",
"Trigun Stampede",
"Tsuki ga Kirei",
"Tsubasa Chronicle",
"Twin Star Exorcists",
"Tokyo Magnitude 8.0", 
"Undead Unluck",
"UQ Holder!",
"Urusei Yatsura",
"Uzaki-chan Wants to Hang Out!",
"Valvrave the Liberator",
"Violet Evergarden",
"Vinland Saga",
"Vivy: Fluorite Eye's Song",
"Wagnaria!! (Working!!)",
"Welcome to the NHK",
"Wind Breaker",
"Witch Watch",
"World Trigger",
"Wotakoi",
"Ya Boy Kongming!",
"Yakusoku no Neverland (The Promised Neverland)",
"Yamada-kun to 7-nin no Majo (Yamada-kun and the Seven Witches)",
"Yowamushi Pedal",
"Your Lie in April",
"Yu Yu Hakusho",
"Yuri on Ice",
"Zatch Bell!",
"Zegapain",
"Zetsuen no Tempest",
"Zombie Land Saga",
"Zom 100: Bucket List of the Dead"
];

// ---------------------------------------------------------------
// 5) DRAW CHARACTERS - para el modo "Draw"
// ---------------------------------------------------------------
const drawCharacters = [
  { name: "Monkey D. Luffy (One Piece)", answers: ["luffy", "monkey d. luffy", "monkey d luffy"], image: "/images/characters/monkey_d_luffy.jpg" },
  { name: "Usopp (One Piece)", answers: ["usop", "usopp"], image: "/images/characters/usopp.jpg" },
  { name: "Vinsmoke Sanji (One Piece)", answers: ["sanji", "vinsmoke sanji"], image: "/images/characters/vinsmoke_sanji.jpg" },
  { name: "Nico Robin (One Piece)", answers: ["robin", "nico", "nico robin"], image: "/images/characters/nico_robin.jpg" },
  { name: "Franky (One Piece)", answers: ["franki", "franky", "frankie"], image: "/images/characters/franky.jpg" },
  { name: "Brook (One Piece)", answers: ["brook", "bruk", "bruc", "bruck"], image: "/images/characters/brook.jpg" },
  { name: "Trafalgar Law (One Piece)", answers: ["law", "trafalgar", "trafalgar law", "lau"], image: "/images/characters/trafalgar_law.jpg" },
  { name: "Roronoa Zoro (One Piece)", answers: ["zoro", "roronoa zoro", "zorro"], image: "/images/characters/roronoa_zoro.jpg" },
  { name: "Nami (One Piece)", answers: ["nami"], image: "/images/characters/nami.jpg" },
  { name: "Chopper (One Piece)", answers: ["chopper", "tony tony chopper"], image: "/images/characters/chopper.jpg" },
  { name: "Shanks (One Piece)", answers: ["shanks"], image: "/images/characters/shanks.jpg" },
  { name: "Caesar Clown (One Piece)", answers: ["caesar", "caesar clown"], image: "/images/characters/caesar.jpg" },
  { name: "Donquixote Doflamingo (One Piece)", answers: ["doflamingo", "donquixote", "donquixote doflamingo"], image: "/images/characters/doflamingo.jpg" },
  { name: "Smoker (One Piece)", answers: ["smoker"], image: "/images/characters/smoker.jpg" },
  { name: "Crocodile (One Piece)", answers: ["crocodile"], image: "/images/characters/crocodile.jpg" },
  { name: "Kaido (One Piece)", answers: ["kaido", "kaidou"], image: "/images/characters/kaido.jpg" },
  { name: "Dracule Mihawk (One Piece)", answers: ["dracule", "dracule mihawk", "mihawk"], image: "/images/characters/mihawk.jpg" },
  { name: "Cementoss (BNHA)", answers: ["cementoss", "cementos"], image: "/images/characters/cementoss.jpg" },
  { name: "Gran Torino (BNHA)", answers: ["torino", "gran torino"], image: "/images/characters/gran_torino.jpg" },
  { name: "Fumikage Tokoyami (BNHA)", answers: ["fumikage", "tokoyami", "fumikage tokoyami"], image: "/images/characters/fumikage_tokoyami.jpg" },
  { name: "Dabi Todoroki (BNHA)", answers: ["dabi", "dabi todoroki", "todoroki"], image: "/images/characters/dabi_todoroki.jpg" }, 
  { name: "Mihoru Mineta (BNHA)", answers: ["mihoru mineta", "mineta", "mihoru"], image: "/images/characters/mihoru_mineta.jpg" }, 
  { name: "Mina Ashido (BNHA)", answers: ["mina", "ashido", "mina ashido"], image: "/images/characters/mina_ashido.jpg" }, 
  { name: "Deku (BNHA)", answers: ["deku", "izuku", "izuku midoriya", "midoriya"], image: "/images/characters/deku.jpg" },
  { name: "All Might (BNHA)", answers: ["all might"], image: "/images/characters/all_might.jpg" },
  { name: "Endeavor (BNHA)", answers: ["endeavor", "enji", "enji todoroki"], image: "/images/characters/endeavor.jpg" },
  { name: "All For One (BNHA)", answers: ["AFO", "all for one", "allforone"], image: "/images/characters/all_for_one.jpg" }, 
  { name: "Shoto Todoroki (BNHA)", answers: ["todoroki", "shoto todoroki", "shoto"], image: "/images/characters/shoto_todoroki.jpg" },
  { name: "Himiko Toga (BNHA)", answers: ["himiko", "toga", "himiko toga"], image: "/images/characters/himiko_toga.jpg" }, 
  { name: "Kurogiri (BNHA)", answers: ["kurogiri", "kuroguiri"], image: "/images/characters/kurogiri.jpg" },  
  { name: "Tomura Shigaraki (BNHA)", answers: ["tomura", "shigaraki", "tomura shigaraki"], image: "/images/characters/tomura_shigaraki.jpg" }, 
  { name: "Stain (BNHA)", answers: ["stain"], image: "/images/characters/stain.jpg" }, 
  { name: "Overhaul (BNHA)", answers: ["overhaul"], image: "/images/characters/overhaul.jpg" }, 
  { name: "Twice (BNHA)", answers: ["twice"], image: "/images/characters/twice.jpg" }, 
  { name: "Present Mic (BNHA)", answers: ["present mic", "hizashi yamada", "yamada"], image: "/images/characters/present_mic.jpg" },
  { name: "Tsuyu Asui (BNHA)", answers: ["tsuyu asui", "froppy", "fropi", "tsuyu"], image: "/images/characters/tsuyu.jpg" },
  { name: "Mirio Togata (BNHA)", answers: ["mirio", "togata", "mirio togata", "lemilion", "le million", "lemillion", "million"], image: "/images/characters/mirio.jpg" },
  { name: "Denki Kaminari (BNHA)", answers: ["denki kaminari", "denki", "kaminari", "chargebolt"], image: "/images/characters/kaminari.jpg" },
  { name: "Ochako Uraraka (BNHA)", answers: ["ochako uraraka", "ochako", "uraraka", "uravity"], image: "/images/characters/ochako.jpg" },
  { name: "Toru Hagakure (BNHA)", answers: ["toru", "hagakure", "toru hagakure", "invisible girl", "invisigirl"], image: "/images/characters/invisible_girl.jpg" },
  { name: "Tenya Iida (BNHA)", answers: ["tenya iida", "iida", "tenya", "ingenium"], image: "/images/characters/tenya.jpg" },
  { name: "Kota (BNHA)", answers: ["kota"], image: "/images/characters/kota.jpg" },
  { name: "Katsuki Bakugo (BNHA)", answers: ["katsuki bakugo", "bakugo", "Dynamite", "Dios de las explosiones Dynamite"], image: "/images/characters/bakugo.jpg" },
  { name: "Mirko (BNHA)", answers: ["mirko", "rumi usagiyama", "rumi", "usagiyama"], image: "/images/characters/mirko.jpg" },
  { name: "Keigo Takami / Hawks (BNHA)", answers: ["keigo takami", "keigo", "takami", "hawks"], image: "/images/characters/hawks.jpg" },
  { name: "Itsuka Kendo (BNHA)", answers: ["itsuka kendo", "kendo", "itsuka", "puño de batalla"], image: "/images/characters/itsuka.jpg" },
  { name: "Cathleen Bate / S&S (BNHA)", answers: ["cathleen bate", "cathleen", "bate", "star", "star and stripe"], image: "/images/characters/star.jpg" },
  { name: "Kaina Tsutsumi / Nagant (BNHA)", answers: ["kaina", "kaina tsutsumi", "tsutsumi", "lady nagant", "nagant"], image: "/images/characters/nagant.jpg" },
  { name: "Mei Hatsume (BNHA)", answers: ["mei", "hatsume", "mei hatsume"], image: "/images/characters/mei_hatsume.jpg" },
  { name: "Eijiro Kirishima (BNHA)", answers: ["eijiro kirishima", "kirishima", "red riot"], image: "/images/characters/kirishima.jpg" },
  { name: "Gaara (Naruto)", answers: ["gara", "gaara"], image: "/images/characters/gaara.jpg" },
  { name: "Orochimaru (Naruto)", answers: ["orochimaru"], image: "/images/characters/orochimaru.jpg" },
  { name: "Jiraiya (Naruto)", answers: ["jiraya", "jiraiya"], image: "/images/characters/jiraiya.jpg" }, 
  { name: "Gamabunta (Naruto)", answers: ["gamabunta", "gama"], image: "/images/characters/gamabunta.jpg" }, 
  { name: "Kiba Inazuka (Naruto)", answers: ["kiba", "inazuka", "kiba inazuka"], image: "/images/characters/kiba_inazuka.jpg" }, 
  { name: "Rock Lee (Naruto)", answers: ["rock lee", "rocklee", "rok lee", "rok"], image: "/images/characters/rock_lee.jpg" },  
  { name: "Hinata Hyuga (Naruto)", answers: ["hinata", "hyuga", "hinata hyuga"], image: "/images/characters/hinata_hyuga.jpg" }, 
  { name: "Sakura Haruno (Naruto)", answers: ["sakura", "sakura haruno", "haruno"], image: "/images/characters/sakura_haruno.jpg" }, 
  { name: "Naruto Uzumaki (Naruto)", answers: ["naruto", "naruto uzumaki"], image: "/images/characters/naruto.jpg" },
  { name: "Itachi Uchiha (Naruto)", answers: ["itachi", "itachi uchiha"], image: "/images/characters/itachi_uchiha.jpg" },
  { name: "Sasuke Uchiha (Naruto)", answers: ["sasuke", "sasuke uchiha"], image: "/images/characters/sasuke_uchiha.jpg" },
  { name: "Kakashi Hatake (Naruto)", answers: ["kakashi", "kakashi hatake"], image: "/images/characters/kakashi_hatake.jpg" },
  { name: "Pain (Naruto)", answers: ["pain"], image: "/images/characters/pain.jpg" },
  { name: "Kyuubi (Naruto)", answers: ["kyuubi", "kyubi"], image: "/images/characters/kyuubi.jpg" },
  { name: "Gojo Satoru (Jujutsu Kaisen)", answers: ["gojo", "gojo satoru", "satoru gojo"], image: "/images/characters/gojo_satoru.jpg" },
  { name: "Toji Fushiguro (Jujutsu Kaisen)", answers: ["toji", "fushiguro", "toji fushiguro"], image: "/images/characters/toji.jpg" },
  { name: "Yuji Itadori (Jujutsu Kaisen)", answers: ["yuji", "yuji itadori", "itadori"], image: "/images/characters/yuji_itadori.jpg" },
  { name: "Shinichi Kudo (Detective Conan)", answers: ["conan", "shinichi", "detective conan"], image: "/images/characters/conan.jpg" },
  { name: "Juzo Megure (Detective Conan)", answers: ["juzo", "megure", "juzo megure"], image: "/images/characters/juzo.jpg" },
  { name: "Hiroshi Agasa (Detective Conan)", answers: ["hiroshi", "agasa", "hiroshi agasa"], image: "/images/characters/hiroshi.jpg" },
  { name: "Doraemon (Doraemon)", answers: ["doraemon"], image: "/images/characters/doraemon.jpg" },
  { name: "Shizuka (Doraemon)", answers: ["shizuka"], image: "/images/characters/shizuka.jpg" },
  { name: "Takeshi Goda / Gigante (Doraemon)", answers: ["takeshi goda", "takeshi", "goda", "gigante", "gegant"], image: "/images/characters/.jpg" },
  { name: "Suneo Honekawa (Doraemon)", answers: ["suneo", "honekawa", "suneo honekawa"], image: "/images/characters/suneo.jpg" },
  { name: "Dorami (Doraemon)", answers: ["dorami", "hermana de doraemon"], image: "/images/characters/dorami.jpg" },
  { name: "Soul Evans (Soul Eater)", answers: ["soul", "soul evans", "evans"], image: "/images/characters/soul_evans.jpg" },
  { name: "Reborn (Katekyo Hitman Reborn!)", answers: ["reborn"], image: "/images/characters/reborn.jpg" },
  { name: "Yusuke Urameshi (YuYu Hakusho)", answers: ["yusuke urameshi", "yusuke", "urameshi"], image: "/images/characters/yusuke_urameshi.jpg" },
  { name: "Toguro (YuYu Hakusho)", answers: ["toguro"], image: "/images/characters/toguro.jpg" },
  { name: "Hiei (YuYu Hakusho)", answers: ["hiei", "jiei"], image: "/images/characters/hiei.jpg" },
  { name: "Kazuma Kuwabara (YuYu Hakusho)", answers: ["kazuma", "kuwabara", "kazuma kuwabara", "kasuma"], image: "/images/characters/kazuma_kuwabara.jpg" },
  { name: "Kosuke Ueki (Ueki no Hōsoku)", answers: ["kosuke", "ueki", "kosuke ueki"], image: "/images/characters/kosuke_ueki.jpg" },
  { name: "Robert Haydn (Ueki no Hōsoku)", answers: ["robert", "haydn", "robert haydn"], image: "/images/characters/robert_haydn.jpg" },
  { name: "Don Patch (Bobobo)", answers: ["don patch", "donpatch", "patch"], image: "/images/characters/don_patch.jpg" },
  { name: "Bobobo (Bobobo)", answers: ["bobobo"], image: "/images/characters/bobobo.jpg" },
  { name: "Tokoro Tenosuke (Bobobo)", answers: ["tokoro", "tenosuke", "tokoro tenosuke"], image: "/images/characters/tokoro_tenosuke.jpg" },
  { name: "Softon (Bobobo)", answers: ["softon"], image: "/images/characters/softon.jpg" },
  { name: "Torpedo Girl (Bobobo)", answers: ["torpedo girl", "torpeda", "turpeda"], image: "/images/characters/torpedo_girl.jpg" },
  { name: "Dengakuman (Bobobo)", answers: ["dengakuman"], image: "/images/characters/dengakuman.jpg" },
  { name: "Beauty (Bobobo)", answers: ["beauty"], image: "/images/characters/beauty.jpg" },
  { name: "Keroro (Keroro)", answers: ["keroro"], image: "/images/characters/keroro.jpg" },
  { name: "Tamama (Keroro)", answers: ["tamama"], image: "/images/characters/tamama.jpg" },
  { name: "Guiroro (Keroro)", answers: ["guiroro", "giroro"], image: "/images/characters/guiroro.jpg" },
  { name: "Kururu (Keroro)", answers: ["kururu"], image: "/images/characters/kururu.jpg" },
  { name: "Dororo (Keroro)", answers: ["dororo"], image: "/images/characters/dororo.jpg" },
  { name: "Monstruo Buu (Dragon Ball)", answers: ["buu", "boo", "monstruo buu", "monstruo boo"], image: "/images/characters/monstruo_buu.jpg" },
  { name: "Freezer (Dragon Ball)", answers: ["freezer", "frizer", "freeze", "freeser", "friser"], image: "/images/characters/freezer.jpg" },
  { name: "Bulma (Dragon Ball)", answers: ["bulma"], image: "/images/characters/bulma.jpg" }, 
  { name: "Babidi (Dragon Ball)", answers: ["babidi"], image: "/images/characters/babidi.jpg" }, 
  { name: "Chaoz (Dragon Ball)", answers: ["chaoz", "caos", "chaos"], image: "/images/characters/chaoz.jpg" }, 
  { name: "Piccolo (Dragon Ball)", answers: ["picolo", "piccolo"], image: "/images/characters/piccolo.jpg" }, 
  { name: "Ten Shin Han (Dragon Ball)", answers: ["tenshin han", "tenshinhan", "ten shin han", "ten shin"], image: "/images/characters/ten_shin_han.jpg" }, 
  { name: "Tao Pai Pai (Dragon Ball)", answers: ["tao", "pai pai", "tao pai pai"], image: "/images/characters/tao_pai_pai.jpg" },  
  { name: "Bardock (Dragon Ball)", answers: ["bardoc", "bardok", "bardock"], image: "/images/characters/bardock.jpg" }, 
  { name: "Ozaru (Dragon Ball)", answers: ["ozaru"], image: "/images/characters/ozaru.jpg" }, 
  { name: "Goku (Dragon Ball)", answers: ["goku", "son goku", "songoku", "kakarot"], image: "/images/characters/goku.jpg" },
  { name: "Vegeta (Dragon Ball)", answers: ["vegeta", "vegetta"], image: "/images/characters/vegeta.jpg" },
  { name: "Celula (Dragon Ball)", answers: ["cell", "cel", "celula"], image: "/images/characters/celula.jpg" },
  { name: "Mr. Popo (Dragon Ball)", answers: ["popo", "mr popo"], image: "/images/characters/popo.jpg" },
  { name: "Nappa (Dragon Ball)", answers: ["nappa", "napa"], image: "/images/characters/nappa.jpg" },
  { name: "Androide 18 (Dragon Ball)", answers: ["Androide 18", "18"], image: "/images/characters/android18.jpg" },
  { name: "Raditz (Dragon Ball)", answers: ["raditz", "radits"], image: "/images/characters/raditz.jpg" },
  { name: "Trunks (Dragon Ball)", answers: ["trunks"], image: "/images/characters/trunks.jpg" },
  { name: "Muten Roshi (Dragon Ball)", answers: ["mutenroshi", "muten roshi"], image: "/images/characters/muten_roshi.jpg" },
  { name: "Kaito (Dragon Ball)", answers: ["kaito"], image: "/images/characters/kaito.jpg" },
  { name: "Dr. Guero (Dragon Ball)", answers: ["dr guero", "guero"], image: "/images/characters/dr_guero.jpg" },
  { name: "Whis (Dragon Ball)", answers: ["whis", "wis", "wish"], image: "/images/characters/whis.jpg" },
  { name: "Jiren (Dragon Ball)", answers: ["jiren"], image: "/images/characters/jiren.jpg" },
  { name: "Beerus (Dragon Ball)", answers: ["beerus", "bills"], image: "/images/characters/beerus.jpg" },
  { name: "Hit (Dragon Ball)", answers: ["hit"], image: "/images/characters/hit.jpg" },
  { name: "Mr. Satan (Dragon Ball)", answers: ["mr satan", "satan"], image: "/images/characters/mrsatan.jpg" },
  { name: "Shenlong (Dragon Ball)", answers: ["shenlong", "shen long", "shenron"], image: "/images/characters/shenlong.jpg" },
  { name: "Dabura (Dragon Ball)", answers: ["dabura", "dabra"], image: "/images/characters/dabura.jpg" },
  { name: "Yamcha (Dragon Ball)", answers: ["yamcha"], image: "/images/characters/yamcha.jpg" },
  { name: "Broly (Dragon Ball)", answers: ["broly", "broli"], image: "/images/characters/broly.jpg" },
  { name: "Zenitsu Agatsuma (Kimetsu no Yaiba)", answers: ["zenitsu", "agatsuma", "zenitsu agatsuma"], image: "/images/characters/zenitsu_agatsuma.jpg" },
  { name: "Kyojuro Rengoku (Kimetsu no Yaiba)", answers: ["kyojuro", "rengoku", "kyojuro rengoku"], image: "/images/characters/kyojuro_rengoku.jpg" },
  { name: "Inosuke Hashibira (Kimetsu no Yaiba)", answers: ["inosuke", "hashibira", "inosuke hashibira"], image: "/images/characters/inosuke_hashibira.jpg" }, 
  { name: "Tanjiro Kamado (Kimetsu no Yaiba)", answers: ["tanjiro", "tanjiro kamado"], image: "/images/characters/tanjiro_kamado.jpg" },
  { name: "Nezuko Kamado (Kimetsu no Yaiba)", answers: ["nezuko", "nezuko kamado"], image: "/images/characters/nezuko_kamado.jpg" },
  { name: "Titan Colosal (Attack on Titan)", answers: ["titan colosal", "bertolt hoover", "armin arlert", "colosal"], image: "/images/characters/titan_colosal.jpg" },
  { name: "Titan de Ataque (Attack on Titan)", answers: ["titan de ataque", "titan ataque", "ataque", "eren jaeger"], image: "/images/characters/titan_de_ataque.jpg" },
  { name: "Titan Acorazado (Attack on Titan)", answers: ["titan acorazado", "acorazado", "reiner"], image: "/images/characters/titan_acorazado.jpg" },
  { name: "Eren Yeager (Attack on Titan)", answers: ["eren", "eren yeager", "eren jaeger"], image: "/images/characters/eren_yeager.jpg" },
  { name: "Mikasa Ackerman (Attack on Titan)", answers: ["mikasa", "mikasa ackerman"], image: "/images/characters/mikasa_ackerman.jpg" },
  { name: "Levi Ackerman (Attack on Titan)", answers: ["levi", "levi ackerman"], image: "/images/characters/levi_ackerman.jpg" },
  { name: "Armin Arlert (Attack on Titan)", answers: ["armin", "arlert", "armin arlert"], image: "/images/characters/armin_arlert.jpg" },
  { name: "Rem (Death Note)", answers: ["rem"], image: "/images/characters/rem.jpg" }, 
  { name: "Ryuk (Death Note)", answers: ["ryuk", "riuk"], image: "/images/characters/ryuk.jpg" },
  { name: "Misa Amane (Death Note)", answers: ["misa", "amane", "misa amane"], image: "/images/characters/misa_amane.jpg" },
  { name: "Light Yagami (Death Note)", answers: ["light", "light yagami", "kira"], image: "/images/characters/light_yagami.jpg" },
  { name: "L (Death Note)", answers: ["l", "l lawliet", "lawliet"], image: "/images/characters/l.jpg" },
  { name: "Killua Zoldyck (Hunter X Hunter)", answers: ["killua", "killua zoldyck"], image: "/images/characters/killua_zoldyck.jpg" },
  { name: "Gon Freecss (Hunter X Hunter)", answers: ["gon", "gon freecss"], image: "/images/characters/gon_freecss.jpg" },
  { name: "Asta (Black Clover)", answers: ["asta"], image: "/images/characters/asta.jpg" },
  { name: "Denji (Chainsaw Man)", answers: ["denji"], image: "/images/characters/denji.jpg" }, 
  { name: "Pochita (Chainsaw Man)", answers: ["pochita"], image: "/images/characters/pochita.jpg" }, 
  { name: "Makima (Chainsaw Man)", answers: ["makima"], image: "/images/characters/makima.jpg" }, 
  { name: "Power (Chainsaw Man)", answers: ["power"], image: "/images/characters/power.jpg" }, 
  { name: "Snorlax (Pokémon)", answers: ["snorlax", "esnorlax"], image: "/images/characters/snorlax.jpg" },
  { name: "Gengar (Pokémon)", answers: ["gengar"], image: "/images/characters/gengar.jpg" },
  { name: "Mewtoo (Pokémon)", answers: ["mewtoo", "mewto", "mewtu", "mew", "mewtwo", "mewtwoo"], image: "/images/characters/mewtoo.jpg" },
  { name: "Bulbasaur (Pokémon)", answers: ["bulbasur", "bulbasaur"], image: "/images/characters/bulbasaur.jpg" }, 
  { name: "Charizard (Pokémon)", answers: ["charizar", "charizard"], image: "/images/characters/charizard.jpg" },
  { name: "Pikachu (Pokémon)", answers: ["pikachu"], image: "/images/characters/pikachu.jpg" },
  { name: "Totodile (Pokémon)", answers: ["totodile"], image: "/images/characters/totodile.jpg" },
  { name: "Blastoise (Pokémon)", answers: ["blastoise"], image: "/images/characters/blastoise.jpg" },
  { name: "Ekans (Pokémon)", answers: ["ekans"], image: "/images/characters/ekans.jpg" },
  { name: "Raichu (Pokémon)", answers: ["raichu"], image: "/images/characters/raichu.jpg" },
  { name: "Meowth (Pokémon)", answers: ["meowth"], image: "/images/characters/meowth.jpg" },
  { name: "Abra (Pokémon)", answers: ["abra"], image: "/images/characters/abra.jpg" },
  { name: "Machamp (Pokémon)", answers: ["machamp"], image: "/images/characters/machamp.jpg" },
  { name: "Magneton (Pokémon)", answers: ["magneton"], image: "/images/characters/magneton.jpg" },
  { name: "Dodrio (Pokémon)", answers: ["dodrio"], image: "/images/characters/dodrio.jpg" },
  { name: "Koffing (Pokémon)", answers: ["koffing", "kofing"], image: "/images/characters/koffing.jpg" },
  { name: "Hitmonchan (Pokémon)", answers: ["hitmonchan"], image: "/images/characters/hitmonchan.jpg" },
  { name: "Hitmonlee (Pokémon)", answers: ["hitmonlee"], image: "/images/characters/hitmonlee.jpg" },
  { name: "Jynx (Pokémon)", answers: ["jynx", "jinx"], image: "/images/characters/jynx.jpg" },
  { name: "Magmar (Pokémon)", answers: ["magmar"], image: "/images/characters/magmar.jpg" },
  { name: "Zapdos (Pokémon)", answers: ["zapdos"], image: "/images/characters/zapdos.jpg" },
  { name: "Moltres (Pokémon)", answers: ["moltres"], image: "/images/characters/moltres.jpg" },
  { name: "Gyarados (Pokémon)", answers: ["gyarados", "giarados"], image: "/images/characters/gyarados.jpg" },
  { name: "Lapras (Pokémon)", answers: ["lapras"], image: "/images/characters/lapras.jpg" },
  { name: "Aerodactyl (Pokémon)", answers: ["aerodactyl"], image: "/images/characters/aerodactyl.jpg" },
  { name: "Lucario (Pokémon)", answers: ["lucario"], image: "/images/characters/lucario.jpg" },
  { name: "Latios (Pokémon)", answers: ["latios"], image: "/images/characters/latios.jpg" },
  { name: "Latias (Pokémon)", answers: ["latias"], image: "/images/characters/latias.jpg" },
  { name: "Celebi (Pokémon)", answers: ["celebi"], image: "/images/characters/celebi.jpg" },
  { name: "Lugia (Pokémon)", answers: ["lugia"], image: "/images/characters/lugia.jpg" },
  { name: "Entei (Pokémon)", answers: ["entei"], image: "/images/characters/entei.jpg" },
  { name: "Raikou (Pokémon)", answers: ["raikou"], image: "/images/characters/raikou.jpg" },
  { name: "Rayquaza (Pokémon)", answers: ["rayquaza"], image: "/images/characters/rayquaza.jpg" },
  { name: "Suicune (Pokémon)", answers: ["suicune"], image: "/images/characters/suicune.jpg" },
  { name: "Groudon (Pokémon)", answers: ["groudon"], image: "/images/characters/groudon.jpg" },
  { name: "Quiogre (Pokémon)", answers: ["quiogre"], image: "/images/characters/quiogre.jpg" },
  { name: "Meliodas (Nanatsu no Taizai)", answers: ["meliodas"], image: "/images/characters/meliodas.jpg" },
  { name: "Diane (Nanatsu no Taizai)", answers: ["diane", "diana", "dian"], image: "/images/characters/diane.jpg" },
  { name: "Escanor (Nanatsu no Taizai)", answers: ["escanor"], image: "/images/characters/escanor.jpg" },
  { name: "Elizabeth Liones (Nanatsu no Taizai)", answers: ["elisabeth", "elizabeth", "liones", "elizabeth liones", "elisabeth liones"], image: "/images/characters/elizabeth_liones.jpg" },
  { name: "Ban (Nanatsu no Taizai)", answers: ["ban", "van"], image: "/images/characters/ban.jpg" },
  { name: "Hawk (Nanatsu no Taizai)", answers: ["hawk"], image: "/images/characters/hawk.jpg" },
  { name: "Zeldris (Nanatsu no Taizai)", answers: ["zeldris"], image: "/images/characters/zeldris.jpg" },
  { name: "Merlin (Nanatsu no Taizai)", answers: ["merlin"], image: "/images/characters/merlin.jpg" },
  { name: "Arle King (Nanatsu no Taizai)", answers: ["king", "arleking", "arle king"], image: "/images/characters/arle_king.jpg" },
  { name: "Miroku (Inuyasha)", answers: ["monje", "inuyasha", "miroku"], image: "/images/characters/miroku.jpg" },
  { name: "Sesshômaru (Inuyasha)", answers: ["sesshomaru", "seshomaru"], image: "/images/characters/sesshomaru.jpg" },
  { name: "Inuyasha (Inuyasha)", answers: ["inuyasha"], image: "/images/characters/inuyasha.jpg" },
  { name: "Kagome Higurashi (Inuyasha)", answers: ["kagome", "higurashi", "kagome higurashi"], image: "/images/characters/kagome_higurashi.jpg" },
  { name: "Ichigo Kurosaki (Bleach)", answers: ["ichigo", "ichigo kurosaki", "kurosaki"], image: "/images/characters/ichigo_kurosaki.jpg" },
  { name: "Kon (Bleach)", answers: ["kon", "peluche de bleach", "peluche bleach"], image: "/images/characters/kon.jpg" },
  { name: "Grimmjow Jaegerjaques (Bleach)", answers: ["grimmjow", "jaegerjaques", "grimjow"], image: "/images/characters/grimmjow_jaegerjaques.jpg" },
  { name: "Ulquiorra Cifer (Bleach)", answers: ["ulquiorra", "cifer", "ulquiorra cifer"], image: "/images/characters/ulquiorra_cifer.jpg" },
  { name: "Shinnosuke Nohara (Shin-chan)", answers: ["shinchan", "chinchan", "nohara"], image: "/images/characters/shinnosuke_nohara.jpg" },
  { name: "Misae Nohara (Shin-chan)", answers: ["misae", "shinchan", "nohara"], image: "/images/characters/misae_nohara.jpg" },
  { name: "Hiroshi Nohara (Shin-chan)", answers: ["hiroshi", "shinchan", "nohara"], image: "/images/characters/hiroshi_nohara.jpg" },
  { name: "Bo-Chan (Shin-chan)", answers: ["bochan", "bo chan"], image: "/images/characters/bo_chan.jpg" },
  { name: "Masao Soto (Shin-chan)", answers: ["masao", "soto", "masao soto"], image: "/images/characters/masao_soto.jpg" },
  { name: "Nene Sakurada (Shin-chan)", answers: ["nene", "sakurada", "nene sakurada"], image: "/images/characters/nene_sakurada.jpg" },
  { name: "Tooru Kasama (Shin-chan)", answers: ["toru", "tooru", "kasama", "tooru kasama", "toru kasama"], image: "/images/characters/tooru_kasama.jpg" },
  { name: "Bunta Takura (Shin-chan)", answers: ["bunta", "director", "takura", "bunta takura"], image: "/images/characters/bunta_takura.jpg" },
  { name: "Cerdito Valiente (Shin-chan)", answers: ["Buriburizaemon", "cerdito", "cerdito valiente"], image: "/images/characters/cerdito_valiente.jpg" },
  { name: "Ultraheroe (Shin-chan)", answers: ["ultraheroe"], image: "/images/characters/ultraheroe.jpg" },
  { name: "Asuka Langley (Evangelion)", answers: ["asuka", "asuka langley"], image: "/images/characters/asuka_langley.jpg" },
  { name: "Shinji Ikari (Evangelion)", answers: ["shinji", "shinji ikari"], image: "/images/characters/shinji_ikari.jpg" },
  { name: "Yor Forger (Spy X Family)", answers: ["yor", "forger", "yor forger"], image: "/images/characters/yor_forger.jpg" },  
  { name: "Anya Forger (Spy X Family)", answers: ["anya", "anya forger"], image: "/images/characters/anya_forger.jpg" },
  { name: "Ben Ten (Ben 10)", answers: ["ben ten", "benten", "ben 10", "ben10"], image: "/images/characters/ben_ten.jpg" },
  { name: "Diamantino (Ben 10)", answers: ["diamantino", "ben ten", "benten", "ben 10", "ben10"], image: "/images/characters/diamantino.jpg" },
  { name: "Materia Gris (Ben 10)", answers: ["materia gris", "gris", "materia", "ben ten", "benten", "ben 10", "ben10"], image: "/images/characters/materia_gris.jpg" },
  { name: "Cuatro Brazos (Ben 10)", answers: ["cuatro brazos", "ben ten", "benten", "ben 10", "ben10"], image: "/images/characters/cuatro_brazos.jpg" },
  { name: "Alphonse Elric (Fullmetal)", answers: ["alfons", "alfonse", "alfonso", "alphons", "elric", "alphonse"], image: "/images/characters/alphonse_elric.jpg" },
  { name: "Edward Elric (Fullmetal)", answers: ["edward", "edward elric", "ed elric"], image: "/images/characters/edward_elric.jpg" },
  { name: "Winry Rockbell (Fullmetal)", answers: ["winry", "winry rockbell", "rockbell"], image: "/images/characters/winry_rockbell.jpg" },
  { name: "Rebecca (Cyberpunk: Edgerunners)", answers: ["rebecca", "rebeca"], image: "/images/characters/rebecca.jpg" }, 
  { name: "Lucyna Kushinada (Cyberpunk: Edgerunners)", answers: ["lucy", "lucyna", "kushinada", "lucyna kushinada"], image: "/images/characters/lucyna_kushinada.jpg" }, 
  { name: "David Martinez (Cyberpunk: Edgerunners)", answers: ["david", "martinez", "david martinez"], image: "/images/characters/david_martinez.jpg" },
  { name: "Kanata Katagiri (MF Ghost)", answers: ["kanata", "katagiri", "kanata katagiri"], image: "/images/characters/kanata_katagiri.jpg" }, 
  { name: "Ren Saionji (MF Ghost)", answers: ["ren", "saionji", "ren saionji"], image: "/images/characters/ren_saionji.jpg" }, 
  { name: "Michael Beckenbauer (MF Ghost)", answers: ["michael", "beckenbauer", "michael beckenbauer"], image: "/images/characters/michael_beckenbauer.jpg" }, 
  { name: "Baki Hanma (Baki)", answers: ["baki"], image: "/images/characters/baki_hanma.jpg" },
  { name: "Yujiro Hanma (Baki)", answers: ["yujiro", "hanma", "yujiro hanma"], image: "/images/characters/yujiro_hanma.jpg" },
  { name: "Biscuit Oliva (Baki)", answers: ["biscuit", "oliva", "biscuit oliva"], image: "/images/characters/biscuit_oliva.jpg" }, 
  { name: "Drácula (Castlevania)", answers: ["drácula", "dracula"], image: "/images/characters/dracula.jpg" }, 
  { name: "Trevor Belmont (Castlevania)", answers: ["trevor", "belmont", "trevor belmont"], image: "/images/characters/trevor_belmont.jpg" }, 
  { name: "Mamoru Endo (Inazuma Eleven)", answers: ["mamoru", "endo", "mamoru endo"], image: "/images/characters/mamoru_endo.jpg" },
  { name: "Jack Wallside (Inazuma Eleven)", answers: ["jack", "wallside", "jack wallside"], image: "/images/characters/jack_wallside.jpg" },
  { name: "Arale (Dr. Slump)", answers: ["arale"], image: "/images/characters/arale.jpg" },
  { name: "Dr. Slump (Dr. Slump)", answers: ["dr slump", "drslump", "drslum", "slump", "slum", "dr. slump", "dr. slum"], image: "/images/characters/dr_slump.jpg" },
  { name: "Kirito (Sword Art Online)", answers: ["kirito"], image: "/images/characters/kirito.jpg" },
  { name: "Asuna (Sword Art Online)", answers: ["asuna"], image: "/images/characters/asuna.jpg" }, 
  { name: "Saitama (One Punch Man)", answers: ["saitama"], image: "/images/characters/saitama.jpg" },
  { name: "Genos (One Punch Man)", answers: ["genos"], image: "/images/characters/genos.jpg" },
  { name: "Avatar Aang (Avatar)", answers: ["aang", "avatar", "avatar aang", "ang"], image: "/images/characters/avatar_aang.jpg" },
  { name: "Katara (Avatar)", answers: ["katara"], image: "/images/characters/katara.jpg" },
  { name: "Zuko (Avatar)", answers: ["zuko"], image: "/images/characters/zuko.jpg" },
  { name: "Will Serfort (Wistoria)", answers: ["will", "will serfort", "serfort"], image: "/images/characters/will_serfort.jpg" },
  { name: "Lihanna Owenzaus (Wistoria)", answers: ["lihanna owenzaus", "owenzaus", "lihanna"], image: "/images/characters/lihanna_owenzaus.jpg" },
  { name: "Colette Loire (Wistoria)", answers: ["colette loire", "loira", "colette"], image: "/images/characters/colette_loire.jpg" },
  { name: "Wignall Lindor (Wistoria)", answers: ["wignall lindor", "wignall", "lindor"], image: "/images/characters/wignall_lindor.jpg" },
  { name: "Sion Ulster (Wistoria)", answers: ["sion ulster", "sion", "ulster"], image: "/images/characters/sion_ulster.jpg" },
  { name: "Julius Reinberg (Wistoria)", answers: ["julius reinberg", "julius", "reinberg"], image: "/images/characters/julius_reinberg.jpg" },
  { name: "Elfaria Albis Serfort (Wistoria)", answers: ["elfaria", "elfaria albis serfort", "albis serfort", "albis", "serfort", "elfaria albis"], image: "/images/characters/elfaria_albis.jpg" },
  { name: "Sakura (Cardcaptor Sakura)", answers: ["sakura", "cardcaptor", "cardcaptor sakura"], image: "/images/characters/cardcaptor_sakura.jpg" },
  { name: "Kero (Cardcaptor Sakura)", answers: ["kero"], image: "/images/characters/kero.jpg" },
  { name: "Megaman (Megaman)", answers: ["megaman"], image: "/images/characters/megaman.jpg" },
  { name: "Hamtaro (Hamtaro)", answers: ["hamtaro", "jamtaro"], image: "/images/characters/hamtaro.jpg" },
  { name: "Lucy (Elfen Lied)", answers: ["lucy", "lusi", "luci", "lusy"], image: "/images/characters/lucy.jpg" },
  { name: "Mugen (Samurai Champloo)", answers: ["mugen"], image: "/images/characters/mugen.jpg" },
  { name: "Astroboy (Astroboy)", answers: ["astroboy"], image: "/images/characters/astroboy.jpg" },
  { name: "Gintoki Sakata (Gintama)", answers: ["gintoki", "sakata", "gintoki sakata"], image: "/images/characters/gintoki_sakata.jpg" },
  { name: "Natsu Dragneel (Fairy Tail)", answers: ["natsu"], image: "/images/characters/natsu_dragneel.jpg" },
  { name: "Doremi (Doremi)", answers: ["doremi"], image: "/images/characters/doremi.jpg" },
  { name: "Rin Okumura (Blue Exorcist)", answers: ["blue exorcist", "rin", "okumura", "rin okumura"], image: "/images/characters/rin_okumura.jpg" },
  { name: "Koro-Sensei (Assassination Classroom)", answers: ["pulpo", "koro", "korosensei", "koro-sensei"], image: "/images/characters/koro_sensei.jpg" },
  { name: "Hanamichi Sakuragi (Slam Dunk)", answers: ["hanamachi", "sakuragi", "hanamachi sakuragi"], image: "/images/characters/hanamichi_sakuragi.jpg" }, 
  { name: "Sung Jin-Woo (Solo Leveling)", answers: ["sung", "sung jin woo", "sung jin", "sungjinwoo"], image: "/images/characters/sung_jin_woo.jpg" }, 
  { name: "Shōyō Hinata (Haikyu!!)", answers: ["shoyo hinata", "shoyo", "hinata"], image: "/images/characters/shoyo_hinata.jpg" },
  { name: "Ken Kaneki (Tokyo Ghoul)", answers: ["kaneki", "ken", "ken kaneki", "kaneki ken"], image: "/images/characters/ken_kaneki.jpg" }, 
  { name: "Juuzou Suzuya (Tokyo Ghoul)", answers: ["juuzou", "juzo", "suzuya", "juuzo suzuya"], image: "/images/characters/juuzou_suzuya.jpg" },
  { name: "Tatsu (De yakuza a amo de casa)", answers: ["tatsu"], image: "/images/characters/tatsu.jpg" },  
  { name: "Guts (Berserk)", answers: ["guts"], image: "/images/characters/guts.jpg" }, 
  { name: "Zero Two (Darling in the Franxx)", answers: ["zero two", "zerotwo", "franxx", "02"], image: "/images/characters/zero_two.jpg" }, 
  { name: "Draken Ryuuguji (Tokyo Revengers)", answers: ["ken", "draken", "ken ryuuguji"], image: "/images/characters/draken_ryuuguji.jpg" }, 
  { name: "Sailor Moon (Sailor Moon)", answers: ["sailor moon", "usagi", "usagi tsukino"], image: "/images/characters/sailor_moon.jpg" },
  { name: "Yugi Mutou (Yu-Gi-Oh!)", answers: ["yugi", "yugi mutou", "mutou", "yami", "yami yugi"], image: "/images/characters/yugi_mutou.jpg" },
  { name: "Mago Oscuro (Yu-Gi-Oh!)", answers: ["mago", "oscuro", "mago oscuro"], image: "/images/characters/mago_oscuro.jpg" },
  { name: "Spike Spiegel (Cowboy Bebop)", answers: ["spike", "spike spiegel"], image: "/images/characters/spike_spiegel.jpg" },
  { name: "Senku Ishigami (Dr. Stone)", answers: ["senku", "senku ishigami"], image: "/images/characters/senku_ishigami.jpg" },
  { name: "Totoro (My Neighbor Totoro)", answers: ["totoro"], image: "/images/characters/totoro.jpg" },
  { name: "Jotaro Kujo (Jojo's)", answers: ["jojo", "jotaro", "jotaro kujo", "kujo"], image: "/images/characters/jotaro_kujo.jpg" },
  { name: "Takumi Fujiwara (Initial D.)", answers: ["takumi", "fujiwara", "initial d", "initiald"], image: "/images/characters/takumi_fujiwara.jpg" },
  { name: "Yoko Litner (Gurren Lagann)", answers: ["yoko", "litner", "yoko litner", "yoco"], image: "/images/characters/yoko_litner.jpg" },
  { name: "Vash Estampida (Trigun)", answers: ["vash", "estampida", "vash estampida"], image: "/images/characters/vash_estampida.jpg" }, 
  { name: "Benjamin Netanyahu (Ministro de Israel)", answers: ["benjamin", "netanyahu", "benjamin netanyahu"], image: "/images/characters/benjamin_netanyahu.jpg" }
];

// ---------------------------------------------------------------
// 6) BGM TRACKS - música de fondo durante toda la partida
// ---------------------------------------------------------------
// Añade aquí los nombres de tus archivos de música (colócalos en
// public/audio/bgm/). Se reproducirán en bucle y en orden aleatorio
// desde que empieza la partida hasta que se muestran los resultados
// finales. Déjalo vacío [] si no quieres música de fondo.
const bgmTracks = [
  "/audio/bgm/Light Theme D.mp3",
];

module.exports = { trivia, openings, osts, photoRounds, animeList, drawCharacters, bgmTracks, DIFFICULTY_CONFIG, WRONG_PENALTY_RATIO };
