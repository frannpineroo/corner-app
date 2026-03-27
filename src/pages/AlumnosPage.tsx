import { useEffect, useState } from "react";
import { getAlumnos, borrarAlumno, editarAlumno } from "../services/alumnos";
import type { Alumno } from "../types/models";
import AlumnoForm from "../components/AlumnoForm";
import { logout } from "../services/auth";

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
        <div style={{ padding: "20px" }}>
            <h1>Alumnos</h1>
            <button onClick={logout}>Cerrar sesion</button>

            <AlumnoForm onCreated={fetchAlumnos} />

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <ul style={{ margin: "20px" }}>
                    {alumnos.map((alumno) => (
                        <li key={alumno.id}>
                            {editandoId === alumno.id ? (
                                <div style={{ margin: "20px" }}>
                                    <input
                                        value={editForm.nombre ?? ""}
                                        onChange={e => setEditForm({ ...editForm, nombre: e.target.value })}
                                        placeholder="Nombre"
                                    />
                                    <input
                                        value={editForm.nro_padres ?? ""}
                                        onChange={e => setEditForm({ ...editForm, nro_padres: e.target.value })}
                                        placeholder="Teléfono padres"
                                    />
                                    <input
                                        type="date"
                                        value={editForm.fecha_nacimiento ?? ""}
                                        onChange={e => setEditForm({ ...editForm, fecha_nacimiento: e.target.value })}
                                    />
                                    <label>
                                        Ficha médica
                                        <input
                                            type="checkbox"
                                            checked={editForm.ficha_medica ?? false}
                                            onChange={e => setEditForm({ ...editForm, ficha_medica: e.target.checked })}
                                        />
                                    </label>
                                    <button onClick={handleGuardar}>Guardar</button>
                                    <button onClick={() => setEditandoId(null)}>Cancelar</button>
                                </div>
                            ) : (
                                <div style={{ margin: "20px" }}>
                                    <div>Nombre: {alumno.nombre}</div>
                                    <div>Teléfono: {alumno.nro_padres}</div>
                                    <div>Fecha Nacimiento: {alumno.fecha_nacimiento}</div>
                                    <div>Ficha médica: {alumno.ficha_medica ? "Si" : "No"}</div>
                                    <button onClick={() => handleEditarClick(alumno)}>Editar</button>
                                    <button onClick={() => handleBorrar(alumno.id)}>Borrar</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AlumnosPage;