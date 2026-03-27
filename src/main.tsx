import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { useAuth } from './hooks/useAuth';
// import AlumnosPage from './pages/AlumnosPage';
import Login from './pages/Login';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>
  if (!user) return <Login />

  return <p>Bienvenido, estas logueado</p>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
