import { useApp } from '@/app/Core/Context/usar-app.js';
import { optionLetter } from '@/app/Core/Utils/formato.util.js';
import { answersMatch } from '@/app/Core/Utils/retos.util.js';
import { mensajePasoActual } from '@/app/Core/Utils/retroalimentacion.util.js';
import { PhysicsDiagram } from '@/app/Shared/Components/diagrama-fisica/diagrama-fisica.jsx';
import { ExerciseFeedback } from '@/app/Shared/Components/retroalimentacion-ejercicio/retroalimentacion-ejercicio.jsx';
import { AiSidePanel } from '@/app/Shared/Components/panel-lateral-ia/panel-lateral-ia.jsx';
import './pagina-retos.css';

/**
 * Pagina Retos.
 *
 * Donde cambiar cada parte:
 * - Barra superior del reto: bloque .challenge-toolbar.
 * - Enunciado y diagrama: bloque .exercise-panel.
 * - Alternativas: .options-grid.
 * - Botones Resolver/Siguiente: .exercise-actions.
 * - Resultado: Shared/Components/retroalimentacion-ejercicio.
 * - Panel derecho de IA: Shared/Components/panel-lateral-ia.
 */
export function RetosPage() {
  const {
    aiRecommendations,
    analytics,
    challenge,
    feedback,
    feedbackRef,
    isGenerating,
    avanzarSiguienteEjercicio,
    generateAiExercise,
    repetirMision,
    resolveExercise,
    seleccionarRespuesta,
    prediction,
    preferences,
    resolviendo,
    selectedAnswer,
    timerLabel,
    user
  } = useApp();

  const mostrandoResultado = Boolean(feedback && !feedback.checking);
  const pasoGuia = mensajePasoActual(challenge);

  return (
    <>
      <section className="challenge-stage">
        <div className="challenge-toolbar">
          <strong>{challenge.title}</strong>
          <div className="question-progress">
            <span>{challenge.badge}</span>
            <span className="mini-progress">
              <span />
            </span>
          </div>
          <span className="timer">{timerLabel ?? challenge.timer}</span>
        </div>

        <article className="exercise-panel">
          <p className="student-step-banner" role="status">
            {mostrandoResultado
              ? 'Mira aqui tu resultado y lo que ganaste'
              : selectedAnswer
                ? 'Paso 2: pulsa "Resolver ejercicio"'
                : pasoGuia}
          </p>
          <div className="question-copy">
            <span>Dinamica - {preferences.level}</span>
            <h1>{challenge.question}</h1>
          </div>
          <PhysicsDiagram challenge={challenge} />
          <div className="options-grid">
            {challenge.options.map((option, index) => (
              <button
                className={[
                  'answer-option',
                  selectedAnswer === option ? 'selected' : '',
                  feedback && answersMatch(option, challenge.correctAnswer) ? 'correct' : '',
                  feedback &&
                  answersMatch(selectedAnswer, option) &&
                  !answersMatch(option, challenge.correctAnswer)
                    ? 'wrong'
                    : ''
                ]
                  .filter(Boolean)
                  .join(' ')}
                disabled={Boolean(feedback?.correct) || resolviendo}
                key={option}
                onClick={() => seleccionarRespuesta(option)}
                type="button"
              >
                <span>{optionLetter(index)}</span>
                <strong>{option}</strong>
              </button>
            ))}
          </div>
          <div className="exercise-actions">
            <button
              className="resolve-button"
              disabled={
                !selectedAnswer ||
                resolviendo ||
                Boolean(feedback?.correct && !feedback?.missionComplete)
              }
              onClick={resolveExercise}
              type="button"
            >
              {resolviendo ? 'Revisando tu respuesta...' : 'Resolver ejercicio'}
            </button>
            {feedback?.canAdvance && (
              <button className="resolve-button" onClick={avanzarSiguienteEjercicio} type="button">
                Siguiente ejercicio
              </button>
            )}
          </div>

          <ExerciseFeedback
            feedback={feedback}
            feedbackRef={feedbackRef}
            isGenerating={isGenerating}
            mostrandoResultado={mostrandoResultado}
            onGenerateAiExercise={generateAiExercise}
            onRepeatMission={repetirMision}
          />
        </article>
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
