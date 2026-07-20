import { useApp } from '@/app/Core/Context/usar-app.js';
import { AiSidePanel } from '@/app/Shared/Components/panel-lateral-ia/panel-lateral-ia.jsx';
import '@/app/Modules/Estudiante/pages/paginas-estudiante.css';

export function PanelIAPage() {
  const {
    aiRecommendations,
    analytics,
    generateAiExercise,
    isGenerating,
    prediction,
    user
  } = useApp();

  return (
    <>
      <section className="student-page ia-main-page">
        <div className="student-page-header">
          <span>Tutor IA</span>
          <h1>Recomendaciones para tu siguiente práctica</h1>
          <p>
            Revisa tus avances y elige una actividad para reforzar los temas más difíciles.
          </p>
        </div>

        <div className="student-card-grid two-columns">
          <article className="student-info-card">
            <h2>Diagnóstico actual</h2>
            <p>{prediction.alerta}</p>
            <span>{prediction.tendencia}</span>
          </article>
          <article className="student-info-card">
            <h2>Actividad sugerida</h2>
            <p>{aiRecommendations[0] ?? 'Completa un reto para recibir recomendaciones.'}</p>
            <button
              aria-busy={isGenerating}
              className="primary-setup-button compact-action"
              disabled={isGenerating || !user.studentId}
              onClick={generateAiExercise}
              type="button"
            >
              {isGenerating ? 'Generando...' : 'Generar reto personalizado'}
            </button>
          </article>
        </div>
      </section>

      <AiSidePanel
        aiRecommendations={aiRecommendations}
        analytics={analytics}
        isGenerating={isGenerating}
        onGenerateAiExercise={generateAiExercise}
        prediction={prediction}
        user={user}
      />
    </>
  );
}
