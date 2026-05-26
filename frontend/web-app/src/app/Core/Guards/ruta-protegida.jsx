import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingSession } from '@/app/Shared/Components/cargando-sesion/cargando-sesion.jsx';
import { ROUTES } from '@/app/Core/Models/rutas.js';
import { useApp } from '@/app/Core/Context/usar-app.js';

/**
 * Guard: requiere usuario autenticado.
 */
export function ProtectedRoute() {
  const { user, restoringSession } = useApp();
  const location = useLocation();

  if (restoringSession) {
    return <LoadingSession />;
  }

  if (!user?.userId) {
    return <Navigate replace state={{ from: location.pathname }} to={ROUTES.AUTH_LOGIN} />;
  }

  return <Outlet />;
}
