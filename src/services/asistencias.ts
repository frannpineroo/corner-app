import { supabase } from "../lib/supabase";
import { getAlumnos } from "./alumnos";
import { fechaLocalAR } from "../lib/fecha";
import type { Tables } from "../types/supabase";

type Asistencia = Tables<"asistencias">;

export type AsistenciaFila = {
    alumno_id: string;
    alumno_nombre: string;
    fecha: string;
    presente: boolean;
};

export type AlumnoAsistencias = {
    alumno_id: string;
    alumno_nombre: string;
    marcas: { fecha: string; presente: boolean }[];
};

export const getAsistenciaPorAlumno = async (alumno_id: string): Promise<Asistencia[]> => {
    const { data, error } = await supabase
        .from("asistencias")
        .select("*")
        .eq("alumno_id", alumno_id)
        .order("fecha", { ascending: false });

    if (error) {
        console.error(error);
        return [];
    }

    return data ?? [];
};

export const marcarAsistencia = async (
    alumno_id: string,
    presente: boolean,
    created_by: string
): Promise<boolean> => {
    const fecha = fechaLocalAR();

    const { error } = await supabase
        .from("asistencias")
        .upsert(
            { alumno_id, fecha, presente, created_by },
            { onConflict: "alumno_id,fecha" }
        );

    if (error) {
        console.error(error);
        return false;
    }

    return true;
};

export const getAsistenciasHoy = async (
    actividad_id: string
): Promise<{ alumno_id: string; presente: boolean }[]> => {
    const fecha = fechaLocalAR();

    const { data, error } = await supabase
        .from("asistencias")
        .select("alumno_id, presente, alumnos!inner(actividad_id)")
        .eq("fecha", fecha)
        .eq("alumnos.actividad_id", actividad_id);

    if (error) {
        console.error(error);
        return [];
    }

    return (data ?? [])
        .filter((row) => row.alumno_id)
        .map((row) => ({
            alumno_id: row.alumno_id as string,
            presente: row.presente ?? false,
        }));
};

export const getTodasAsistenciasConAlumnos = async (
    actividad_id: string
): Promise<AsistenciaFila[]> => {
    const { data, error } = await supabase
        .from("asistencias")
        .select("alumno_id, fecha, presente, alumnos!inner(nombre, actividad_id)")
        .eq("alumnos.actividad_id", actividad_id)
        .order("fecha", { ascending: true });

    if (error) {
        console.error(error);
        return [];
    }

    return (data ?? []).map((row) => {
        const alumno = row.alumnos as { nombre?: string } | { nombre?: string }[] | null;
        const nombre = Array.isArray(alumno) ? alumno[0]?.nombre : alumno?.nombre;
        return {
            alumno_id: row.alumno_id as string,
            alumno_nombre: nombre ?? "Sin nombre",
            fecha: row.fecha,
            presente: row.presente ?? false,
        };
    });
};

export const getAsistenciasPorActividad = async (
    actividad_id: string
): Promise<{ alumnos: AlumnoAsistencias[]; fechas: string[] }> => {
    const [alumnos, filas] = await Promise.all([
        getAlumnos(actividad_id),
        getTodasAsistenciasConAlumnos(actividad_id),
    ]);

    const porAlumno = new Map<string, AlumnoAsistencias>();
    for (const alumno of alumnos) {
        porAlumno.set(alumno.id, {
            alumno_id: alumno.id,
            alumno_nombre: alumno.nombre,
            marcas: [],
        });
    }

    for (const fila of filas) {
        let entry = porAlumno.get(fila.alumno_id);
        if (!entry) {
            entry = {
                alumno_id: fila.alumno_id,
                alumno_nombre: fila.alumno_nombre,
                marcas: [],
            };
            porAlumno.set(fila.alumno_id, entry);
        }
        entry.marcas.push({ fecha: fila.fecha, presente: fila.presente });
    }

    const lista = [...porAlumno.values()].sort((a, b) =>
        a.alumno_nombre.localeCompare(b.alumno_nombre, "es")
    );
    const fechas = [...new Set(filas.map((f) => f.fecha))].sort();

    return { alumnos: lista, fechas };
};
