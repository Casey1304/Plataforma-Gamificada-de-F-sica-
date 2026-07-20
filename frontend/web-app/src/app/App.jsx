import { AppConfig } from '@/app/app.config.jsx';
import { AppRoutes } from '@/app/app.routes.jsx';
import { SkipLink } from '@/app/Shared/Components/enlace-salto/enlace-salto.jsx';
import './app.css';

export default function App() {
  return (
    <AppConfig>
      <SkipLink />
      <AppRoutes />
    </AppConfig>
  );
}
