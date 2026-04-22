import { useEffect, useState } from "react";
import { getTodasAsistenciasConAlumnos } from "../services/asistencias";
import { X } from "lucide-react";

interface Fila {
    alumno_id: string;
    alumno_nombre: string;
    fecha: string;
    presente: boolean;
}

interface Props {
    actividadId: string;
    onCerrar: () => void;
}

export default function AsistenciaModal({ actividadId, onCerrar }: Props) {
    const [filas, setFilas] = useState<Fila[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const data = await getTodasAsistenciasConAlumnos(actividadId);
            setFilas(data);
            setLoading(false);
        };
        fetch();
    }, [actividadId]);

    // Fechas únicas ordenadas ascendente (columnas)
    const fechas = [...new Set(filas.map((f) => f.fecha))].sort();

    // Alumnos únicos ordenados alfabéticamente (filas)
    const alumnos = [...new Map(filas.map((f) => [f.alumno_id, f.alumno_nombre])).entries()]
        .sort((a, b) => a[1].localeCompare(b[1]));

    // Lookup rápido: "alumno_id|fecha" -> presente
    const lookup = new Map(filas.map((f) => [`${f.alumno_id}|${f.fecha}`, f.presente]));

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-6xl max-h-[85vh] flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-700 shrink-0">
                    <div>
                        <h2 className="text-white font-bold text-lg">Asistencias</h2>
                        <p className="text-gray-400 text-sm">
                            {alumnos.length} alumnos · {fechas.length} clases
                        </p>
                    </div>
                    <button
                        onClick={onCerrar}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabla */}
                <div className="overflow-auto flex-1 p-4">
                    {loading ? (
                        <p className="text-gray-400 text-center mt-8">Cargando...</p>
                    ) : filas.length === 0 ? (
                        <p className="text-gray-400 text-center mt-8">Sin asistencias registradas</p>
                    ) : (
                        <table className="text-sm w-full border-collapse">
                            <thead>
                                <tr>
                                    {/* Columna nombre */}
                                    <th className="sticky left-0 z-10 bg-gray-800 text-left text-gray-300 font-semibold px-3 py-2 border-b border-gray-700 whitespace-nowrap min-w-[160px]">
                                        Alumno
                                    </th>
                                    {/* Columnas de fechas */}
                                    {fechas.map((fecha) => (
                                        <th
                                            key={fecha}
                                            className="text-gray-300 font-semibold px-3 py-2 border-b border-gray-700 whitespace-nowrap text-center"
                                        >
                                            {/* Muestra "DD/MM" para que no ocupe tanto */}
                                            {fecha.slice(8, 10)}/{fecha.slice(5, 7)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {alumnos.map(([id, nombre], i) => (
                                    <tr
                                        key={id}
                                        className={i % 2 === 0 ? "bg-gray-800" : "bg-gray-750"}
                                    >
                                        {/* Nombre fijo a la izquierda al hacer scroll horizontal */}
                                        <td className="sticky left-0 z-10 bg-inherit text-gray-200 px-3 py-2 whitespace-nowrap border-b border-gray-700/50">
                                            {nombre}
                                        </td>
                                        {fechas.map((fecha) => {
                                            const key = `${id}|${fecha}`;
                                            const tiene = lookup.has(key);
                                            const presente = lookup.get(key);
                                            return (
                                                <td
                                                    key={fecha}
                                                    className="text-center px-3 py-2 border-b border-gray-700/50"
                                                >
                                                    {!tiene ? (
                                                        <span className="text-gray-600">—</span>
                                                    ) : presente ? (
                                                        <span className="text-green-400 font-semibold">✓</span>
                                                    ) : (
                                                        <span className="text-red-400 font-semibold">✗</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}