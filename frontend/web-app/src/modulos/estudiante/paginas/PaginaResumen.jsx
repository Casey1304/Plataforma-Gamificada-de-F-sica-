import EncabezadoPagina from '../../../compartido/componentes/EncabezadoPagina.jsx';
import { CheckBadge, RouteFeatureIcons } from '../../../compartido/componentes/Iconos.jsx';
import './PaginaResumen.css';

export default function PaginaResumen({
  routeSummary,
  user,
  onEdit,
  onLogout,
  onStart,
  loading,
  systemMessage
}) {
  return (
    <main className="summary-shell app-page-shell">
      <EncabezadoPagina onLogout={onLogout} subtitle="Resumen de ruta" title="Listo" user={user} />
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
        <p>Tu ruta incluye <strong>{routeSummary.missions} misiones</strong> y <strong>{routeSummary.labs} laboratorios virtuales</strong>.</p>
        <div><span>Meta estimada:</span><strong>{routeSummary.weeks} semanas</strong></div>
      </section>

      <button className="primary-setup-button wide" disabled={loading} onClick={onStart} type="button">
        {loading ? 'Guardando preferencias...' : 'Comenzar aventura →'}
      </button>
      {systemMessage && <p className="system-message">{systemMessage}</p>}
      <button className="text-button" onClick={onEdit} type="button">
        Revisar mis preferencias
      </button>
    </main>
  );
}
