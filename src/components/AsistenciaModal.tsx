import { useEffect, useState } from "react";
import { getAsistenciaPorAlumno } from "../services/asistencias";
import type { Alumno } from "../types/models";
import type { Tables } from "../types/supabase";
import { X } from "lucide-react";

type Asistencia = Tables<"asistencias">;

interface Props {
    alumno: Alumno;
    onCerrar: () => void;
}

export default function AsistenciaModal({ alumno, onCerrar }: Props) {
    const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const data = await getAsistenciaPorAlumno(alumno.id);
            setAsistencias(data);
            setLoading(false);
        }
        fetch()
    }, [alumno.id])

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">

                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <div>
                        <h2 className="text-white font-bold text-lg">{alumno.nombre}</h2>
                        <p className="text-gray-400 text-sm">Historial de Asistencias</p>
                    </div>
                    <button
                        onClick={onCerrar}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="overflow-y-auto p-4 flex flex-col gap-2">
                    {loading ? (
                        <p className="text-gray-400 text-center">Cargando...</p>
                    ) : asistencias.length === 0 ? (
                        <p className="text-gray-400 text-center">Sin asistencias registradas</p>
                    ) : (
                        asistencias.map((a) => (
                            <div
                                key={a.id}
                                className={`flex justify-between items-center px-4 py-2 rounded-lg text-sm ${a.presente ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"}`}
                            >
                                <span>{a.fecha}</span>
                                <span className="font-semibold">{a.presente ? "Presente" : "Ausente"}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}