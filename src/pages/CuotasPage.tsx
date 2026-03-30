import { useEffect, useState } from "react"
import { getAlumnos } from "../services/alumnos"
import { getCuotasPorActividad, toggleCuota } from "../services/cuotas"
import { useAuth } from "../hooks/useAuth"
import type { Alumno } from "../types/models"
import type { Tables } from "../types/supabase"
import { ChevronLeft } from "lucide-react"

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
        setLoading(true)
        const [alumnosData, cuotasData] = await Promise.all([
            getAlumnos(actividad.id),
            getCuotasPorActividad(actividad.id)
        ])
        setAlumnos(alumnosData)
        setCuotas(cuotasData)
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [actividad.id])

    const tieneCuota = (alumno_id: string, mes: string) => {
        return cuotas.some(c => c.alumno_id === alumno_id && c.mes === mes)
    }

    const handleToggle = async (alumno_id: string, mes: string) => {
        if (!user) return
        await toggleCuota(alumno_id, mes, 0, user.id)
        await fetchData()
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={onVolver}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{actividad.nombre}</h1>
                        <p className="text-gray-400 text-sm">Cuotas {anio}</p>
                    </div>
                </div>

                {loading ? (
                    <p className="text-gray-400 text-center">Cargando...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="text-left text-gray-400 font-medium p-2">Alumno</th>
                                    {MESES.map(mes => (
                                        <th key={mes} className="text-gray-400 font-medium p-2 text-center">{mes.slice(0, 3)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {alumnos.map(alumno => (
                                    <tr key={alumno.id} className="border-t border-gray-700">
                                        <td className="text-white p-2 font-medium">{alumno.nombre}</td>
                                        {MESES.map(mes => {
                                            const mesKey = `${anio}-${String(MESES.indexOf(mes) + 1).padStart(2, "0")}`
                                            const pagado = tieneCuota(alumno.id, mesKey)
                                            return (
                                                <td key={mes} className="p-2 text-center">
                                                    <button
                                                        onClick={() => handleToggle(alumno.id, mesKey)}
                                                        className={`w-7 h-7 rounded-full transition-colors ${pagado ? "bg-green-500 hover:bg-green-600" : "bg-gray-600 hover:bg-gray-500"}`}
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