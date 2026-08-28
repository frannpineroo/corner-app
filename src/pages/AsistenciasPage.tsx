import { useEffect, useState } from "react";
import { getAsistenciasPorActividad } from "../services/asistencias";
import type { AlumnoAsistencias } from "../services/asistencias";
import { fechaChip } from "../lib/fecha";
import { ChevronLeft, Search } from "lucide-react";
import { IconButton, Screen } from "../components/Screen";

interface Props {
    actividadNombre: string;
    actividadId: string;
    onVolver: () => void;
}

export default function AsistenciasPage({ actividadNombre, actividadId, onVolver }: Props) {
    const [alumnos, setAlumnos] = useState<AlumnoAsistencias[]>([]);
    const [clases, setClases] = useState(0);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        let cancelled = false;
        const fetchLista = async () => {
            const data = await getAsistenciasPorActividad(actividadId);
            if (cancelled) return;
            setAlumnos(data.alumnos);
            setClases(data.fechas.length);
            setLoading(false);
        };
        void fetchLista();
        return () => {
            cancelled = true;
        };
    }, [actividadId]);

    const filtrados = alumnos.filter((a) =>
        a.alumno_nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <Screen>
            <div className="mb-6 flex items-center gap-3">
                <IconButton label="Volver" onClick={onVolver}>
                    <ChevronLeft size={20} />
                </IconButton>
                <div className="min-w-0">
                    <h1 className="font-display text-4xl leading-none tracking-wide">Asistencias</h1>
                    <p className="mt-1 text-sm text-muted">
                        {actividadNombre} · {alumnos.length} chicos · {clases} clases
                    </p>
                </div>
            </div>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 text-muted" size={18} />
                <input
                    type="search"
                    placeholder="Buscar alumno..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full rounded-card border-0 bg-cancha py-2.5 pr-3 pl-10 text-sm text-crema placeholder-muted outline-none ring-0 focus:ring-2 focus:ring-azul"
                />
            </div>

            <div className="mb-4 flex gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-muted">
                    <span className="size-2.5 rounded-full bg-lima" /> presente
                </span>
                <span className="flex items-center gap-1.5 text-muted">
                    <span className="size-2.5 rounded-full bg-coral" /> ausente
                </span>
            </div>

            {loading ? (
                <p className="text-center text-muted">Cargando...</p>
            ) : filtrados.length === 0 ? (
                <p className="text-center text-muted">Sin alumnos</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {filtrados.map((alumno) => (
                        <li key={alumno.alumno_id} className="rounded-card bg-cancha p-4">
                            <p className="font-semibold text-crema">{alumno.alumno_nombre}</p>
                            {alumno.marcas.length === 0 ? (
                                <p className="mt-2 text-sm text-muted">sin clases marcadas</p>
                            ) : (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {alumno.marcas.map((marca) => (
                                        <span
                                            key={marca.fecha}
                                            className={`rounded-lg px-2 py-1 text-xs font-semibold tabular-nums ${
                                                marca.presente
                                                    ? "bg-lima text-ink"
                                                    : "bg-coral text-crema"
                                            }`}
                                        >
                                            {fechaChip(marca.fecha)}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </Screen>
    );
}
