import { supabase } from "../lib/supabase";
import type { Alumno, AlumnoInsert } from "../types/models";

export const getAlumnos = async (): Promise<Alumno[]> => {
    const { data, error } = await supabase
        .from('alumnos')
        .select('*')

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