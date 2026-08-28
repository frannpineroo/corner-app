import { useAuth } from "./hooks/useAuth";
import { logout } from "./services/auth";
import { AuthLoading } from "./components/Screen";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import ProfesorPanel from "./pages/ProfesorPanel";

export default function App() {
    const { user, profile, loading, isAdmin } = useAuth();

    if (loading) {
        return <AuthLoading label={user ? "Entrando..." : "Cargando..."} />;
    }
    if (!user) return <Login />;
    if (!profile) {
        return (
            <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-ink px-6 text-center font-sans">
                <p className="text-crema">Entraste, pero no se encontró tu perfil.</p>
                <p className="text-sm text-muted">Fijate la tabla profiles en Supabase o volvé a intentar.</p>
                <button
                    type="button"
                    onClick={() => void logout()}
                    className="rounded-card bg-naranja px-4 py-2 text-sm font-semibold text-ink"
                >
                    Volver al login
                </button>
            </div>
        );
    }
    if (isAdmin) return <AdminPanel />;
    return <ProfesorPanel />;
}
