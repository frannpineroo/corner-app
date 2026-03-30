import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import ProfesorPanel from "./pages/ProfesorPanel";

export default function App() {
    const { user, profile, loading, isAdmin } = useAuth();

    if (loading) return <p className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Cargando...</p>
    if (!user) return <Login />
    if (!profile) return <p className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Cargando...</p>
    if (isAdmin) return <AdminPanel />
    return <ProfesorPanel />
}