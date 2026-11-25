import { useEffect, useState } from "react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import {
    obtenerTodos,
    obtenerPorPlataforma,
    obtenerDisponiblesPorGenero,
    obtenerPorRangoPrecio,
    obtenerMultijugador,
    TAMANIO_PAGINA,
    type Videojuego,
} from "../services/videojuegoService";

type Cursor = QueryDocumentSnapshot<DocumentData> | undefined;

interface Busqueda {
    patron: number; // 0 = Todos, 1 = Plataforma, 2 = Género, 3 = Precio, 4 = Multijugador
    plataforma: string;
    genero: string;
    minimo: number;
    maximo: number;
}

const PLATAFORMAS = ["PC", "PlayStation 5", "Xbox Series", "Nintendo Switch"];
const GENEROS = ["Acción", "Aventura", "RPG", "Deportes", "Estrategia", "Shooter"];

// Decide qué función del servicio llamar según el patrón elegido
const pedirPagina = (b: Busqueda, cursor?: Cursor) => {
    if (b.patron === 0) return obtenerTodos(cursor);
    if (b.patron === 1) return obtenerPorPlataforma(b.plataforma, cursor);
    if (b.patron === 2) return obtenerDisponiblesPorGenero(b.genero, cursor);
    if (b.patron === 3) return obtenerPorRangoPrecio(b.minimo, b.maximo, cursor);
    return obtenerMultijugador(cursor);
};

