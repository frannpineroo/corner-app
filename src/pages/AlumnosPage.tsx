import { useEffect, useState } from "react";
import { getAlumnos, borrarAlumno, editarAlumno } from "../services/alumnos";
import type { Alumno } from "../types/models";
import AlumnoForm from "../components/AlumnoForm";
import { logout } from "../services/auth";
import { Pencil, Trash2, Check, X } from "lucide-react";

const AlumnosPage = () => {
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [loading, setLoading] = useState(true);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Alumno>>({});

    const fetchAlumnos = async () => {
        setLoading(true);
        const data = await getAlumnos();
        setAlumnos(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAlumnos();
    }, []);

    const handleBorrar = async (id: string) => {
        const confirmar = window.confirm("Seguro que quieres borrar este alumno?");
        if (!confirmar) return;
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
                    <h1 className="text-3xl font-bold text-white">Alumnos</h1>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        Cerrar sesión
                    </button>
                </div>

                <AlumnoForm onCreated={fetchAlumnos} />

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
                                            className="flex flex-col gap-1 text-sm text-gray-300"
                                        />
                                        <input
                                            value={editForm.nro_padres ?? ""}
                                            onChange={e => setEditForm({ ...editForm, nro_padres: e.target.value })}
                                            placeholder="Teléfono padres"
                                            className="flex flex-col gap-1 text-sm text-gray-300"
                                        />
                                        <input
                                            type="date"
                                            value={editForm.fecha_nacimiento ?? ""}
                                            onChange={e => setEditForm({ ...editForm, fecha_nacimiento: e.target.value })}
                                            className="flex flex-col gap-1 text-sm text-gray-300"
                                        />
                                        <label className="flex flex-col gap-1 text-sm text-gray-300">
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
                                        <button onClick={() => setEditandoId(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1 text-sm text-gray-700">
                                            <span className="text-base font-bold text-white">{alumno.nombre}</span>
                                            <span className="text-medium font-semibold text-white">📞 {alumno.nro_padres}</span>
                                            <span className="text-medium font-semibold text-white">🎂 {alumno.fecha_nacimiento}</span>
                                            <span className="text-medium font-semibold text-white">🏥 Ficha médica: {alumno.ficha_medica ? "Sí" : "No"}</span>
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