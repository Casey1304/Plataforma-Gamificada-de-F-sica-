import { BrandLogo, NavIcon, UserAvatar } from '@/app/Shared/Components/iconos/iconos.jsx';

export function PageHeader({ user, title, subtitle, onLogout }) {
  return (
    <header className="app-topbar app-topbar-standalone">
      <div className="brand-cluster">
        <BrandLogo size={44} className="brand-mark" />
        <div>
          <span className="brand-name">PhysicsPlay</span>
          {title && <h1 className="page-title">{title}</h1>}
        </div>
      </div>
      <div className="player-stats">
        {subtitle && <span className="level-chip">{subtitle}</span>}
        <div className="player-profile">
          <UserAvatar size={40} className="profile-badge" />
          <strong className="user-name">{user.name}</strong>
        </div>
        <button
          aria-label="Cerrar sesión de PhysicsPlay"
          className="nav-item logout compact-logout"
          onClick={onLogout}
          type="button"
        >
          <NavIcon name="salir" size={18} />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
