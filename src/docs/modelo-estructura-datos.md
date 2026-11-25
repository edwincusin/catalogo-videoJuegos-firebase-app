#DEFINICION DE PATRONES DE ACCESO:

CONSULTAS:

1. Juegos de una plataforma, mejor calificados primero.
2. Juegos disponibles de un género, del más barato al más caro.
3. Juegos dentro de un rango de precio.
4. Juegos multijugador, mejor calificados primero.

#MODELO O ESTRUCTURA  NOSQL :  una sola coleccion, cada documento llevvara o usara su ID personalizado.


ejemplo:

videojuegos (colección)
└── JUE001 (documento)
    ├── titulo: "The Legend of Zelda: Tears of the Kingdom"
    ├── plataforma: "Nintendo Switch"
    ├── genero: "Aventura"
    ├── precio: 69.99
    ├── anio: 2023
    ├── calificacion: 9.6
    ├── disponible: true
    └── ficha: {
          desarrollador: "Nintendo EPD",
          clasificacion: "E10+",
          multijugador: false
        }

