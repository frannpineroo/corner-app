import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import ProfesorPanel from "./pages/ProfesorPanel";

export default function App() {
    const { user, loading, isAdmin } = useAuth();

    if (loading) return <p>Cargando...</p>
    if (!user) return <Login />
    if (isAdmin) return <AdminPanel />

    return <ProfesorPanel />
}