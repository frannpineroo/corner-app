import { supabase } from "../lib/supabase";
import type { CuotaInsert } from "../types/models";
import type { Tables } from "../types/supabase";

type Cuota = Tables<"cuotas">;

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

export const getCuotasPorActividad = async (actividad_id: string): Promise<Cuota[]> => {
    const { data: alumnos } = await supabase
        .from('alumnos')
        .select('id')
        .eq('actividad_id', actividad_id)

    if (!alumnos || alumnos.length === 0) return []

    const alumnoIds = alumnos.map(a => a.id)

    const { data, error } = await supabase
        .from('cuotas')
        .select('*')
        .in('alumno_id', alumnoIds)

    if (error) {
        console.error(error)
        return []
    }

    return data ?? []
}

export const toggleCuota = async (
    alumno_id: string,
    mes: string,
    monto: number,
    created_by: string
): Promise<boolean> => {
    const { data } = await supabase
        .from('cuotas')
        .select('id')
        .eq('alumno_id', alumno_id)
        .eq('mes', mes)
        .single()

    if (data) {
        const { error } = await supabase
            .from('cuotas')
            .delete()
            .eq('id', data.id)
        if (error) { console.error(error); return false }
    } else {
        const { error } = await supabase
            .from('cuotas')
            .insert({ alumno_id, mes, monto, created_by })
        if (error) { console.error(error); return false }
    }

    return true
}