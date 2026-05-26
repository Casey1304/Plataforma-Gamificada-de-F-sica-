import { BrandLogo } from '../componentes/Iconos.jsx';
import '../estilos/carga.css';

export default function CargaSesion() {
  return (
    <main className="session-boot">
      <BrandLogo size={56} />
      <p>Restaurando tu sesión...</p>
    </main>
  );
}
