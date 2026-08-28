import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { login, LoginError } from "../services/auth";
import { isSupabaseConfigured } from "../lib/supabase";
import { Screen } from "../components/Screen";

export default function Login() {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const handleLogin = async () => {
        if (!usuario || !password) return;
        if (!isSupabaseConfigured) {
            setError("Falta el archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY");
            return;
        }
        setCargando(true);
        setError("");
        try {
            await login(usuario, password);
        } catch (e) {
            if (e instanceof LoginError) setError(e.message);
            else setError("No hay conexión con el servidor");
            setCargando(false);
        }
    };

    return (
        <Screen>
            <div className="flex min-h-[80dvh] flex-col justify-center">
                <div className="rounded-card bg-cancha p-8">
                    <p className="text-center font-display text-6xl leading-none tracking-wide text-naranja">
                        CORNER
                    </p>
                    <p className="mt-2 text-center text-sm text-muted">Iniciá sesión para continuar</p>

                    {!isSupabaseConfigured && (
                        <p className="mt-4 rounded-card bg-coral/15 px-3 py-2 text-center text-sm text-coral">
                            El backend no está configurado. Creá un archivo .env en la raíz del proyecto.
                        </p>
                    )}

                    <div className="mt-8 flex flex-col gap-3">
                        <input
                            type="text"
                            name="username"
                            autoComplete="username"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            inputMode="text"
                            placeholder="Usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className="rounded-card bg-cancha-2 px-4 py-3 text-sm text-crema placeholder-muted outline-none focus:ring-2 focus:ring-naranja"
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleLogin();
                            }}
                            className="rounded-card bg-cancha-2 px-4 py-3 text-sm text-crema placeholder-muted outline-none focus:ring-2 focus:ring-naranja"
                        />
                    </div>

                    {error && (
                        <p className="mt-3 text-center text-sm text-coral">{error}</p>
                    )}

                    <button
                        type="button"
                        onClick={handleLogin}
                        disabled={cargando}
                        className="mt-5 w-full rounded-card bg-naranja py-3 font-semibold text-ink disabled:opacity-50"
                    >
                        {cargando ? (
                            <span className="inline-flex items-center gap-2">
                                <LoaderCircle className="size-4 animate-spin" aria-hidden />
                                Entrando...
                            </span>
                        ) : (
                            "Entrar"
                        )}
                    </button>
                </div>
            </div>
        </Screen>
    );
}
