import { BrandLogo } from '@/app/Shared/Components/iconos/iconos.jsx';
import './cargando-sesion.css';

export function LoadingSession() {
  return (
    <main className="session-boot">
      <BrandLogo size={56} />
      <p>Restaurando tu sesión...</p>
    </main>
  );
}
