import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import AlumnosPage from './pages/AlumnosPage';
import Login from './pages/Login';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Login />
  </StrictMode>,
)
