import { BrandLogo, NavIcon, UserAvatar } from './Iconos.jsx';

export default function EncabezadoPagina({ user, title, subtitle, onLogout }) {
  return (
    <header className="app-topbar app-topbar-standalone">
      <div className="brand-cluster">
        <BrandLogo size={44} className="brand-mark" />
        <div>
          <strong>PhysicsPlay</strong>
          {title && <small className="page-kicker">{title}</small>}
        </div>
      </div>
      <div className="player-stats">
        {subtitle && <span className="level-chip">{subtitle}</span>}
        <UserAvatar size={40} className="profile-badge" />
        <strong className="user-name">{user.name}</strong>
        <button className="nav-item logout compact-logout" onClick={onLogout} type="button">
          <NavIcon name="salir" size={18} />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
