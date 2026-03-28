import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
    const { user, loading } = useAuth();

    if (loading) return <p>Cargando...</p>
    if (!user) return <Login />

    return <AdminPanel />
}