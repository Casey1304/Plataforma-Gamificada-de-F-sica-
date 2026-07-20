import { BrandLogo } from '@/app/Shared/Components/iconos/iconos.jsx';
import './cargando-sesion.css';

export function LoadingSession() {
  return (
    <main aria-busy="true" aria-live="polite" className="session-boot" id="main-content">
      <BrandLogo size={56} />
      <h1 className="sr-only">Cargando PhysicsPlay</h1>
      <p>Restaurando tu sesión...</p>
    </main>
  );
}
