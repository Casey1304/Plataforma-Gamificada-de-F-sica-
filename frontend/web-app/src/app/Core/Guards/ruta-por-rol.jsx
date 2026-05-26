import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES, initialRouteByRole } from '@/app/Core/Models/rutas.js';
import { useApp } from '@/app/Core/Context/usar-app.js';

/**
 * Guard: requiere uno de los roles indicados y, opcionalmente, onboarding completado.
 *
 * @param {object} props
 * @param {string[]} props.allowedRoles
 * @param {boolean} [props.requireOnboarding]
 */
export function RoleRoute({ allowedRoles, requireOnboarding = false }) {
  const { user, onboardingComplete } = useApp();

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate replace to={initialRouteByRole(user.role, onboardingComplete)} />;
  }

  if (requireOnboarding && user.role === 'estudiante' && !onboardingComplete) {
    return <Navigate replace to={ROUTES.APP_ONBOARDING} />;
  }

  return <Outlet />;
}
