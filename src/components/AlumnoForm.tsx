import { useState } from "react";
import { crearAlumno } from "../services/alumnos";
import { Plus } from "lucide-react";

interface Props {
    onCreated: () => void;
    actividadId: string;
}

const AlumnoForm = ({ onCreated, actividadId }: Props) => {
    const [nombre, setNombre] = useState("");
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = nombre.trim();
        if (!trimmed || enviando) return;
        setEnviando(true);
        const ok = await crearAlumno({ nombre: trimmed, actividad_id: actividadId });
        if (ok) {
            onCreated();
            setNombre("");
        }
        setEnviando(false);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
            <input
                name="nombre"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="min-w-0 flex-1 rounded-card bg-cancha px-4 py-3 text-sm text-crema placeholder-muted outline-none focus:ring-2 focus:ring-naranja"
            />
            <button
                type="submit"
                disabled={enviando || !nombre.trim()}
                aria-label="Agregar alumno"
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-card bg-naranja text-ink disabled:opacity-40"
            >
                <Plus size={20} />
            </button>
        </form>
    );
};

export default AlumnoForm;
