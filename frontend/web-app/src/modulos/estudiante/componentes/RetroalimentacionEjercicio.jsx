import { FeedbackIcon, OptionIcon } from '../../../compartido/componentes/Iconos.jsx';

export default function RetroalimentacionEjercicio({
  feedback,
  feedbackRef,
  isGenerating,
  mostrandoResultado,
  onGenerateAiExercise,
  onRepeatMission
}) {
  return (
    <section
      aria-live="polite"
      className={[
        'feedback-section',
        'visible',
        mostrandoResultado || feedback?.checking ? 'is-focused' : ''
      ]
        .filter(Boolean)
        .join(' ')}
      ref={feedbackRef}
    >
      <h2>Retroalimentación inmediata</h2>
      <div
        className={[
          'feedback-card',
          feedback?.checking ? 'is-checking' : '',
          feedback?.missionComplete ? 'is-mission-complete' : '',
          feedback?.correct === false ? 'needs-review' : '',
          feedback?.correct ? 'is-correct' : ''
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {feedback?.checking ? (
          <span className="feedback-spinner" aria-hidden="true" />
        ) : feedback ? (
          <FeedbackIcon correct={feedback.correct} />
        ) : (
          <span className="icon-wrap option-icon" style={{ width: 52, height: 52, borderRadius: '50%' }}>
            <OptionIcon name="practico" size={28} />
          </span>
        )}
        <div className="feedback-copy">
          <h3>{feedback?.title ?? 'Elige una respuesta'}</h3>
          <p>
            {feedback?.body ??
              'Marca la opción que creas correcta. Al resolver, aquí verás si acertaste y cuánto ganaste.'}
          </p>
          {feedback?.formula ? <strong>{feedback.formula}</strong> : null}
          {feedback?.fromGemini && !feedback?.checking ? (
            <span className="gemini-badge">Explicación con IA ✨</span>
          ) : null}
        </div>
        {!feedback?.checking && !feedback?.missionComplete ? (
          <div className="reward-column">
            <span className="reward-xp">+{feedback?.xp ?? 0} XP</span>
            <span className="reward-gems">+{feedback?.gems ?? 0} Gemas</span>
          </div>
        ) : null}
      </div>

      {feedback?.missionComplete ? (
        <div className="mission-complete-actions">
          <button className="resolve-button" onClick={onRepeatMission} type="button">
            Practicar otra vez la misión
          </button>
          <button
            className="resolve-button"
            disabled={isGenerating}
            onClick={onGenerateAiExercise}
            type="button"
          >
            {isGenerating ? 'Preparando reto…' : 'Pedir un reto extra con IA'}
          </button>
        </div>
      ) : null}
    </section>
  );
}
