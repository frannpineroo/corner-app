import { useEffect, useState } from "react";
import { getAlumnos, borrarAlumno, editarAlumno } from "../services/alumnos";
import type { Alumno } from "../types/models";
import AlumnoForm from "../components/AlumnoForm";
import { Pencil, Trash2, Check, X, ChevronLeft } from "lucide-react";
import type { Tables } from "../types/supabase";

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

                {loading ? (
                    <p className="text-gray-500 text-center">Cargando...</p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {alumnos.map((alumno) => (
                            <li key={alumno.id} className="bg-gray-800 rounded-xl shadow p-4">
                                {editandoId === alumno.id ? (
                                    <div className="flex flex-wrap gap-3 items-end">
                                        <input
                                            value={editForm.nombre ?? ""}
                                            onChange={e => setEditForm({ ...editForm, nombre: e.target.value })}
                                            placeholder="Nombre"
                                            className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                                        />
                                        <input
                                            value={editForm.nro_padres ?? ""}
                                            onChange={e => setEditForm({ ...editForm, nro_padres: e.target.value })}
                                            placeholder="Teléfono padres"
                                            className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                                        />
                                        <input
                                            type="date"
                                            value={editForm.fecha_nacimiento ?? ""}
                                            onChange={e => setEditForm({ ...editForm, fecha_nacimiento: e.target.value })}
                                            className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                        <label className="flex items-center gap-2 text-sm text-gray-300">
                                            <input
                                                type="checkbox"
                                                checked={editForm.ficha_medica ?? false}
                                                onChange={e => setEditForm({ ...editForm, ficha_medica: e.target.checked })}
                                                className="w-4 h-4 accent-blue-500"
                                            />
                                            Ficha médica
                                        </label>
                                        <button onClick={handleGuardar} className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                            <Check size={16} />
                                        </button>
                                        <button onClick={() => setEditandoId(null)} className="bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1 text-sm">
                                            <span className="text-base font-bold text-white">{alumno.nombre}</span>
                                            <span className="text-gray-300">📞 {alumno.nro_padres}</span>
                                            <span className="text-gray-300">🎂 {alumno.fecha_nacimiento}</span>
                                            <span className="text-gray-300">🏥 Ficha médica: {alumno.ficha_medica ? "Sí" : "No"}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditarClick(alumno)}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleBorrar(alumno.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AlumnosPage;