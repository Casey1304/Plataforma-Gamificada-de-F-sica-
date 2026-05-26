import { Route } from 'react-router-dom';
import { RoleRoute } from '@/app/Core/Guards/ruta-por-rol.jsx';
import { AdminDashboardPage } from './pages/pagina-panel-admin/pagina-panel-admin.jsx';

export const adminRoute = (
  <Route element={<RoleRoute allowedRoles={['administrador']} />}>
    <Route element={<AdminDashboardPage />} path="admin" />
  </Route>
);
