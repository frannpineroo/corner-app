# Corner App

Corner App es una aplicación web para la gestión de una escuela de deportes. Está pensada para facilitar la organización de actividades, el seguimiento de alumnos y la administración de asistencias y pagos, con una interfaz simple que también funciona bien desde el celular.

---

## 🚀 Funcionalidades

### 👤 Administrador
- Crear y gestionar actividades deportivas (fútbol, básquet, vóley, etc.)
- Cargar alumnos con:
  - Nombre
  - Teléfono de padres
  - Fecha de nacimiento
  - Ficha médica
- Ver historial de asistencias por alumno
- Controlar el pago de cuotas mensuales por actividad

### 🧑‍🏫 Profesor
- Login desde la app
- Ver sus actividades asignadas
- Marcar asistencia de alumnos directamente desde el celular el día de la clase

---

## 🛠️ Stack tecnológico

- **Frontend:** React + TypeScript  
- **Estilos:** Tailwind CSS  
- **Backend y base de datos:** Supabase  
- **Deploy:** Netlify  

---

## 📁 Estructura del proyecto

El proyecto está organizado de forma modular:
src/
│
├── components/ # Componentes reutilizables de UI
├── hooks/ # Custom hooks
├── lib/ # Configuraciones y utilidades (ej: cliente de Supabase)
├── pages/ # Vistas principales
├── services/ # Lógica de acceso a datos / API
├── types/ # Tipos de TypeScript


---

## ⚙️ Cómo correr el proyecto localmente

1. Clonar el repositorio:
```bash
git clone <repo-url>
cd corner-app

2. Instalar dependencias:
npm install

3. Crear un archivo .env en la raíz del proyecto con las siguientes variables:
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key

4. Levantar el proyecto:
npm run dev

📌 Notas

Este proyecto fue desarrollado en aproximadamente 2 semanas como práctica de desarrollo fullstack, con foco en resolver problemas reales de autenticación, manejo de estado y permisos en base de datos.