function VideojuegoConsulta() {
    // 1. Valores de los filtros en pantalla
    const [patron, setPatron] = useState(0);
    const [plataforma, setPlataforma] = useState("PC");
    const [genero, setGenero] = useState("Acción");
    const [minimo, setMinimo] = useState("20");
    const [maximo, setMaximo] = useState("40");

    // 2. Datos y estados de paginación
    const [busqueda, setBusqueda] = useState<Busqueda | null>(null);
    const [juegos, setJuegos] = useState<Videojuego[]>([]);
    const [ultimoDocumento, setUltimoDocumento] = useState<Cursor>(undefined);
    const [cursores, setCursores] = useState<Cursor[]>([undefined]);
    const [numeroPagina, setNumeroPagina] = useState(1);
    const [hayMas, setHayMas] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    // Función central: siempre carga la PÁGINA 1 de una consulta
    const ejecutarBusqueda = async (criterios: Busqueda) => {
        if (cargando) return;
        setMensaje("");
        setCargando(true);

        try {
            const { listaJuegos, cursor } = await pedirPagina(criterios);

            setBusqueda(criterios);
            setJuegos(listaJuegos);
            setUltimoDocumento(cursor);
            setCursores([undefined]); // La página 1 empieza sin cursor
            setNumeroPagina(1);
            setHayMas(listaJuegos.length === TAMANIO_PAGINA);
        } catch (error) {
            console.error("Error al consultar:", error);
            setMensaje("Hubo un error al cargar los datos.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        let activa = true;

        const cargarInicial = async () => {
            setCargando(true);
            setMensaje("");

            try {
                const { listaJuegos, cursor } = await obtenerTodos();
                if (!activa) return;

                setBusqueda({
                    patron: 0,
                    plataforma: "PC",
                    genero: "Acción",
                    minimo: 20,
                    maximo: 40,
                });
                setJuegos(listaJuegos);
                setUltimoDocumento(cursor);
                setCursores([undefined]);
                setNumeroPagina(1);
                setHayMas(listaJuegos.length === TAMANIO_PAGINA);
            } catch (error) {
                console.error("Error al cargar inicial:", error);
                if (activa) setMensaje("Hubo un error al cargar los datos.");
            } finally {
                if (activa) setCargando(false);
            }
        };

        cargarInicial();

        return () => {
            activa = false;
        };
    }, []);



    // Al pulsar el botón "Buscar"
    const manejarBuscar = () => {
        const nuevaBusqueda: Busqueda = {
            patron,
            plataforma,
            genero,
            minimo: Number(minimo),
            maximo: Number(maximo),
        };

        if (patron === 3 && (minimo === "" || maximo === "" || nuevaBusqueda.minimo > nuevaBusqueda.maximo)) {
            setMensaje("El precio mínimo no puede ser mayor que el máximo.");
            return;
        }

        ejecutarBusqueda(nuevaBusqueda);
    };

    // Ir a la página siguiente
    const siguientePagina = async () => {
        if (!busqueda || !ultimoDocumento || cargando || !hayMas) return;
        setCargando(true);

        try {
            const { listaJuegos, cursor } = await pedirPagina(busqueda, ultimoDocumento);

            if (listaJuegos.length === 0) {
                setHayMas(false);
                return;
            }

            // Guardamos el cursor que abrió esta nueva página por si queremos volver atrás
            const nuevosCursores = [...cursores];
            nuevosCursores[numeroPagina] = ultimoDocumento;

            setCursores(nuevosCursores);
            setJuegos(listaJuegos);
            setUltimoDocumento(cursor);
            setNumeroPagina(numeroPagina + 1);
            setHayMas(listaJuegos.length === TAMANIO_PAGINA);
        } catch (error) {
            console.error("Error en siguiente página:", error);
        } finally {
            setCargando(false);
        }
    };

    // Volver a la página anterior
    const paginaAnterior = async () => {
        if (!busqueda || numeroPagina <= 1 || cargando) return;
        setCargando(true);

        try {
            const cursorAnterior = cursores[numeroPagina - 2];
            const { listaJuegos, cursor } = await pedirPagina(busqueda, cursorAnterior);

            setJuegos(listaJuegos);
            setUltimoDocumento(cursor);
            setNumeroPagina(numeroPagina - 1);
            setHayMas(true);
        } catch (error) {
            console.error("Error en página anterior:", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="app-videojuegos">
            <header className="encabezado">
                <h1>Catálogo de videojuegos</h1>
                <p>Paginación de {TAMANIO_PAGINA} en {TAMANIO_PAGINA} con Firestore</p>
            </header>

            <section className="panel-filtros">
                <label>
                    Consulta
                    <select value={patron} onChange={(e) => setPatron(Number(e.target.value))}>
                        <option value={0}>0. Todos (mejor calificados)</option>
                        <option value={1}>1. Por plataforma</option>
                        <option value={2}>2. Disponibles por género</option>
                        <option value={3}>3. Por rango de precio</option>
                        <option value={4}>4. Multijugador</option>
                    </select>
                </label>

                {patron === 1 && (
                    <label>
                        Plataforma
                        <select value={plataforma} onChange={(e) => setPlataforma(e.target.value)}>
                            {PLATAFORMAS.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </label>
                )}

                {patron === 2 && (
                    <label>
                        Género
                        <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                            {GENEROS.map((g) => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </label>
                )}

                {patron === 3 && (
                    <>
                        <label>
                            Precio mínimo
                            <input type="number" value={minimo} onChange={(e) => setMinimo(e.target.value)} />
                        </label>
                        <label>
                            Precio máximo
                            <input type="number" value={maximo} onChange={(e) => setMaximo(e.target.value)} />
                        </label>
                    </>
                )}

                <button type="button" onClick={manejarBuscar} disabled={cargando}>
                    {cargando ? "Cargando..." : "Buscar"}
                </button>
            </section>

            {mensaje && <p className="mensaje">{mensaje}</p>}

            <main className="contenido">
                {cargando && juegos.length === 0 ? (
                    <p>Cargando videojuegos...</p>
                ) : juegos.length === 0 ? (
                    <p>No hay resultados.</p>
                ) : (
                    <div className="tabla-scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Plataforma</th>
                                    <th>Género</th>
                                    <th>Precio</th>
                                    <th>Año</th>
                                    <th>Calificación</th>
                                    <th>Disponible</th>
                                    <th>Multijugador</th>
                                    <th>Desarrollador</th>
                                </tr>
                            </thead>
                            <tbody>
                                {juegos.map((juego) => (
                                    <tr key={juego.id}>
                                        <td>{juego.titulo}</td>
                                        <td>{juego.plataforma}</td>
                                        <td>{juego.genero}</td>
                                        <td>${juego.precio.toFixed(2)}</td>
                                        <td>{juego.anio}</td>
                                        <td>{juego.calificacion}</td>
                                        <td>{juego.disponible ? "Sí" : "No"}</td>
                                        <td>{juego.ficha.multijugador ? "Sí" : "No"}</td>
                                        <td>{juego.ficha.desarrollador}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {busqueda !== null && (
                <nav className="barra-paginas">
                    <button type="button" onClick={paginaAnterior} disabled={cargando || numeroPagina <= 1}>
                        « Anterior
                    </button>
                    <span>Página {numeroPagina}</span>
                    <button type="button" onClick={siguientePagina} disabled={cargando || !hayMas}>
                        Siguiente »
                    </button>
                </nav>
            )}
        </div>
    );
}

export default VideojuegoConsulta;