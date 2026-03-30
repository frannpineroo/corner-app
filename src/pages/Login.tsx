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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
            <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-8 flex flex-col gap-5">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Corner App</h1>
                    <p className="text-gray-400 text-sm mt-1">Iniciá sesión para continuar</p>
                </div>

                <div className="flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                    />
                </div>

                {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <button
                    onClick={handleLogin}
                    disabled={cargando}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 disabled:text-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                    {cargando ? "Entrando..." : "Entrar"}
                </button>
            </div>
        </div>
    )
}