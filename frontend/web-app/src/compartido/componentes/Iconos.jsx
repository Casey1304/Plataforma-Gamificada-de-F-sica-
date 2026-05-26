const defaultSize = 24;

function Svg({ children, size = defaultSize, className = '', viewBox = '0 0 24 24' }) {
  return (
    <svg
      aria-hidden="true"
      className={`icon-svg ${className}`.trim()}
      fill="none"
      height={size}
      viewBox={viewBox}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

export function BrandLogo({ size = 48, className = '' }) {
  return (
    <span className={`icon-wrap brand-logo ${className}`.trim()}>
      <Svg size={size} viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="22" fill="url(#brandGrad)" />
        <ellipse cx="24" cy="24" rx="18" ry="6" stroke="#fff" strokeOpacity="0.9" strokeWidth="2" />
        <ellipse cx="24" cy="24" rx="6" ry="18" stroke="#fff" strokeOpacity="0.55" strokeWidth="2" transform="rotate(58 24 24)" />
        <circle cx="24" cy="24" r="5" fill="#e01578" stroke="#fff" strokeWidth="2" />
        <defs>
          <linearGradient id="brandGrad" x1="8" x2="40" y1="8" y2="40">
            <stop stopColor="#24cfc6" />
            <stop offset="1" stopColor="#007a73" />
          </linearGradient>
        </defs>
      </Svg>
    </span>
  );
}

export function UserAvatar({ size = 44, className = '' }) {
  return (
    <span className={`icon-wrap user-avatar ${className}`.trim()}>
      <Svg size={size} viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="22" fill="url(#userGrad)" />
        <circle cx="22" cy="17" r="7" fill="#fff" fillOpacity="0.95" />
        <path d="M10 36c2.5-6 6-9 12-9s9.5 3 12 9" fill="#fff" fillOpacity="0.9" />
        <defs>
          <linearGradient id="userGrad" x1="6" x2="38" y1="4" y2="40">
            <stop stopColor="#24cfc6" />
            <stop offset="1" stopColor="#00716b" />
          </linearGradient>
        </defs>
      </Svg>
    </span>
  );
}

export function FieldIcon({ name, size = 22 }) {
  const icons = {
    user: (
      <>
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M5 20c1.5-4 4-6 7-6s5.5 2 7 6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </>
    ),
    email: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M3 8l9 6 9-6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" strokeWidth="2" />
      </>
    )
  };
  return (
    <span className="icon-wrap field-icon">
      <Svg size={size}>{icons[name]}</Svg>
    </span>
  );
}

export function NavIcon({ name, size = 20 }) {
  const icons = {
    inicio: <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" fill="currentColor" />,
    retos: <path d="M6 4h12v4H6V4zm0 6h12v4H6v-4zm0 6h8v4H6v-4z" fill="currentColor" />,
    ia: (
      <>
        <path d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5L12 14.8 7.5 16.7l.9-5L4.8 8.2l5-.7L12 3z" fill="currentColor" />
        <circle cx="18" cy="6" r="2" fill="currentColor" />
      </>
    ),
    progreso: <path d="M5 19V5m0 14h14M9 15l3-4 3 3 4-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />,
    ranking: (
      <>
        <rect x="5" y="12" width="4" height="8" rx="1" fill="currentColor" />
        <rect x="10" y="8" width="4" height="12" rx="1" fill="currentColor" />
        <rect x="15" y="14" width="4" height="6" rx="1" fill="currentColor" />
      </>
    ),
    notas: (
      <>
        <path d="M7 4h10v16H7V4z" stroke="currentColor" strokeWidth="2" />
        <path d="M10 8h6M10 12h6M10 16h4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </>
    ),
    salir: <path d="M10 7V5a2 2 0 012-2h8v16h-8a2 2 0 01-2-2v-2M3 12h12m0 0-4-4m4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  };
  return (
    <span className="icon-wrap nav-icon">
      <Svg size={size}>{icons[name]}</Svg>
    </span>
  );
}

const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'retos', label: 'Retos' },
  { id: 'ia', label: 'Tutor IA' },
  { id: 'progreso', label: 'Progreso' },
  { id: 'ranking', label: 'Ranking' },
  { id: 'notas', label: 'Notas' }
];

export { NAV_ITEMS };

