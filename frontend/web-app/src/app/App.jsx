import { AppConfig } from '@/app/app.config.jsx';
import { AppRoutes } from '@/app/app.routes.jsx';
import './app.css';

export default function App() {
  return (
    <AppConfig>
      <AppRoutes />
    </AppConfig>
  );
}
