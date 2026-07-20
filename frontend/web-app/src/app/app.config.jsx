import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@/app/Core/Context/proveedor-app.jsx';

export function AppConfig({ children }) {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AppProvider>{children}</AppProvider>
    </BrowserRouter>
  );
}
