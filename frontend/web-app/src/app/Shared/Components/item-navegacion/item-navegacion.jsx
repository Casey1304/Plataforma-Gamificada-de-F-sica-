import { NavLink } from 'react-router-dom';
import { NavIcon } from '@/app/Shared/Components/iconos/iconos.jsx';

/**
 * Item reutilizable del menu lateral.
 * NavLink agrega la clase "active" cuando el usuario esta en esa ruta.
 */
export function NavItem({ label, path, icon, description }) {
  const accessibility = description || label;

  return (
    <NavLink
      aria-label={accessibility}
      className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
      title={accessibility}
      to={path}
    >
      <NavIcon name={icon} />
      <span className="nav-label">{label}</span>
    </NavLink>
  );
}
