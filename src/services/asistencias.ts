import { supabase } from "../lib/supabase";
import type { Tables } from "../types/supabase";

type Asistencia = Tables<"asistencias">;

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
}

export const registrarAsistencia = async (
    alumno_id: string,
    fecha: string,
    presente: boolean,
    created_by: string
): Promise<boolean> => {
    const { error } = await supabase.from("asistencias").insert({ alumno_id, fecha, presente, created_by });

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}