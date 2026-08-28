import { supabase } from "../lib/supabase";
import type { Alumno, AlumnoInsert } from "../types/models";

export const getAlumnos = async (actividad_id?: string): Promise<Alumno[]> => {
    let query = supabase.from("alumnos").select("*");

    if (actividad_id) {
        query = query.eq('actividad_id', actividad_id);
    }

    const { data, error } = await query.order("nombre", { ascending: true });

    if (error) {
        console.error(error);
        return []
    }

    return data ?? [];
}

export const crearAlumno = async (
    alumno: AlumnoInsert
): Promise<boolean> => {
    const { error } = await supabase
        .from('alumnos')
        .insert([alumno]);

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}

export const editarAlumno = async (
    id: string,
    alumno: Partial<AlumnoInsert>
): Promise<boolean> => {
    const { error } = await supabase
        .from("alumnos")
        .update(alumno)
        .eq("id", id);

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}

export const borrarAlumno = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from("alumnos")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}