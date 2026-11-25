import { useState } from "react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import {
    obtenerPorPlataforma,
    obtenerDisponiblesPorGenero,
    obtenerPorRangoPrecio,
    obtenerMultijugador,
    TAMANIO_PAGINA,
    type Videojuego,
} from "../services/videojuegoService";

type Cursor = QueryDocumentSnapshot<DocumentData> | undefined;

// Lo que el usuario eligió al pulsar "Buscar". Se guarda para que Siguiente y Anterior
// sigan usando la MISMA consulta, aunque después cambie los campos del panel.
interface Busqueda {
    patron: number;
    plataforma: string;
    genero: string;
    minimo: number;
    maximo: number;
}

const PLATAFORMAS = ["PC", "PlayStation 5", "Xbox Series", "Nintendo Switch"];
const GENEROS = ["Acción", "Aventura", "RPG", "Deportes", "Estrategia", "Shooter"];

// Elige cuál de las 4 consultas ejecutar según el patrón
const pedirPagina = (b: Busqueda, cursor?: Cursor) => {
    if (b.patron === 1) return obtenerPorPlataforma(b.plataforma, cursor);
    if (b.patron === 2) return obtenerDisponiblesPorGenero(b.genero, cursor);
    if (b.patron === 3) return obtenerPorRangoPrecio(b.minimo, b.maximo, cursor);
    return obtenerMultijugador(cursor);
};

function VideojuegoConsulta() {

    // ----- Panel de filtros: lo que el usuario está eligiendo -----
    const [patron, setPatron] = useState(1);
    const [plataforma, setPlataforma] = useState("PC");
    const [genero, setGenero] = useState("Acción");
    const [minimo, setMinimo] = useState("20");
    const [maximo, setMaximo] = useState("40");

    // ----- Resultado y paginación -----
    const [busqueda, setBusqueda] = useState<Busqueda | null>(null);
    const [juegos, setJuegos] = useState<Videojuego[]>([]);
    const [ultimoDocumento, setUltimoDocumento] = useState<Cursor>(undefined);
    const [cursores, setCursores] = useState<Cursor[]>([]);
    const [numeroPagina, setNumeroPagina] = useState(0);
    const [hayMas, setHayMas] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    // ---------- BUSCAR: siempre abre la página 1 ----------
    const buscar = async () => {
        if (cargando) return;
        setMensaje("");

        const nueva: Busqueda = { patron, plataforma, genero, minimo: Number(minimo), maximo: Number(maximo) };

        if (nueva.patron === 3 && (minimo.trim() === "" || maximo.trim() === "" || nueva.minimo > nueva.maximo)) {
            setMensaje("Revisa el rango: el mínimo debe ser menor o igual al máximo.");
            return;
        }

        setCargando(true);
        try {
            const resultado = await pedirPagina(nueva);

            setBusqueda(nueva);
            setJuegos(resultado.listaJuegos);
            setUltimoDocumento(resultado.cursor);
            setCursores([undefined]);                       // la página 1 no usó cursor
            setNumeroPagina(1);
            setHayMas(resultado.listaJuegos.length === TAMANIO_PAGINA);
        } catch (error) {
            console.error("ERROR en la consulta:", error);
        } finally {
            setCargando(false);
        }
    };

    // ---------- SIGUIENTE ----------
    const siguientePagina = async () => {
        if (!busqueda || !ultimoDocumento || cargando || !hayMas) return;
        setCargando(true);
        try {
            const resultado = await pedirPagina(busqueda, ultimoDocumento);

            if (resultado.listaJuegos.length === 0) {
                setHayMas(false);
                return;
            }

            const copia = [...cursores];
            copia[numeroPagina] = ultimoDocumento;          // cursor que abrió la nueva página
            setCursores(copia);

            setJuegos(resultado.listaJuegos);
            setUltimoDocumento(resultado.cursor);
            setNumeroPagina(numeroPagina + 1);
            setHayMas(resultado.listaJuegos.length === TAMANIO_PAGINA);
        } catch (error) {
            console.error("ERROR en siguiente página:", error);
        } finally {
            setCargando(false);
        }
    };

    // ---------- ANTERIOR ----------
    const paginaAnterior = async () => {
        if (!busqueda || numeroPagina <= 1 || cargando) return;
        setCargando(true);
        try {
            const resultado = await pedirPagina(busqueda, cursores[numeroPagina - 2]);

            setJuegos(resultado.listaJuegos);
            setUltimoDocumento(resultado.cursor);
            setNumeroPagina(numeroPagina - 1);
            setHayMas(true);
        } catch (error) {
            console.error("ERROR en página anterior:", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="app-videojuegos">

            {/* ===== ENCABEZADO ===== */}
            <header className="encabezado">
                <h1>Catálogo de videojuegos</h1>
                <p>Consultas a Cloud Firestore con filtros, índices y paginación de 10 en 10</p>
            </header>

            {/* ===== PANEL DE FILTROS ===== */}
            <section className="panel-filtros">
                <label>
                    Consulta
                    <select value={patron} onChange={(e) => setPatron(Number(e.target.value))}>
                        <option value={1}>1. Por plataforma (mejor calificados)</option>
                        <option value={2}>2. Disponibles por género (más baratos)</option>
                        <option value={3}>3. Por rango de precio</option>
                        <option value={4}>4. Multijugador (mejor calificados)</option>
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

                <button type="button" onClick={buscar} disabled={cargando}>
                    {cargando ? "Buscando..." : "Buscar"}
                </button>
            </section>

            {mensaje && <p className="mensaje">{mensaje}</p>}

            {/* ===== RESULTADOS ===== */}
            <main className="contenido">
                {busqueda === null ? (
                    <p>Elige una consulta y pulsa Buscar.</p>
                ) : juegos.length === 0 ? (
                    <p>Sin resultados.</p>
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

            {/* ===== NAVEGACIÓN ===== */}
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