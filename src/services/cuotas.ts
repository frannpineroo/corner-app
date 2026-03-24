import { supabase } from "../lib/supabase";

export const registrarPago = async (
    alumno_id: string,
    monto: number,
    mes: string,
    user_id: string
): Promise<boolean> => {
    const { error } = await supabase
        .from('cuotas')
        .insert([{
            alumno_id,
            monto,
            mes,
            created_by: user_id
        }]);

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}