import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/Core/Context/usar-app.js';
import { ROUTES } from '@/app/Core/Models/rutas.js';
import { PageHeader } from '@/app/Shared/Components/encabezado-pagina/encabezado-pagina.jsx';
import { CheckBadge, RouteFeatureIcons } from '@/app/Shared/Components/iconos/iconos.jsx';
import './pagina-resumen-ruta.css';

export function RouteSummaryPage() {
  const navigate = useNavigate();
  const { user, routeSummary, logout, completeOnboarding, authLoading, systemMessage } = useApp();

  return (
    <main className="summary-shell app-page-shell">
      <PageHeader onLogout={logout} subtitle="Resumen de ruta" title="Listo" user={user} />
      <CheckBadge size={120} />
      <h1>¡Todo listo, {(user.name || 'Estudiante').split(' ')[0]}!</h1>
      <p>Hemos personalizado tu ruta de aprendizaje según tus intereses científicos y objetivos académicos.</p>

      <section className="summary-grid">
        <article className="summary-main-card">
          <h2>Tu enfoque principal</h2>
          <div className="focus-visual">
            <span>{routeSummary.focusTag}</span>
          </div>
          <p>{routeSummary.description}</p>
        </article>
        <div className="summary-side">
          <article>
            <span>Nivel</span>
            <strong>{routeSummary.level}</strong>
          </article>
          <article>
            <span>Estilo</span>
            <strong>{routeSummary.style}</strong>
          </article>
        </div>
      </section>

      <section className="route-band">
        <RouteFeatureIcons />
        <p>
          Tu ruta incluye <strong>{routeSummary.missions} misiones</strong> y{' '}
          <strong>{routeSummary.labs} laboratorios virtuales</strong>.
        </p>
        <div>
          <span>Meta estimada:</span>
          <strong>{routeSummary.weeks} semanas</strong>
        </div>
      </section>

      <button className="primary-setup-button wide" disabled={authLoading} onClick={completeOnboarding} type="button">
        {authLoading ? 'Guardando preferencias...' : 'Comenzar aventura →'}
      </button>
      {systemMessage && <p className="system-message">{systemMessage}</p>}
      <button className="text-button" onClick={() => navigate(ROUTES.APP_ONBOARDING)} type="button">
        Revisar mis preferencias
      </button>
    </main>
  );
}
