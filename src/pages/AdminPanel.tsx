import { useEffect, useState } from "react";
import { getActividades, crearActividad, borrarActividad } from "../services/actividades";
import { logout } from "../services/auth";
import type { Tables } from "../types/supabase";
import CuotasPage from "./CuotasPage";
import AlumnosPage from "./AlumnosPage";
import { IconButton, Screen } from "../components/Screen";
import { DollarSign, Plus, Trash2 } from "lucide-react";

type Actividad = Tables<"actividades">;

export default function AdminPanel() {
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [loading, setLoading] = useState(true);
    const [nuevaActividad, setNuevaActividad] = useState("");
    const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividad | null>(null);
    const [cuotasActividad, setCuotasActividad] = useState<Actividad | null>(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            const data = await getActividades();
            if (cancelled) return;
            setActividades(data);
            setLoading(false);
        };
        void load();
        return () => {
            cancelled = true;
        };
    }, []);

    const refreshActividades = async () => {
        const data = await getActividades();
        setActividades(data);
    };

    const handleCrear = async () => {
        if (!nuevaActividad.trim()) return;
        await crearActividad(nuevaActividad.trim());
        setNuevaActividad("");
        await refreshActividades();
    };

    const handleBorrar = async (id: string) => {
        if (!window.confirm("Seguro que quieres borrar esta actividad")) return;
        await borrarActividad(id);
        await refreshActividades();
    };

    if (actividadSeleccionada) {
        return (
            <AlumnosPage
                actividad={actividadSeleccionada}
                onVolver={() => setActividadSeleccionada(null)}
            />
        );
    }

    if (cuotasActividad) {
        return (
            <CuotasPage
                actividad={cuotasActividad}
                onVolver={() => setCuotasActividad(null)}
            />
        );
    }

    return (
        <Screen>
            <div className="mb-8 flex items-start justify-between gap-3">
                <div>
                    <p className="font-display text-5xl leading-none tracking-wide text-naranja">CORNER</p>
                    <p className="mt-2 text-sm text-muted">Administración</p>
                </div>
                <button
                    type="button"
                    onClick={logout}
                    className="rounded-card bg-coral px-3 py-2 text-sm font-medium text-crema"
                >
                    Salir
                </button>
            </div>

            <form
                className="mb-6 flex gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleCrear();
                }}
            >
                <input
                    value={nuevaActividad}
                    onChange={(e) => setNuevaActividad(e.target.value)}
                    placeholder="Nueva actividad"
                    className="min-w-0 flex-1 rounded-card bg-cancha px-4 py-3 text-sm text-crema placeholder-muted outline-none focus:ring-2 focus:ring-naranja"
                />
                <button
                    type="submit"
                    aria-label="Agregar actividad"
                    className="inline-flex size-12 shrink-0 items-center justify-center rounded-card bg-naranja text-ink"
                >
                    <Plus size={20} />
                </button>
            </form>

            {loading ? (
                <p className="text-center text-muted">Cargando...</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {actividades.map((actividad) => (
                        <li
                            key={actividad.id}
                            className="flex items-center gap-2 rounded-card bg-cancha p-2 pl-4"
                        >
                            <button
                                type="button"
                                onClick={() => setActividadSeleccionada(actividad)}
                                className="min-w-0 flex-1 py-2 text-left font-display text-2xl tracking-wide text-crema"
                            >
                                {actividad.nombre}
                            </button>
                            <IconButton
                                label="Cuotas"
                                tone="lima"
                                onClick={() => setCuotasActividad(actividad)}
                            >
                                <DollarSign size={16} />
                            </IconButton>
                            <IconButton
                                label="Borrar actividad"
                                tone="coral"
                                onClick={() => handleBorrar(actividad.id)}
                            >
                                <Trash2 size={16} />
                            </IconButton>
                        </li>
                    ))}
                </ul>
            )}
        </Screen>
    );
}
