import { useEffect, useState } from "react";
import { getActividades } from "../services/actividades";
import { getAlumnos } from "../services/alumnos";
import { marcarAsistencia } from "../services/asistencias";
import { logout } from "../services/auth";
import { useAuth } from "../hooks/useAuth";
import type { Alumno } from "../types/models";
import type { Tables } from "../types/supabase";
import { ChevronRight, ChevronLeft, Check, X } from "lucide-react";

type Actividad = Tables<"actividades">;

export default function ProfesorPanel() {
    const { user } = useAuth();
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividad | null>(null);
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [asistencias, setAsistencias] = useState<Record<string, boolean | null>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const data = await getActividades();
            setActividades(data);
            setLoading(false);
        }
        fetch()
    }, [])

    useEffect(() => {
        if (!actividadSeleccionada) return;
        const fetch = async () => {
            setLoading(true);
            const data = await getAlumnos(actividadSeleccionada.id);
            setAlumnos(data);
            const inicial: Record<string, boolean | null> = {};
            data.forEach(a => { inicial[a.id] = null });
            setAsistencias(inicial);
            setLoading(false);
        }
        fetch()
    }, [actividadSeleccionada])

    const handleMarcar = async (alumno_id: string, presente: boolean) => {
        if (!user) return;
        await marcarAsistencia(alumno_id, presente, user.id);
        setAsistencias(prev => ({ ...prev, [alumno_id]: presente }));
    }

    if (actividadSeleccionada) {
        return (
            <div className="min-h-screen bg-gray-900 p-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => setActividadSeleccionada(null)}
                            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">{actividadSeleccionada.nombre}</h1>
                            <p className="text-gray-400 text-sm">{new Date().toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-gray-400 text-center">Cargando...</p>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {alumnos.map((alumno) => (
                                <li key={alumno.id} className={`rounded-xl shadow p-4 flex justify-between items-center transition-colors ${asistencias[alumno.id] === true ? "bg-green-900/40" :
                                    asistencias[alumno.id] === false ? "bg-red-900/40" :
                                        "bg-gray-800"
                                    }`}>
                                    <span className="text-white font-medium">{alumno.nombre}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleMarcar(alumno.id, true)}
                                            className={`px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-colors ${asistencias[alumno.id] === true ? "bg-green-500" : "bg-gray-600 hover:bg-green-500"}`}
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleMarcar(alumno.id, false)}
                                            className={`px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-colors ${asistencias[alumno.id] === false ? "bg-red-500" : "bg-gray-600 hover:bg-red-500"}`}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Mis actividades</h1>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        Cerrar sesión
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-400 text-center">Cargando...</p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {actividades.map((actividad) => (
                            <li
                                key={actividad.id}
                                className="bg-gray-800 rounded-xl shadow p-4 flex justify-between items-center"
                            >
                                <button
                                    onClick={() => setActividadSeleccionada(actividad)}
                                    className="text-white font-medium flex items-center gap-2 hover:text-blue-400 transition-colors"
                                >
                                    <ChevronRight size={18} />
                                    {actividad.nombre}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}