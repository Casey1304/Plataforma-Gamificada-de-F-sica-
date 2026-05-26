import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/app/Core/Guards/ruta-protegida.jsx';
import { ROUTES } from '@/app/Core/Models/rutas.js';
import { authRoutes, AUTH_BASE } from '@/app/Modules/Auth/auth.routes.jsx';
import { adminRoute } from '@/app/Modules/Admin/admin.routes.jsx';
import { teacherRoute } from '@/app/Modules/Profesor/profesor.routes.jsx';
import {
  studentAppRoutes,
  studentOnboardingRoutes
} from '@/app/Modules/Estudiante/estudiante.routes.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Navigate replace to={ROUTES.AUTH_LOGIN} />} path="/" />
      <Route path={AUTH_BASE}>{authRoutes}</Route>

      <Route element={<ProtectedRoute />} path={ROUTES.APP}>
        {studentOnboardingRoutes}
        {studentAppRoutes}
        {teacherRoute}
        {adminRoute}
      </Route>

      <Route element={<Navigate replace to={ROUTES.AUTH_LOGIN} />} path="*" />
    </Routes>
  );
}
