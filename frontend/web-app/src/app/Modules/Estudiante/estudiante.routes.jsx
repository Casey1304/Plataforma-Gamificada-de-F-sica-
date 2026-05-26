import { Navigate, Route } from 'react-router-dom';
import { RoleRoute } from '@/app/Core/Guards/ruta-por-rol.jsx';
import { StudentLayout } from '@/app/Layout/pagina-layout-estudiante/pagina-layout-estudiante.jsx';
import { DashboardPage } from './pages/pagina-inicio/pagina-inicio.jsx';
import { RetosPage } from './pages/pagina-retos/pagina-retos.jsx';
import { OnboardingPage } from './pages/pagina-onboarding/pagina-onboarding.jsx';
import { RouteSummaryPage } from './pages/pagina-resumen-ruta/pagina-resumen-ruta.jsx';
import { ProgresoPage } from './pages/pagina-progreso/pagina-progreso.jsx';
import { RankingPage } from './pages/pagina-ranking/pagina-ranking.jsx';
import { NotasPage } from './pages/pagina-notas/pagina-notas.jsx';
import { aiRoute } from '@/app/Modules/IA/ia.routes.jsx';

export const studentOnboardingRoutes = (
  <Route element={<RoleRoute allowedRoles={['estudiante']} />}>
    <Route element={<OnboardingPage />} path="onboarding" />
    <Route element={<RouteSummaryPage />} path="onboarding/resumen" />
  </Route>
);

export const studentAppRoutes = (
  <Route element={<RoleRoute allowedRoles={['estudiante']} requireOnboarding />}>
    <Route element={<StudentLayout />}>
      <Route element={<Navigate replace to="inicio" />} index />
      <Route element={<DashboardPage />} path="inicio" />
      <Route element={<RetosPage />} path="retos" />
      {aiRoute}
      <Route element={<ProgresoPage />} path="progreso" />
      <Route element={<RankingPage />} path="ranking" />
      <Route element={<NotasPage />} path="notas" />
    </Route>
  </Route>
);
