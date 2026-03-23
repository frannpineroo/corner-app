export type Rol = 'admin' | 'profesor'

export interface Profile {
    id: string,
    nombre: string,
    rol: Rol
}

export interface Actividad {
    id: string,
    nombre: string
}

export interface Alumno {
    id: string,
    nombre: string,
    nro_padres: string,
    ficha_medica: boolean,
    fecha_nacimiento: string,
    actividad_id: string,
    created_at: string
}

export interface Asistencia {
    id: string,
    alumno_id: string,
    fecha: string,
    presente: boolean,
    created_by: string
}

export interface Cuota {
    id: string,
    alumno_id: string,
    monto: number,
    mes: string,
    fecha_pago: string,
    created_by: string
}