import { useState } from "react";
import { login } from "../services/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) return;
        setCargando(true);
        setError("");
        try {
            await login(email, password);
        } catch {
            setError("Email o contraseña incorrectos");
        } finally {
            setCargando(false);
        }
    }

    return (
        <div>
            <h1>Corner App</h1>
            <h2>Iniciar Sesión</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                type="passowrd"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleLogin} disabled={cargando}>
                {cargando ? "Entrando..." : "Entrar"}
            </button>
        </div>
    )
}