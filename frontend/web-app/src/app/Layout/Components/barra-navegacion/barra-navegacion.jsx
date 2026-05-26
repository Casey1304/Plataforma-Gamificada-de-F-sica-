import { BrandLogo, UserAvatar } from '@/app/Shared/Components/iconos/iconos.jsx';
import { formatNumber } from '@/app/Core/Utils/formato.util.js';

export function Navbar({ user }) {
  return (
    <header className="app-topbar">
      <div className="brand-cluster">
        <BrandLogo className="brand-mark" size={44} />
        <strong>PhysicsPlay</strong>
      </div>
      <div className="player-stats">
        <span className="level-chip">Nivel {user.level}</span>
        <span className="level-progress">
          <span style={{ width: `${user.levelProgress}%` }} />
        </span>
        <span className="stat-pill xp-pill">{formatNumber(user.xp)} XP</span>
        <span className="stat-pill gem-pill">{formatNumber(user.gems)} Gemas</span>
        <UserAvatar className="profile-badge" size={40} />
        <strong className="user-name">{user.name}</strong>
      </div>
    </header>
  );
}
