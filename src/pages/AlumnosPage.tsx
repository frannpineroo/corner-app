import { useEffect, useState } from "react";
import { getAlumnos, borrarAlumno, editarAlumno } from "../services/alumnos";
import type { Alumno } from "../types/models";
import type { Tables } from "../types/supabase";
import AlumnoForm from "../components/AlumnoForm";
import AsistenciaModal from "../components/AsistenciaModal";
import { Pencil, Trash2, Check, X, ChevronLeft, ClipboardList } from "lucide-react";
import { Search } from "lucide-react";

type Actividad = Tables<"actividades">

interface Props {
    actividad: Actividad
    onVolver: () => void
}

const AlumnosPage = ({ actividad, onVolver }: Props) => {
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [loading, setLoading] = useState(true);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Alumno>>({});
    const [busqueda, setBusqueda] = useState("");
    const [modalAsistencia, setModalAsistencia] = useState(false);

    const fetchAlumnos = async () => {
        setLoading(true);
        const data = await getAlumnos(actividad.id);
        setAlumnos(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAlumnos();
    }, [actividad.id]);

    const handleBorrar = async (id: string) => {
        if (!window.confirm("¿Seguro que querés borrar este alumno?")) return;
        await borrarAlumno(id);
        fetchAlumnos();
    }

    const handleEditarClick = (alumno: Alumno) => {
        setEditandoId(alumno.id);
        setEditForm({
            nombre: alumno.nombre,
            nro_padres: alumno.nro_padres,
            fecha_nacimiento: alumno.fecha_nacimiento,
            ficha_medica: alumno.ficha_medica,
        })
    }

    const handleGuardar = async () => {
        if (!editandoId) return;
        await editarAlumno(editandoId, editForm);
        setEditandoId(null);
        fetchAlumnos();
    }

    const alumnosFiltrados = alumnos.filter((alumno) =>
        alumno.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-3xl mx-auto">

                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onVolver}
                            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h1 className="text-3xl font-bold text-white">{actividad.nombre}</h1>
                    </div>
                </div>

                <AlumnoForm onCreated={fetchAlumnos} actividadId={actividad.id} />

                <div className="flex items-center gap-2 mb-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />

                        <input
                            type="text"
                            placeholder="Buscar alumno..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full bg-gray-800 text-white pl-10 pr-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={() => setModalAsistencia(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <ClipboardList size={18} />
                            <span className="text-sm font-medium">Asistencias</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p className="text-gray-500 text-center">Cargando...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-300">

                            <thead className="text-xs uppercase bg-gray-800 text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Tel. Padres</th>
                                    <th className="px-4 py-3">Nacimiento</th>
                                    <th className="px-4 py-3">Ficha médica</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {alumnosFiltrados.map((alumno) => (
                                    <tr key={alumno.id} className="border-b border-gray-700 hover:bg-gray-800">

                                        {editandoId === alumno.id ? (
                                            <>
                                                <td className="px-4 py-2">
                                                    <input
                                                        value={editForm.nombre ?? ""}
                                                        onChange={e => setEditForm({ ...editForm, nombre: e.target.value })}
                                                        className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                                                    />
                                                </td>

                                                <td className="px-4 py-2">
                                                    <input
                                                        value={editForm.nro_padres ?? ""}
                                                        onChange={e => setEditForm({ ...editForm, nro_padres: e.target.value })}
                                                        className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                                                    />
                                                </td>

                                                <td className="px-4 py-2">
                                                    <input
                                                        type="date"
                                                        value={editForm.fecha_nacimiento ?? ""}
                                                        onChange={e => setEditForm({ ...editForm, fecha_nacimiento: e.target.value })}
                                                        className="bg-gray-700 text-white px-2 py-1 rounded"
                                                    />
                                                </td>

                                                <td className="px-4 py-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm.ficha_medica ?? false}
                                                        onChange={e => setEditForm({ ...editForm, ficha_medica: e.target.checked })}
                                                    />
                                                </td>

                                                <td className="px-4 py-2 flex justify-end gap-2">
                                                    <button onClick={handleGuardar} className="bg-green-500 px-2 py-1 rounded">
                                                        <Check size={16} />
                                                    </button>
                                                    <button onClick={() => setEditandoId(null)} className="bg-gray-600 px-2 py-1 rounded">
                                                        <X size={16} />
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-3 font-medium text-white">{alumno.nombre}</td>
                                                <td className="px-4 py-3">{alumno.nro_padres}</td>
                                                <td className="px-4 py-3">{alumno.fecha_nacimiento}</td>
                                                <td className="px-4 py-3">{alumno.ficha_medica ? "Sí" : "No"}</td>

                                                <td className="px-4 py-3 flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditarClick(alumno)}
                                                        className="bg-yellow-400 px-2 py-1 rounded"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleBorrar(alumno.id)}
                                                        className="bg-red-500 px-2 py-1 rounded"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {modalAsistencia && (
                <AsistenciaModal
                    actividadId={actividad.id}
                    onCerrar={() => setModalAsistencia(false)}
                />
            )}
        </div>
    );
};

export default AlumnosPage;