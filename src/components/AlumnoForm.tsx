import { useState } from "react";
import { crearAlumno } from "../services/alumnos";
import type { AlumnoInsert } from "../types/models";

interface Props {
    onCreated: () => void;
}

const AlumnoForm = ({ onCreated }: Props) => {
    const [form, setForm] = useState<AlumnoInsert>({
        nombre: "",
        nro_padres: "",
        ficha_medica: false,
        fecha_nacimiento: "",
        actividad_id: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const ok = await crearAlumno(form);

        if (ok) {
            onCreated();
            setForm({
                nombre: "",
                nro_padres: "",
                ficha_medica: false,
                fecha_nacimiento: "",
                actividad_id: ""
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <input
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
            />

            <input
                name="nro_padres"
                placeholder="Teléfono padres"
                value={form.nro_padres ?? ""}
                onChange={handleChange}
            />

            <input
                type="date"
                name="fecha_nacimiento"
                value={form.fecha_nacimiento ?? ""}
                onChange={handleChange}
            />

            <label>
                Ficha médica
                <input
                    type="checkbox"
                    name="ficha_medica"
                    checked={form.ficha_medica ?? false}
                    onChange={handleChange}
                />
            </label>

            <input
                name="actividad_id"
                placeholder="Actividad ID"
                value={form.actividad_id ?? ""}
                onChange={handleChange}
            />

            <button type="submit">Crear Alumno</button>
        </form>
    );
};

export default AlumnoForm;