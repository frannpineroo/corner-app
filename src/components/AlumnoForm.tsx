import { useState } from "react";
import { crearAlumno } from "../services/alumnos";
import type { AlumnoInsert } from "../types/models";
import { UserPlus } from "lucide-react";

interface Props {
    onCreated: () => void;
    actividadId: string;
}

const AlumnoForm = ({ onCreated, actividadId }: Props) => {
    const [form, setForm] = useState<AlumnoInsert>({
        nombre: "",
        nro_padres: "",
        ficha_medica: false,
        fecha_nacimiento: "",
        actividad_id: actividadId
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const ok = await crearAlumno({ ...form, actividad_id: actividadId });
        if (ok) {
            onCreated();
            setForm({
                nombre: "",
                nro_padres: "",
                ficha_medica: false,
                fecha_nacimiento: "",
                actividad_id: actividadId
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl shadow p-4 mb-6 flex flex-wrap gap-3 items-end">
            <input
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            />
            <input
                name="nro_padres"
                placeholder="Teléfono padres"
                value={form.nro_padres ?? ""}
                onChange={handleChange}
                className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            />
            <input
                type="date"
                name="fecha_nacimiento"
                value={form.fecha_nacimiento ?? ""}
                onChange={handleChange}
                className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                    type="checkbox"
                    name="ficha_medica"
                    checked={form.ficha_medica ?? false}
                    onChange={handleChange}
                    className="w-4 h-4 accent-blue-500"
                />
                Ficha médica
            </label>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
                <UserPlus size={16} />
            </button>
        </form>
    );
};

export default AlumnoForm;