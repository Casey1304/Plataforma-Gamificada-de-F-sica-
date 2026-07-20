import { TipIcon } from '@/app/Shared/Components/iconos/iconos.jsx';

export function TipsBar({ message }) {
  return (
    <footer
      aria-atomic="true"
      aria-live={message ? 'polite' : undefined}
      className="tips-bar"
      role={message ? 'status' : undefined}
    >
      <TipIcon />
      <p>{message || 'Practica constantemente para mejorar tu comprensión de física.'}</p>
    </footer>
  );
}
