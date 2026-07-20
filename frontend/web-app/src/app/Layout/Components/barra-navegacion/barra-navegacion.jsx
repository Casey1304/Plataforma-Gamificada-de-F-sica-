import { BrandLogo, UserAvatar } from '@/app/Shared/Components/iconos/iconos.jsx';
import { formatNumber } from '@/app/Core/Utils/formato.util.js';

export function Navbar({ user }) {
  const levelProgress = Math.min(100, Math.max(0, Number(user.levelProgress) || 0));

  return (
    <header className="app-topbar">
      <div className="brand-cluster">
        <BrandLogo className="brand-mark" size={44} />
        <strong>PhysicsPlay</strong>
      </div>
      <div className="player-stats">
        <div className="player-stats-metrics">
          <span className="level-chip">Nivel {user.level}</span>
          <span
            aria-label={`Progreso del nivel: ${levelProgress}%`}
            aria-valuemax="100"
            aria-valuemin="0"
            aria-valuenow={levelProgress}
            className="level-progress"
            role="progressbar"
          >
            <span aria-hidden="true" style={{ width: `${levelProgress}%` }} />
          </span>
          <span className="stat-pill xp-pill">{formatNumber(user.xp)} XP</span>
          <span className="stat-pill gem-pill">{formatNumber(user.gems)} Gemas</span>
        </div>
        <div className="player-profile">
          <UserAvatar className="profile-badge" size={40} />
          <strong className="user-name">{user.name}</strong>
        </div>
      </div>
    </header>
  );
}
