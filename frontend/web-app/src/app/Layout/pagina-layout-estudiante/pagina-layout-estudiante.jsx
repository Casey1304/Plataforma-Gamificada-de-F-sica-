import { Outlet } from 'react-router-dom';
import { useApp } from '@/app/Core/Context/usar-app.js';
import { Navbar } from '@/app/Layout/Components/barra-navegacion/barra-navegacion.jsx';
import { Sidebar } from '@/app/Layout/Components/barra-lateral/barra-lateral.jsx';
import { TipsBar } from '@/app/Layout/Components/barra-consejos/barra-consejos.jsx';
import './pagina-layout-estudiante.css';

/**
 * Layout del panel de estudiante: navbar + sidebar + contenido + tips.
 */
export function StudentLayout() {
  const { user, logout, systemMessage } = useApp();

  return (
    <main className="physics-shell">
      <Navbar user={user} />
      <div className="workspace-grid">
        <Sidebar onLogout={logout} />
        <div className="workspace-outlet">
          <Outlet />
        </div>
      </div>
      <TipsBar message={systemMessage} />
    </main>
  );
}