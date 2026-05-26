import { TipIcon } from '@/app/Shared/Components/iconos/iconos.jsx';

export function TipsBar({ message }) {
  return (
    <footer className="tips-bar">
      <TipIcon />
      <p>{message || 'Practica constantemente para mejorar tu comprensión de física.'}</p>
    </footer>
  );
}
