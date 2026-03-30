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

export const marcarAsistencia = async (
    alumno_id: string,
    presente: boolean,
    created_by: string
): Promise<boolean> => {
    const fecha = new Date().toISOString().split("T")[0];

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
}