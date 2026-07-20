import { MetricIcon, PanelAiBadge } from '@/app/Shared/Components/iconos/iconos.jsx';
import './panel-lateral-ia.css';

export function AiSidePanel({
  aiRecommendations,
  analytics,
  isGenerating,
  onGenerateAiExercise,
  prediction,
  user
}) {
  return (
    <aside aria-labelledby="ai-panel-title" className="ai-panel">
      <div className="panel-title">
        <h2 id="ai-panel-title">Inteligencia artificial</h2>
        <PanelAiBadge />
      </div>
      <section className="ai-card analytics-card">
        <h3>Análisis del estudiante</h3>
        <div className="metric-row">
          <MetricIcon name="tiempo" />
          <p>Tiempo promedio<br /><strong>{analytics.tiempoPromedio}</strong></p>
          <div aria-hidden="true" className="metric-meter"><span style={{ width: '70%' }} /></div>
        </div>
        <div className="metric-row">
          <MetricIcon name="errores" />
          <p>Intentos fallidos<br /><strong>{analytics.intentosFallidos}</strong></p>
          <div aria-hidden="true" className="metric-meter danger"><span style={{ width: '35%' }} /></div>
        </div>
        <div className="metric-row">
          <MetricIcon name="tema" />
          <p>Tema con más errores<br /><strong>{analytics.temaMasErrores}</strong></p>
        </div>
      </section>
      <section className="ai-card">
        <h3>Recomendación de IA</h3>
        <p className="ai-data-sources">
          Basado en: {prediction.fuentesDatos ?? 'actividad registrada en la plataforma'}
        </p>
        <p className="recommendation-box">
          <strong>{prediction.alerta}</strong>
          <span>{prediction.tendencia}</span>
        </p>
        {prediction.probabilidadAprobacion != null && (
          <p className="ai-metric-chip">
            Probabilidad estimada de aprobar evaluación: <strong>{prediction.probabilidadAprobacion}%</strong>
          </p>
        )}
        {Array.isArray(prediction.temasDificiles) && prediction.temasDificiles.length > 0 && (
          <div className="ai-tags">
            {prediction.temasDificiles.map((tema) => (
              <span className="ai-tag" key={tema}>
                {tema}
              </span>
            ))}
          </div>
        )}
        {Array.isArray(prediction.patronesError) && prediction.patronesError.length > 0 && (
          <ul className="ai-pattern-list">
            {prediction.patronesError.map((patron) => (
              <li key={patron}>{patron}</li>
            ))}
          </ul>
        )}
        {aiRecommendations.length > 0 && (
          <fieldset className="suggestion-list">
            <legend>Sugerencias para practicar</legend>
            {aiRecommendations.map((suggestion) => (
              <label className="suggestion-row" key={suggestion}>
                <input defaultChecked type="checkbox" />
                <span>{suggestion}</span>
              </label>
            ))}
          </fieldset>
        )}
        <button
          aria-busy={isGenerating}
          className="generate-button"
          disabled={isGenerating || !user.studentId}
          onClick={onGenerateAiExercise}
          type="button"
        >
          {isGenerating ? 'Generando refuerzo...' : 'Generar ejercicios personalizados'}
        </button>
      </section>
    </aside>
  );
}
