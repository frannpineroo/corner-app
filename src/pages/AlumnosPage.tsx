import { useEffect, useState } from "react";
import { getAlumnos } from "../services/alumnos";
import type { Alumno } from "../types/models";
import AlumnoForm from "../components/AlumnoForm";
import { logout } from "../services/auth";

const AlumnosPage = () => {
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAlumnos = async () => {
        setLoading(true);
        const data = await getAlumnos();
        console.log(data)
        setAlumnos(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAlumnos();
    }, []);

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
                            <div style={{ margin: "20px" }}>Nombre: {alumno.nombre}</div>
                            <div style={{ margin: "20px" }}>Telefono: {alumno.nro_padres}</div>
                            <div style={{ margin: "20px" }}>Fecha nacimiento: {alumno.fecha_nacimiento}</div>
                            <div style={{ margin: "20px" }}>Ficha médica: {alumno.ficha_medica ? "Sí" : "No"}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AlumnosPage;