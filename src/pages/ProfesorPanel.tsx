import { useEffect, useState } from "react";
import { getActividades } from "../services/actividades";
import { getAlumnos } from "../services/alumnos";
import { getAsistenciasHoy, marcarAsistencia } from "../services/asistencias";
import { logout } from "../services/auth";
import { useAuth } from "../hooks/useAuth";
import { fechaLargaAR } from "../lib/fecha";
import type { Alumno } from "../types/models";
import type { Tables } from "../types/supabase";
import { ChevronLeft } from "lucide-react";
import { IconButton, Screen } from "../components/Screen";
import SwipeAlumnoCard from "../components/SwipeAlumnoCard";
import { shouldShowSwipeHint } from "../lib/swipeHint";

type Actividad = Tables<"actividades">;

export default function ProfesorPanel() {
    const { user, profile } = useAuth();
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividad | null>(null);
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [total, setTotal] = useState(0);
    const [presentes, setPresentes] = useState(0);
    const [ausentes, setAusentes] = useState(0);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (!actividadSeleccionada) return;
        let cancelled = false;
        const fetchLista = async () => {
            const [todos, hoy] = await Promise.all([
                getAlumnos(actividadSeleccionada.id),
                getAsistenciasHoy(actividadSeleccionada.id),
            ]);
            if (cancelled) return;
            const marcados = new Set(hoy.map((h) => h.alumno_id));
            const pendientes = todos
                .filter((a) => !marcados.has(a.id))
                .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
            setAlumnos(pendientes);
            setTotal(todos.length);
            setPresentes(hoy.filter((h) => h.presente).length);
            setAusentes(hoy.filter((h) => !h.presente).length);
            setLoading(false);
        };
        void fetchLista();
        return () => {
            cancelled = true;
        };
    }, [actividadSeleccionada]);

    const handleMarcar = async (alumno: Alumno, presente: boolean) => {
        if (!user) return;
        setAlumnos((prev) => prev.filter((a) => a.id !== alumno.id));
        if (presente) setPresentes((n) => n + 1);
        else setAusentes((n) => n + 1);
        const ok = await marcarAsistencia(alumno.id, presente, user.id);
        if (!ok) {
            setAlumnos((prev) =>
                [...prev, alumno].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
            );
            if (presente) setPresentes((n) => n - 1);
            else setAusentes((n) => n - 1);
        }
    };

    if (actividadSeleccionada) {
        const hechos = presentes + ausentes;
        const progreso = total === 0 ? 0 : Math.round((hechos / total) * 100);

        return (
            <Screen>
                <div className="mb-6 flex items-center gap-3">
                    <IconButton
                        label="Volver"
                        onClick={() => setActividadSeleccionada(null)}
                    >
                        <ChevronLeft size={20} />
                    </IconButton>
                    <div className="min-w-0">
                        <h1 className="font-display text-4xl leading-none tracking-wide text-crema">
                            {actividadSeleccionada.nombre}
                        </h1>
                        <p className="mt-1 text-sm capitalize text-muted">{fechaLargaAR()}</p>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-muted">Cargando...</p>
                ) : total === 0 ? (
                    <div className="rounded-card bg-cancha p-8 text-center">
                        <p className="font-semibold text-crema">No hay alumnos todavía</p>
                        <p className="mt-1 text-sm text-muted">El admin tiene que cargarlos</p>
                    </div>
                ) : alumnos.length === 0 ? (
                    <div className="rounded-card bg-cancha px-6 py-12 text-center">
                        <p className="font-display text-6xl leading-none text-lima">
                            {total} / {total}
                        </p>
                        <p className="mt-4 text-lg font-semibold text-crema">Lista completa</p>
                        <p className="mt-1 text-sm text-muted">
                            {presentes} presentes · {ausentes} ausentes
                        </p>
                        <button
                            type="button"
                            onClick={() => setActividadSeleccionada(null)}
                            className="mt-6 rounded-card bg-naranja px-5 py-2.5 text-sm font-semibold text-ink"
                        >
                            Volver
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <div className="mb-2 flex items-baseline justify-between">
                                <span className="font-display text-2xl tracking-wide text-lima">
                                    {hechos} / {total}
                                </span>
                                <span className="text-xs text-muted">deslizá para marcar</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-cancha-2">
                                <div
                                    className="h-full rounded-full bg-lima transition-[width] duration-300"
                                    style={{ width: `${progreso}%` }}
                                />
                            </div>
                        </div>
                        <ul className="flex flex-col gap-3">
                            {alumnos.map((alumno, i) => (
                                <li key={alumno.id}>
                                    <SwipeAlumnoCard
                                        nombre={alumno.nombre}
                                        showHint={i === 0 && shouldShowSwipeHint()}
                                        onPresente={() => handleMarcar(alumno, true)}
                                        onAusente={() => handleMarcar(alumno, false)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </Screen>
        );
    }

    const saludo = profile?.nombre ? `Hola, ${profile.nombre}` : "Mis actividades";

    return (
        <Screen>
            <div className="mb-8 flex items-start justify-between gap-3">
                <div>
                    <p className="font-display text-5xl leading-none tracking-wide text-naranja">CORNER</p>
                    <h1 className="mt-2 text-xl font-semibold text-crema">{saludo}</h1>
                    <p className="mt-1 text-sm capitalize text-muted">{fechaLargaAR()}</p>
                </div>
                <button
                    type="button"
                    onClick={logout}
                    className="rounded-card bg-coral px-3 py-2 text-sm font-medium text-crema"
                >
                    Salir
                </button>
            </div>

            {loading ? (
                <p className="text-center text-muted">Cargando...</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {actividades.map((actividad) => (
                        <li key={actividad.id}>
                            <button
                                type="button"
                                onClick={() => {
                                    setLoading(true);
                                    setActividadSeleccionada(actividad);
                                }}
                                className="flex w-full items-center justify-between rounded-card bg-naranja px-5 py-5 text-left text-ink"
                            >
                                <span className="font-display text-3xl leading-none tracking-wide">
                                    {actividad.nombre}
                                </span>
                                <span className="text-sm font-medium opacity-80">hoy →</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </Screen>
    );
}
