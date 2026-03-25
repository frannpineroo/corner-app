import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AlumnosPage from './pages/AlumnosPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AlumnosPage />
  </StrictMode>,
)
