import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@/app/Core/Context/proveedor-app.jsx';

export function AppConfig({ children }) {
  return (
    <BrowserRouter>
      <AppProvider>{children}</AppProvider>
    </BrowserRouter>
  );
}
