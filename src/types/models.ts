import type { Database } from "./supabase";
import type { TablesInsert } from "./supabase";

export type Alumno = Database['public']['Tables']['alumnos']['Row'];
export type Cuota = Database['public']['Tables']['cuotas']['Row'];
export type Asistencia = Database['public']['Tables']['asistencias']['Row'];

export type AlumnoInsert = TablesInsert<'alumnos'>;
export type CuotaInsert = TablesInsert<'cuotas'>;
export type AsistenciaInsert = TablesInsert<'asistencias'>;

