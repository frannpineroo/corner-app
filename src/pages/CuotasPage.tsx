import { useEffect, useState } from "react"
import { getAlumnos } from "../services/alumnos"
import { getCuotasPorActividad, toggleCuota } from "../services/cuotas"
import { useAuth } from "../hooks/useAuth"
import type { Alumno } from "../types/models"
import type { Tables } from "../types/supabase"
import { ChevronLeft } from "lucide-react"
import { IconButton } from "../components/Screen"

type Cuota = Tables<"cuotas">
type Actividad = Tables<"actividades">

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

interface Props {
    actividad: Actividad
    onVolver: () => void
}

export default function CuotasPage({ actividad, onVolver }: Props) {
    const { user } = useAuth()
    const [alumnos, setAlumnos] = useState<Alumno[]>([])
    const [cuotas, setCuotas] = useState<Cuota[]>([])
    const [loading, setLoading] = useState(true)
    const anio = new Date().getFullYear()

    const fetchData = async () => {
        const [alumnosData, cuotasData] = await Promise.all([
            getAlumnos(actividad.id),
            getCuotasPorActividad(actividad.id)
        ])
        setAlumnos(alumnosData)
        setCuotas(cuotasData)
        setLoading(false)
    }

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            const [alumnosData, cuotasData] = await Promise.all([
                getAlumnos(actividad.id),
                getCuotasPorActividad(actividad.id)
            ])
            if (cancelled) return
            setAlumnos(alumnosData)
            setCuotas(cuotasData)
            setLoading(false)
        }
        void load()
        return () => { cancelled = true }
    }, [actividad.id])

    const tieneCuota = (alumno_id: string, mes: string) => {
        return cuotas.some(c => c.alumno_id === alumno_id && c.mes === mes)
    }

    const handleToggle = async (alumno_id: string, mes: string) => {
        if (!user) return
        await toggleCuota(alumno_id, mes, 0, user.id)
        await fetchData()
    }

    return (
        <div className="min-h-dvh bg-ink px-5 py-6 text-crema">
            <div className="mx-auto w-full max-w-4xl">
                <div className="mb-6 flex items-center gap-3">
                    <IconButton label="Volver" onClick={onVolver}>
                        <ChevronLeft size={20} />
                    </IconButton>
                    <div>
                        <h1 className="font-display text-4xl leading-none tracking-wide">{actividad.nombre}</h1>
                        <p className="mt-1 text-sm text-muted">Cuotas {anio}</p>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-muted">Cargando...</p>
                ) : (
                    <div className="overflow-x-auto rounded-card bg-cancha p-2">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="p-2 text-left font-medium text-muted">Alumno</th>
                                    {MESES.map(mes => (
                                        <th key={mes} className="p-2 text-center font-medium text-muted">{mes.slice(0, 3)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {alumnos.map(alumno => (
                                    <tr key={alumno.id} className="border-t border-cancha-2">
                                        <td className="p-2 font-medium text-crema">{alumno.nombre}</td>
                                        {MESES.map(mes => {
                                            const mesKey = `${anio}-${String(MESES.indexOf(mes) + 1).padStart(2, "0")}`
                                            const pagado = tieneCuota(alumno.id, mesKey)
                                            return (
                                                <td key={mes} className="p-2 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggle(alumno.id, mesKey)}
                                                        className={`size-7 rounded-full transition-colors ${pagado ? "bg-lima hover:brightness-110" : "bg-cancha-2 hover:bg-muted"}`}
                                                    />
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
