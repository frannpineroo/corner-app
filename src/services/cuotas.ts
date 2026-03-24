import { supabase } from "../lib/supabase";
import type { CuotaInsert } from "../types/models";

export const registrarPago = async (
    cuota: CuotaInsert
): Promise<boolean> => {
    const { error } = await supabase
        .from('cuotas')
        .insert([cuota]);

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}