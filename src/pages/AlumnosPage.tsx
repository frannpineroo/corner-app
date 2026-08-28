import { useEffect, useState } from "react";
import { getAlumnos, borrarAlumno, editarAlumno } from "../services/alumnos";
import type { Alumno } from "../types/models";
import type { Tables } from "../types/supabase";
import AlumnoForm from "../components/AlumnoForm";
import AsistenciasPage from "./AsistenciasPage";
import { IconButton, Screen } from "../components/Screen";
import { Check, ChevronLeft, ClipboardList, Pencil, Search, Trash2, X } from "lucide-react";

type Actividad = Tables<"actividades">;

interface Props {
    actividad: Actividad;
    onVolver: () => void;
}

const AlumnosPage = ({ actividad, onVolver }: Props) => {
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [loading, setLoading] = useState(true);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [editNombre, setEditNombre] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [vistaAsistencias, setVistaAsistencias] = useState(false);

    const fetchAlumnos = async () => {
        const data = await getAlumnos(actividad.id);
        setAlumnos(data.sort((a, b) => a.nombre.localeCompare(b.nombre, "es")));
        setLoading(false);
    };

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            const data = await getAlumnos(actividad.id);
            if (cancelled) return;
            setAlumnos(data.sort((a, b) => a.nombre.localeCompare(b.nombre, "es")));
            setLoading(false);
        };
        void load();
        return () => {
            cancelled = true;
        };
    }, [actividad.id]);

    const handleBorrar = async (id: string) => {
        if (!window.confirm("¿Seguro que querés borrar este alumno?")) return;
        await borrarAlumno(id);
        fetchAlumnos();
    };

    const handleGuardar = async () => {
        if (!editandoId || !editNombre.trim()) return;
        await editarAlumno(editandoId, { nombre: editNombre.trim() });
        setEditandoId(null);
        fetchAlumnos();
    };

    const alumnosFiltrados = alumnos.filter((alumno) =>
        alumno.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (vistaAsistencias) {
        return (
            <AsistenciasPage
                actividadId={actividad.id}
                actividadNombre={actividad.nombre}
                onVolver={() => setVistaAsistencias(false)}
            />
        );
    }

    return (
        <Screen>
            <div className="mb-6 flex items-center gap-3">
                <IconButton label="Volver" onClick={onVolver}>
                    <ChevronLeft size={20} />
                </IconButton>
                <h1 className="font-display text-4xl leading-none tracking-wide">
                    {actividad.nombre}
                </h1>
            </div>

            <AlumnoForm onCreated={fetchAlumnos} actividadId={actividad.id} />

            <div className="mb-4 flex gap-2">
                <div className="relative min-w-0 flex-1">
                    <Search className="absolute left-3 top-2.5 text-muted" size={18} />
                    <input
                        type="search"
                        placeholder="Buscar alumno..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full rounded-card bg-cancha py-2.5 pr-3 pl-10 text-sm text-crema placeholder-muted outline-none focus:ring-2 focus:ring-azul"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setVistaAsistencias(true)}
                    className="inline-flex items-center gap-2 rounded-card bg-azul px-3 py-2 text-sm font-medium text-ink"
                >
                    <ClipboardList size={16} />
                    Lista
                </button>
            </div>

            {loading ? (
                <p className="text-center text-muted">Cargando...</p>
            ) : alumnosFiltrados.length === 0 ? (
                <p className="text-center text-muted">No hay alumnos</p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {alumnosFiltrados.map((alumno) => (
                        <li
                            key={alumno.id}
                            className="flex items-center gap-2 rounded-card bg-cancha px-4 py-3"
                        >
                            {editandoId === alumno.id ? (
                                <>
                                    <input
                                        value={editNombre}
                                        onChange={(e) => setEditNombre(e.target.value)}
                                        className="min-w-0 flex-1 rounded-lg bg-cancha-2 px-2 py-1 text-sm text-crema outline-none focus:ring-2 focus:ring-naranja"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        aria-label="Guardar"
                                        onClick={handleGuardar}
                                        className="rounded-lg bg-lima p-1.5 text-ink"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Cancelar"
                                        onClick={() => setEditandoId(null)}
                                        className="rounded-lg bg-cancha-2 p-1.5 text-crema"
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditandoId(alumno.id);
                                            setEditNombre(alumno.nombre);
                                        }}
                                        className="min-w-0 flex-1 text-left font-medium text-crema"
                                    >
                                        {alumno.nombre}
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Editar"
                                        onClick={() => {
                                            setEditandoId(alumno.id);
                                            setEditNombre(alumno.nombre);
                                        }}
                                        className="rounded-lg p-1.5 text-muted hover:text-crema"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Borrar"
                                        onClick={() => handleBorrar(alumno.id)}
                                        className="rounded-lg p-1.5 text-coral"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </Screen>
    );
};

export default AlumnosPage;
