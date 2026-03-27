import { supabase } from "../lib/supabase";
import type { Tables } from "../types/supabase";

type Actividad = Tables<"actividades">

export const getActividades = async (): Promise<Actividad[]> => {
    const { data, error } = await supabase
        .from("actividades")
        .select("*");

    if (error) {
        console.error(error);
        return [];
    }

    return data ?? [];
}

export const crearActividad = async (nombre: string): Promise<boolean> => {
    const { error } = await supabase.from("actividades").insert({ nombre });

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}

export const borrarActividad = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from("actividades")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        return false;
    }

    return true
}