import { supabase } from "../lib/supabase";

export const registrarAsistencia = async (
    alumno_id: string,
    user_id: string
): Promise<boolean> => {
    const { error } = await supabase
        .from('asistencias')
        .insert([{
            alumno_id,
            fecha: new Date().toISOString(),
            presente: true,
            created_by: user_id
        }]);

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}