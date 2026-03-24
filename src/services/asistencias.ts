import { supabase } from "../lib/supabase";
import type { AsistenciaInsert } from "../types/models";

export const registrarAsistencia = async (
    asistenia: AsistenciaInsert
): Promise<boolean> => {
    const { error } = await supabase
        .from('asistencias')
        .insert([asistenia]);

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}