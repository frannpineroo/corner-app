import { supabase } from "../lib/supabase";
import type { Alumno } from "../types/db";

export const getAlumnos = async (): Promise<Alumno[]> => {
    const { data, error } = await supabase
        .from('alumnos')
        .select('*')

    if (error) {
        console.error(error);
        return []
    }

    return data as Alumno[];
}

export const crearAlumno = async (
    nombre: string,
    nro_padres: string,
    ficha_medica: boolean,
    fecha_nacimiento: string,
    actividad_id: string
): Promise<boolean> => {
    const { error } = await supabase
        .from('alumnos')
        .insert([{ nombre, nro_padres, ficha_medica, fecha_nacimiento, actividad_id }]);

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}