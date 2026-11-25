import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    where,
    type DocumentData,
    type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

export interface Ficha {
    desarrollador: string;
    clasificacion: string;
    multijugador: boolean;
}

export interface Videojuego {
    id: string;
    titulo: string;
    plataforma: string;
    genero: string;
    precio: number;
    anio: number;
    calificacion: number;
    disponible: boolean;
    ficha: Ficha;
}

export const TAMANIO_PAGINA = 10;


//============================================================================
// PATRÓN 1: juegos de una plataforma, mejor calificados primero
//============================================================================
export const obtenerPorPlataforma = async (plataforma: string, cursor?: QueryDocumentSnapshot<DocumentData>) => {

    let consultaArmada;

    if (cursor) {
        consultaArmada = query(
            collection(db, "videojuegos"),
            where("plataforma", "==", plataforma),
            orderBy("calificacion", "desc"),
            startAfter(cursor),
            limit(TAMANIO_PAGINA)
        )
    } else {
        consultaArmada = query(
            collection(db, "videojuegos"),
            where("plataforma", "==", plataforma),
            orderBy("calificacion", "desc"),
            limit(TAMANIO_PAGINA)
        )
    }

    const juegosEncontradosBDD = await getDocs(consultaArmada);

    const listaJuegos = juegosEncontradosBDD.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    })) as Videojuego[];

    const nuevoUltimoDocumento = juegosEncontradosBDD.docs[juegosEncontradosBDD.docs.length - 1];

    return { listaJuegos, cursor: nuevoUltimoDocumento };
};


//============================================================================
// PATRÓN 2: disponibles de un género, del más barato al más caro
//============================================================================
export const obtenerDisponiblesPorGenero = async (genero: string, cursor?: QueryDocumentSnapshot<DocumentData>) => {

    let consultaArmada;

    if (cursor) {
        consultaArmada = query(
            collection(db, "videojuegos"),
            where("genero", "==", genero),
            where("disponible", "==", true),
            orderBy("precio", "asc"),
            startAfter(cursor),
            limit(TAMANIO_PAGINA)
        )
    } else {
        consultaArmada = query(
            collection(db, "videojuegos"),
            where("genero", "==", genero),
            where("disponible", "==", true),
            orderBy("precio", "asc"),
            limit(TAMANIO_PAGINA)
        )
    }

    const juegosEncontradosBDD = await getDocs(consultaArmada);

    const listaJuegos = juegosEncontradosBDD.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    })) as Videojuego[];

    const nuevoUltimoDocumento = juegosEncontradosBDD.docs[juegosEncontradosBDD.docs.length - 1];

    return { listaJuegos, cursor: nuevoUltimoDocumento };
};


//============================================================================
// PATRÓN 3: juegos dentro de un rango de precio
//============================================================================
export const obtenerPorRangoPrecio = async (minimo: number, maximo: number, cursor?: QueryDocumentSnapshot<DocumentData>) => {

    let consultaArmada;

    if (cursor) {
        consultaArmada = query(
            collection(db, "videojuegos"),
            where("precio", ">=", minimo),
            where("precio", "<=", maximo),
            orderBy("precio", "asc"),
            startAfter(cursor),
            limit(TAMANIO_PAGINA)
        )
    } else {
        consultaArmada = query(
            collection(db, "videojuegos"),
            where("precio", ">=", minimo),
            where("precio", "<=", maximo),
            orderBy("precio", "asc"),
            limit(TAMANIO_PAGINA)
        )
    }

    const juegosEncontradosBDD = await getDocs(consultaArmada);

    const listaJuegos = juegosEncontradosBDD.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    })) as Videojuego[];

    const nuevoUltimoDocumento = juegosEncontradosBDD.docs[juegosEncontradosBDD.docs.length - 1];

    return { listaJuegos, cursor: nuevoUltimoDocumento };
};


//============================================================================
// PATRÓN 4: juegos multijugador, mejor calificados primero
//============================================================================
export const obtenerMultijugador = async (cursor?: QueryDocumentSnapshot<DocumentData>) => {

    let consultaArmada;

    if (cursor) {
        consultaArmada = query(
            collection(db, "videojuegos"),
            where("ficha.multijugador", "==", true),
            orderBy("calificacion", "desc"),
            startAfter(cursor),
            limit(TAMANIO_PAGINA)
        )
    } else {
        consultaArmada = query(
            collection(db, "videojuegos"),
            where("ficha.multijugador", "==", true),
            orderBy("calificacion", "desc"),
            limit(TAMANIO_PAGINA)
        )
    }

    const juegosEncontradosBDD = await getDocs(consultaArmada);

    const listaJuegos = juegosEncontradosBDD.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    })) as Videojuego[];

    const nuevoUltimoDocumento = juegosEncontradosBDD.docs[juegosEncontradosBDD.docs.length - 1];

    return { listaJuegos, cursor: nuevoUltimoDocumento };
};


//============================================================================
// OBTENER TODOS: muestra todos los videjuegos registrados con paginacion
//============================================================================
export const obtenerTodos = async (cursor?: QueryDocumentSnapshot<DocumentData>) => {

    let consultaArmada;

    if (cursor) {
        consultaArmada = query(
            collection(db, "videojuegos"),
            orderBy("calificacion", "desc"),
            startAfter(cursor),
            limit(TAMANIO_PAGINA)
        )
    } else {
        consultaArmada = query(
            collection(db, "videojuegos"),
            orderBy("calificacion", "desc"),
            limit(TAMANIO_PAGINA)
        )
    }

    const juegosEncontradosBDD = await getDocs(consultaArmada);

    const listaJuegos = juegosEncontradosBDD.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    })) as Videojuego[];

    const nuevoUltimoDocumento = juegosEncontradosBDD.docs[juegosEncontradosBDD.docs.length - 1];

    return { listaJuegos, cursor: nuevoUltimoDocumento };
};