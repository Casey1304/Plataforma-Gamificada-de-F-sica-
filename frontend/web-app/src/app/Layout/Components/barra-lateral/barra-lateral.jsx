import { LOGOUT_NAV_ACTION, STUDENT_NAV_LINKS } from '@/app/Core/Models/navegacion.js';
import { NavIcon } from '@/app/Shared/Components/iconos/iconos.jsx';
import { NavItem } from '@/app/Shared/Components/item-navegacion/item-navegacion.jsx';

/**
 * Barra lateral izquierda.
 *
 * Para cambiar los botones visibles, edita Core/Models/navegacion.js.
 * Este componente solo dibuja esa lista y marca la ruta activa.
 */
export function Sidebar({ onLogout }) {
  return (
    <aside className="left-nav">
      {STUDENT_NAV_LINKS.map((link) => (
        <NavItem
          description={link.description}
          icon={link.icon}
          key={link.id}
          label={link.label}
          path={link.path}
        />
      ))}

      <button
        className="nav-item logout"
        onClick={onLogout}
        title={LOGOUT_NAV_ACTION.description}
        type="button"
      >
        <NavIcon name={LOGOUT_NAV_ACTION.icon} />
        <span className="nav-label">{LOGOUT_NAV_ACTION.label}</span>
      </button>
    </aside>
  );
}
