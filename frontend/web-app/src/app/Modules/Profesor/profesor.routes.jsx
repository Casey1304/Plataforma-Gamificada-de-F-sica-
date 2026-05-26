import { Route } from 'react-router-dom';
import { RoleRoute } from '@/app/Core/Guards/ruta-por-rol.jsx';
import { TeacherDashboardPage } from './pages/pagina-panel-profesor/pagina-panel-profesor.jsx';

export const teacherRoute = (
  <Route element={<RoleRoute allowedRoles={['profesor']} />}>
    <Route element={<TeacherDashboardPage />} path="profesor" />
  </Route>
);