export function OptionIcon({ name, size = 40 }) {
  const icons = {
    basico: <path d="M12 3v4M12 17v4M5 12H3M21 12h-2M6 6l-1.5-1.5M19.5 19.5L18 18M6 18l-1.5 1.5M19.5 4.5L18 6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />,
    intermedio: <path d="M4 14l4-8 4 6 4-10 4 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />,
    avanzado: <path d="M12 2l2.5 7h7.5l-6 4.5 2.5 7L12 16l-6.5 4.5 2.5-7-6-4.5h7.5L12 2z" fill="currentColor" />,
    visual: (
      <>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="2" />
      </>
    ),
    practico: <path d="M8 6h8v12H8V6zm2 2v2m0 4v2m4-6v2m0 4v2" stroke="currentColor" strokeWidth="2" />,
    teorico: (
      <>
        <path d="M6 4h12v14H6z" stroke="currentColor" strokeWidth="2" />
        <path d="M9 8h6M9 12h6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </>
    ),
    aprobar: <path d="M9 12l2 2 4-5M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="currentColor" strokeWidth="2" />,
    dominar: <path d="M12 3l7 4v6c0 5-3 8-7 8s-7-3-7-8V7l7-4z" stroke="currentColor" strokeWidth="2" />,
    explorar: <path d="M12 3c4 3 6 7 6 11a6 6 0 11-12 0c0-4 2-8 6-11z" stroke="currentColor" strokeWidth="2" />,
    ligero: (
      <>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v4l3 2" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </>
    ),
    constante: (
      <>
        <circle cx="6" cy="12" r="3" fill="currentColor" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
        <circle cx="18" cy="12" r="3" fill="currentColor" />
      </>
    ),
    intensivo: <path d="M13 2L4 14h7l-1 8 9-14H11l2-6z" fill="currentColor" />,
    pistas: <path d="M12 3a6 6 0 016 6c0 3-2 4-4 6v2H10v-2c-2-2-4-3-4-6a6 6 0 016-6zm0 17a2 2 0 100-4 2 2 0 000 4z" fill="currentColor" />,
    'paso-a-paso': <path d="M5 6h14M5 12h10M5 18h6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />,
    refuerzo: <path d="M4 12h6l3-8 4 16 3-8h6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  };
  return (
    <span className="icon-wrap option-icon">
      <Svg size={size}>{icons[name] ?? icons.practico}</Svg>
    </span>
  );
}

export function MetricIcon({ name, size = 22 }) {
  const icons = {
      tiempo: (
        <>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7v5l3 2" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        </>
      ),
    errores: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </>
    ),
    tema: <path d="M4 6h16M6 10h12M8 14h8M10 18h4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
  };
  return (
    <span className={`icon-wrap metric-icon metric-${name}`}>
      <Svg size={size}>{icons[name]}</Svg>
    </span>
  );
}

export function CheckBadge({ size = 56 }) {
  return (
    <span className="icon-wrap check-badge">
      <Svg size={size} viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="28" fill="url(#checkGrad)" />
        <path d="M16 28l8 8 16-16" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <defs>
          <linearGradient id="checkGrad" x1="10" x2="46" y1="10" y2="46">
            <stop stopColor="#e01578" />
            <stop offset="1" stopColor="#ff6eb4" />
          </linearGradient>
        </defs>
      </Svg>
    </span>
  );
}

export function FeedbackIcon({ correct, size = 40 }) {
  return (
    <span className={`icon-wrap feedback-icon ${correct ? 'is-correct' : 'is-wrong'}`}>
      <Svg size={size} viewBox="0 0 40 40">
        {correct ? (
          <path d="M8 20l8 8 16-16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        ) : (
          <path d="M12 12l16 16M28 12L12 28" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
        )}
      </Svg>
    </span>
  );
}

export function AuthModeIcon({ mode, size = 40 }) {
  const isRegister = mode === 'register';
  return (
    <span className="icon-wrap auth-mode-icon">
      <Svg size={size}>
        {isRegister ? (
          <>
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M4 20c2-5 5-7 8-7s6 2 8 7" stroke="currentColor" strokeWidth="2" />
            <path d="M18 4h4v4M20 2v8" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </>
        ) : (
          <>
            <rect x="4" y="10" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 10V8a4 4 0 118 0v2" stroke="currentColor" strokeWidth="2" />
          </>
        )}
      </Svg>
    </span>
  );
}

export function RouteFeatureIcons() {
  return (
    <div className="route-feature-icons">
      <span className="route-feature-icon" title="Laboratorio">
        <Svg size={22}><path d="M9 3h6v4l4 12H5L9 7V3z" stroke="currentColor" strokeWidth="2" /></Svg>
      </span>
      <span className="route-feature-icon" title="Inteligencia artificial">
        <NavIcon name="ia" size={22} />
      </span>
      <span className="route-feature-icon" title="Ruta de aprendizaje">
        <Svg size={22}><path d="M4 18c4-8 8-12 16-14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" /><circle cx="18" cy="4" r="2" fill="currentColor" /></Svg>
      </span>
    </div>
  );
}

export function TipIcon({ size = 28 }) {
  return (
    <span className="icon-wrap tip-icon">
      <Svg size={size}>
        <path d="M12 3a7 7 0 00-4 12.8V18h8v-2.2A7 7 0 0012 3z" stroke="currentColor" strokeWidth="2" />
        <path d="M10 21h4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </Svg>
    </span>
  );
}

export function PanelAiBadge({ size = 28 }) {
  return (
    <span className="icon-wrap panel-ai-badge">
      <NavIcon name="ia" size={size} />
    </span>
  );
}

export function ClassroomIcon({ size = 22 }) {
  return (
    <span className="icon-wrap">
      <Svg size={size}>
        <path d="M3 8l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="2" />
        <path d="M6 10v6c0 2 3 4 6 4s6-2 6-4v-6" stroke="currentColor" strokeWidth="2" />
      </Svg>
    </span>
  );
}

export function AdminIcon({ size = 22 }) {
  return (
    <span className="icon-wrap">
      <Svg size={size}>
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M4 20c2-4 5-6 8-6s6 2 8 6" stroke="currentColor" strokeWidth="2" />
        <path d="M17 4h5v5" stroke="currentColor" strokeWidth="2" />
      </Svg>
    </span>
  );
}
