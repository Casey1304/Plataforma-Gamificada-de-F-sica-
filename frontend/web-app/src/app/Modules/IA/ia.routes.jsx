import { Route } from 'react-router-dom';
import { PanelIAPage } from './pages/pagina-panel-ia/pagina-panel-ia.jsx';

/** Tutor IA dentro del layout de estudiante */
export const aiRoute = <Route element={<PanelIAPage />} path="ia" />;
