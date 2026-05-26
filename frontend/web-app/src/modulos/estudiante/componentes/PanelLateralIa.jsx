import { MetricIcon, PanelAiBadge } from '../../../compartido/componentes/Iconos.jsx';

export default function PanelLateralIa({
  aiRecommendations,
  analytics,
  isGenerating,
  onGenerateAiExercise,
  prediction,
  user
}) {
  return (
    <aside className="ai-panel">
      <div className="panel-title">
        <strong>Inteligencia artificial</strong>
        <PanelAiBadge />
      </div>
      <section className="ai-card analytics-card">
        <h2>Análisis del estudiante</h2>
        <div className="metric-row">
          <MetricIcon name="tiempo" />
          <p>Tiempo promedio<br /><strong>{analytics.tiempoPromedio}</strong></p>
          <div className="metric-meter"><span style={{ width: '70%' }} /></div>
        </div>
        <div className="metric-row">
          <MetricIcon name="errores" />
          <p>Intentos fallidos<br /><strong>{analytics.intentosFallidos}</strong></p>
          <div className="metric-meter danger"><span style={{ width: '35%' }} /></div>
        </div>
        <div className="metric-row">
          <MetricIcon name="tema" />
          <p>Tema con más errores<br /><strong>{analytics.temaMasErrores}</strong></p>
        </div>
      </section>
      <section className="ai-card">
        <h2>Recomendación de IA</h2>
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
        {aiRecommendations.map((suggestion) => (
          <label className="suggestion-row" key={suggestion}>
            <input defaultChecked type="checkbox" />
            <span>{suggestion}</span>
          </label>
        ))}
        <button
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
