import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";


export interface Videojuego {
    id: string;
    titulo: string;
    plataforma: string;
    genero: string;
    precio: number;
    anio: number;
    calificacion: number;
    disponible: boolean;
    ficha: {
        desarrollador: string;
        clasificacion: string;
        multijugador: boolean;
    };
}

const videojuegos: Videojuego[] = [
    {
        id: "JUE001",
        titulo: "The Legend of Zelda: Tears of the Kingdom",
        plataforma: "Nintendo Switch",
        genero: "Aventura",
        precio: 69.99,
        anio: 2023,
        calificacion: 9.6,
        disponible: true,
        ficha: {
            desarrollador: "Nintendo EPD",
            clasificacion: "E10+",
            multijugador: false
        }
    },
    {
        id: "JUE002",
        titulo: "Super Mario Odyssey",
        plataforma: "Nintendo Switch",
        genero: "Plataformas",
        precio: 59.99,
        anio: 2017,
        calificacion: 9.7,
        disponible: true,
        ficha: {
            desarrollador: "Nintendo EPD",
            clasificacion: "E10+",
            multijugador: false
        }
    },
    {
        id: "JUE003",
        titulo: "Mario Kart 8 Deluxe",
        plataforma: "Nintendo Switch",
        genero: "Carreras",
        precio: 49.99,
        anio: 2017,
        calificacion: 9.2,
        disponible: true,
        ficha: {
            desarrollador: "Nintendo EPD",
            clasificacion: "E",
            multijugador: true
        }
    },
    {
        id: "JUE004",
        titulo: "Pokemon Scarlet",
        plataforma: "Nintendo Switch",
        genero: "RPG",
        precio: 59.99,
        anio: 2022,
        calificacion: 8.1,
        disponible: true,
        ficha: {
            desarrollador: "Game Freak",
            clasificacion: "E",
            multijugador: true
        }
    },
    {
        id: "JUE005",
        titulo: "Animal Crossing: New Horizons",
        plataforma: "Nintendo Switch",
        genero: "Simulacion",
        precio: 54.99,
        anio: 2020,
        calificacion: 9.0,
        disponible: true,
        ficha: {
            desarrollador: "Nintendo EPD",
            clasificacion: "E",
            multijugador: true
        }
    },
    {
        id: "JUE006",
        titulo: "God of War Ragnarok",
        plataforma: "PlayStation 5",
        genero: "Accion",
        precio: 59.99,
        anio: 2022,
        calificacion: 9.4,
        disponible: true,
        ficha: {
            desarrollador: "Santa Monica Studio",
            clasificacion: "M",
            multijugador: false
        }
    },
    {
        id: "JUE007",
        titulo: "Marvel's Spider-Man 2",
        plataforma: "PlayStation 5",
        genero: "Accion",
        precio: 69.99,
        anio: 2023,
        calificacion: 9.2,
        disponible: true,
        ficha: {
            desarrollador: "Insomniac Games",
            clasificacion: "T",
            multijugador: false
        }
    },
    {
        id: "JUE008",
        titulo: "The Last of Us Part II",
        plataforma: "PlayStation 4",
        genero: "Supervivencia",
        precio: 39.99,
        anio: 2020,
        calificacion: 9.3,
        disponible: true,
        ficha: {
            desarrollador: "Naughty Dog",
            clasificacion: "M",
            multijugador: false
        }
    },
    {
        id: "JUE009",
        titulo: "Horizon Forbidden West",
        plataforma: "PlayStation 5",
        genero: "Aventura",
        precio: 49.99,
        anio: 2022,
        calificacion: 8.9,
        disponible: true,
        ficha: {
            desarrollador: "Guerrilla Games",
            clasificacion: "T",
            multijugador: false
        }
    },
    {
        id: "JUE010",
        titulo: "Gran Turismo 7",
        plataforma: "PlayStation 5",
        genero: "Carreras",
        precio: 59.99,
        anio: 2022,
        calificacion: 8.7,
        disponible: false,
        ficha: {
            desarrollador: "Polyphony Digital",
            clasificacion: "E",
            multijugador: true
        }
    },
    {
        id: "JUE011",
        titulo: "Elden Ring",
        plataforma: "PC",
        genero: "RPG",
        precio: 59.99,
        anio: 2022,
        calificacion: 9.5,
        disponible: true,
        ficha: {
            desarrollador: "FromSoftware",
            clasificacion: "M",
            multijugador: true
        }
    },
    {
        id: "JUE012",
        titulo: "Cyberpunk 2077",
        plataforma: "PC",
        genero: "RPG",
        precio: 49.99,
        anio: 2020,
        calificacion: 8.5,
        disponible: true,
        ficha: {
            desarrollador: "CD Projekt Red",
            clasificacion: "M",
            multijugador: false
        }
    },
    {
        id: "JUE013",
        titulo: "Red Dead Redemption 2",
        plataforma: "PC",
        genero: "Accion",
        precio: 39.99,
        anio: 2018,
        calificacion: 9.8,
        disponible: true,
        ficha: {
            desarrollador: "Rockstar Games",
            clasificacion: "M",
            multijugador: true
        }
    },
    {
        id: "JUE014",
        titulo: "Grand Theft Auto V",
        plataforma: "PC",
        genero: "Accion",
        precio: 29.99,
        anio: 2013,
        calificacion: 9.5,
        disponible: true,
        ficha: {
            desarrollador: "Rockstar North",
            clasificacion: "M",
            multijugador: true
        }
    },
    {
        id: "JUE015",
        titulo: "Minecraft",
        plataforma: "PC",
        genero: "Supervivencia",
        precio: 26.99,
        anio: 2011,
        calificacion: 9.4,
        disponible: true,
        ficha: {
            desarrollador: "Mojang Studios",
            clasificacion: "E10+",
            multijugador: true
        }
    },
    {
        id: "JUE016",
        titulo: "The Witcher 3: Wild Hunt",
        plataforma: "PC",
        genero: "RPG",
        precio: 39.99,
        anio: 2015,
        calificacion: 9.6,
        disponible: true,
        ficha: {
            desarrollador: "CD Projekt Red",
            clasificacion: "M",
            multijugador: false
        }
    },
    {
        id: "JUE017",
        titulo: "Resident Evil 4 Remake",
        plataforma: "PlayStation 5",
        genero: "Terror",
        precio: 49.99,
        anio: 2023,
        calificacion: 9.1,
        disponible: true,
        ficha: {
            desarrollador: "Capcom",
            clasificacion: "M",
            multijugador: false
        }
    },
    {
        id: "JUE018",
        titulo: "Street Fighter 6",
        plataforma: "PlayStation 5",
        genero: "Peleas",
        precio: 49.99,
        anio: 2023,
        calificacion: 9.0,
        disponible: true,
        ficha: {
            desarrollador: "Capcom",
            clasificacion: "T",
            multijugador: true
        }
    },
    {
        id: "JUE019",
        titulo: "Mortal Kombat 1",
        plataforma: "PlayStation 5",
        genero: "Peleas",
        precio: 59.99,
        anio: 2023,
        calificacion: 8.4,
        disponible: true,
        ficha: {
            desarrollador: "NetherRealm Studios",
            clasificacion: "M",
            multijugador: true
        }
    },
    {
        id: "JUE020",
        titulo: "Final Fantasy XVI",
        plataforma: "PlayStation 5",
        genero: "RPG",
        precio: 59.99,
        anio: 2023,
        calificacion: 8.8,
        disponible: false,
        ficha: {
            desarrollador: "Square Enix",
            clasificacion: "M",
            multijugador: false
        }
    },
    {
        id: "JUE021",
        titulo: "Halo Infinite",
        plataforma: "Xbox Series X",
        genero: "Disparos",
        precio: 39.99,
        anio: 2021,
        calificacion: 8.5,
        disponible: true,
        ficha: {
            desarrollador: "343 Industries",
            clasificacion: "T",
            multijugador: true
        }
    },
    {
        id: "JUE022",
        titulo: "Forza Horizon 5",
        plataforma: "Xbox Series X",
        genero: "Carreras",
        precio: 49.99,
        anio: 2021,
        calificacion: 9.3,
        disponible: true,
        ficha: {
            desarrollador: "Playground Games",
            clasificacion: "E",
            multijugador: true
        }
    },
    {
        id: "JUE023",
        titulo: "Starfield",
        plataforma: "Xbox Series X",
        genero: "RPG",
        precio: 59.99,
        anio: 2023,
        calificacion: 8.2,
        disponible: true,
        ficha: {
            desarrollador: "Bethesda Game Studios",
            clasificacion: "M",
            multijugador: false
        }
    },
    {
        id: "JUE024",
        titulo: "Gears 5",
        plataforma: "Xbox One",
        genero: "Disparos",
        precio: 29.99,
        anio: 2019,
        calificacion: 8.7,
        disponible: true,
        ficha: {
            desarrollador: "The Coalition",
            clasificacion: "M",
            multijugador: true
        }
    },
    {
        id: "JUE025",
        titulo: "Sea of Thieves",
        plataforma: "Xbox Series X",
        genero: "Aventura",
        precio: 39.99,
        anio: 2018,
        calificacion: 8.6,
        disponible: true,
        ficha: {
            desarrollador: "Rare",
            clasificacion: "T",
            multijugador: true
        }
    },
    {
        id: "JUE026",
        titulo: "Call of Duty: Modern Warfare III",
        plataforma: "PC",
        genero: "Disparos",
        precio: 69.99,
        anio: 2023,
        calificacion: 7.8,
        disponible: false,
        ficha: {
            desarrollador: "Sledgehammer Games",
            clasificacion: "M",
            multijugador: true
        }
    },
    {
        id: "JUE027",
        titulo: "Assassin's Creed Valhalla",
        plataforma: "PC",
        genero: "Accion",
        precio: 39.99,
        anio: 2020,
        calificacion: 8.4,
        disponible: true,
        ficha: {
            desarrollador: "Ubisoft Montreal",
            clasificacion: "M",
            multijugador: false
        }
    },
    {
        id: "JUE028",
        titulo: "Far Cry 6",
        plataforma: "PlayStation 4",
        genero: "Disparos",
        precio: 29.99,
        anio: 2021,
        calificacion: 7.9,
        disponible: true,
        ficha: {
            desarrollador: "Ubisoft Toronto",
            clasificacion: "M",
            multijugador: true
        }
    },
    {
        id: "JUE029",
        titulo: "Hogwarts Legacy",
        plataforma: "PlayStation 5",
        genero: "Aventura",
        precio: 59.99,
        anio: 2023,
        calificacion: 8.9,
        disponible: true,
        ficha: {
            desarrollador: "Avalanche Software",
            clasificacion: "T",
            multijugador: false
        }
    },
    {
        id: "JUE030",
        titulo: "Baldur's Gate 3",
        plataforma: "PC",
        genero: "RPG",
        precio: 59.99,
        anio: 2023,
        calificacion: 9.7,
        disponible: true,
        ficha: {
            desarrollador: "Larian Studios",
            clasificacion: "M",
            multijugador: true
        }
    },
    {
        id: "JUE031",
        titulo: "God of War",
        plataforma: "PC",
        genero: "Accion",
        precio: 39.99,
        anio: 2018,
        calificacion: 9.5,
        disponible: true,
        ficha: {
            desarrollador: "Santa Monica Studio",
            clasificacion: "M",
            multijugador: false
        }
    },
    {
        id: "JUE032",
        titulo: "Ghost of Tsushima",
        plataforma: "PlayStation 5",
        genero: "Aventura",
        precio: 49.99,
        anio: 2020,
        calificacion: 9.4,
        disponible: true,
        ficha: {
            desarrollador: "Sucker Punch Productions",
            clasificacion: "M",
            multijugador: true
        }
    },
    {
        id: "JUE033",
        titulo: "Death Stranding",
        plataforma: "PC",
        genero: "Aventura",
        precio: 39.99,
        anio: 2019,
        calificacion: 8.5,
        disponible: true,
        ficha: {
            desarrollador: "Kojima Productions",
            clasificacion: "M",
            multijugador: false
        }
    },
    {
        id: "JUE034",
        titulo: "It Takes Two",
        plataforma: "PlayStation 4",
        genero: "Aventura",
        precio: 39.99,
        anio: 2021,
        calificacion: 9.1,
        disponible: true,
        ficha: {
            desarrollador: "Hazelight Studios",
            clasificacion: "T",
            multijugador: true
        }
    },
    {
        id: "JUE035",
        titulo: "Overcooked! 2",
        plataforma: "Nintendo Switch",
        genero: "Simulacion",
        precio: 24.99,
        anio: 2018,
        calificacion: 8.6,
        disponible: true,
        ficha: {
            desarrollador: "Ghost Town Games",
            clasificacion: "E",
            multijugador: true
        }
    },
    {
        id: "JUE036",
        titulo: "Sonic Frontiers",
        plataforma: "Nintendo Switch",
        genero: "Plataformas",
        precio: 39.99,
        anio: 2022,
        calificacion: 8.0,
        disponible: true,
        ficha: {
            desarrollador: "Sonic Team",
            clasificacion: "E10+",
            multijugador: false
        }
    },
    {
        id: "JUE037",
        titulo: "Super Smash Bros. Ultimate",
        plataforma: "Nintendo Switch",
        genero: "Peleas",
        precio: 59.99,
        anio: 2018,
        calificacion: 9.4,
        disponible: true,
        ficha: {
            desarrollador: "Bandai Namco Studios",
            clasificacion: "E10+",
            multijugador: true
        }
    },
    {
        id: "JUE038",
        titulo: "Luigi's Mansion 3",
        plataforma: "Nintendo Switch",
        genero: "Aventura",
        precio: 49.99,
        anio: 2019,
        calificacion: 8.8,
        disponible: true,
        ficha: {
            desarrollador: "Next Level Games",
            clasificacion: "E",
            multijugador: true
        }
    },
    {
        id: "JUE039",
        titulo: "Splatoon 3",
        plataforma: "Nintendo Switch",
        genero: "Disparos",
        precio: 49.99,
        anio: 2022,
        calificacion: 8.7,
        disponible: true,
        ficha: {
            desarrollador: "Nintendo EPD",
            clasificacion: "E10+",
            multijugador: true
        }
    },
    {
        id: "JUE040",
        titulo: "Persona 5 Royal",
        plataforma: "PlayStation 5",
        genero: "RPG",
        precio: 49.99,
        anio: 2019,
        calificacion: 9.6,
        disponible: true,
        ficha: {
            desarrollador: "Atlus",
            clasificacion: "M",
            multijugador: false
        }
    }
];



const cargarVideojuegos = async () => {
    try {
        for (const videojuego of videojuegos) {
            const { id, ...datos } = videojuego;

            await setDoc(
                doc(db, "videojuegos", id),
                datos
            );

            console.log(`Guardado: ${id}`);
        }

        console.log("Carga de los 40 videojuegos completada");

    } catch (error) {
        console.error("Error al guardar videojuegos:", error);
    }
};

cargarVideojuegos();