import { useEffect, useState } from "react";
import { getActividades, crearActividad, borrarActividad } from "../services/actividades";
import { logout } from "../services/auth";
import type { Tables } from "../types/supabase";
import { PlusCircle, Trash2, ChevronRight } from "lucide-react";
import AlumnosPage from "./AlumnosPage";

type Actividad = Tables<"actividades">;

export default function AdminPanel() {
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [loading, setLoading] = useState();
    const [nuevaActividad, setNuevaActividad] = useState("");
    const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividad | null>(null);

    const fetchActividades = async () => {
        setLoading(true);
        const data = await getActividades();
        setActividades(data);
        setLoading(false);
    }

    useEffect(() => { fetchActividades() }, []);

    const handleCrear = async () => {
        if (!nuevaActividad.trim()) return
        await crearActividad(nuevaActividad.trim());
        setNuevaActividad("");
        fetchActividades();
    }

    const handleBorrar = async (id: string) => {
        if (!window.confirm("Seguro que quieres borrar esta actividad")) return;
        await borrarActividad(id);
        fetchActividades();
    }

    if (actividadSeleccionada) {
        return (
            <AlumnosPage
                actividad={actividadSeleccionada}
                onVolver={() => setActividadSeleccionada(null)}
            />
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Corner App</h1>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                <div className="bg-gray-800 rounded-xl shadow p-4 mb-6 flex gap-3">
                    <input
                        value={nuevaActividad}
                        onChange={e => setNuevaActividad(e.target.value)}
                        placeholder="Nueva actividad (ej: Futbol 1)"
                        className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                    />
                    <button
                        onClick={handleCrear}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <PlusCircle size={16} />
                        Agregar
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
                                <button
                                    onClick={() => handleBorrar(actividad.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}