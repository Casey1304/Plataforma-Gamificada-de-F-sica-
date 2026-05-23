import { useEffect, useMemo, useState } from 'react';
import { createAttempt, getChallenges, getProgress, submitAnswer } from './api.js';
import { mockChallenges } from './data/mockChallenges.js';

const STUDENT_ID = 1;

function normalizeAnswer(value) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function App() {
  const [challenges, setChallenges] = useState(mockChallenges);
  const [selectedChallengeId, setSelectedChallengeId] = useState(mockChallenges[0].id);
  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [progress, setProgress] = useState([]);
  const [apiStatus, setApiStatus] = useState('Modo demo activo');

  const selectedChallenge = useMemo(
    () => challenges.find((challenge) => challenge.id === selectedChallengeId) ?? challenges[0],
    [challenges, selectedChallengeId]
  );

  useEffect(() => {
    getChallenges()
      .then((data) => {
        if (data.length > 0) {
          setChallenges(data);
          setSelectedChallengeId(data[0].id);
          setApiStatus('Conectado al backend Spring Boot');
        }
      })
      .catch(() => setApiStatus('Modo demo activo: backend no disponible'));
  }, []);

  async function startAttempt() {
    try {
      const attempt = await createAttempt(STUDENT_ID, selectedChallenge.id);
      setAttemptId(attempt.attemptId);
      setApiStatus('Intento iniciado en Spring Boot');
      return attempt.attemptId;
    } catch {
      const demoAttemptId = `demo-${Date.now()}`;
      setAttemptId(demoAttemptId);
      setApiStatus('Intento demo iniciado localmente');
      return demoAttemptId;
    }
  }

  async function handleStartChallenge() {
    setFeedback({});
    setAnswers({});
    await startAttempt();
  }

  async function handleSubmitAnswer(exercise) {
    const submittedAnswer = answers[exercise.id] ?? '';
    if (!submittedAnswer.trim()) {
      setFeedback((current) => ({
        ...current,
        [exercise.id]: { correct: false, feedback: 'Escribe una respuesta antes de enviar.' }
      }));
      return;
    }

    const activeAttemptId = attemptId ?? (await startAttempt());

    try {
      const response = await submitAnswer(activeAttemptId, {
        exerciseId: exercise.id,
        submittedAnswer,
        attemptNumber: 1,
        responseTimeSeconds: 45
      });
      setFeedback((current) => ({ ...current, [exercise.id]: response }));
      const updatedProgress = await getProgress(STUDENT_ID);
      setProgress(updatedProgress);
    } catch {
      const correct = normalizeAnswer(submittedAnswer) === normalizeAnswer(exercise.correctAnswer ?? '');
      setFeedback((current) => ({
        ...current,
        [exercise.id]: {
          correct,
          feedback: correct
            ? 'Correcto. Sumaste puntos y avanzaste en la mision.'
            : `Revisa el concepto. Respuesta esperada: ${exercise.correctAnswer}.`
        }
      }));
    }
  }

  return (
    <main className="app-shell">
      <section className="mission-board">
        <header className="topbar">
          <div>
            <p className="eyebrow">PhysicsPlay</p>
            <h1>Retos interactivos de Fisica Dinamica</h1>
          </div>
          <span className="status-pill">{apiStatus}</span>
        </header>

        <div className="layout-grid">
          <aside className="challenge-list" aria-label="Lista de retos">
            <h2>Misiones</h2>
            {challenges.map((challenge) => (
              <button
                className={challenge.id === selectedChallenge.id ? 'challenge-item active' : 'challenge-item'}
                key={challenge.id}
                onClick={() => {
                  setSelectedChallengeId(challenge.id);
                  setAttemptId(null);
                  setFeedback({});
                  setAnswers({});
                }}
                type="button"
              >
                <span>Nivel {challenge.levelNumber}</span>
                <strong>{challenge.title}</strong>
                <small>{challenge.rewardPoints} puntos</small>
              </button>
            ))}
          </aside>

          <section className="challenge-panel">
            <div className="challenge-heading">
              <div>
                <p className="eyebrow">Reto seleccionado</p>
                <h2>{selectedChallenge.title}</h2>
                <p>{selectedChallenge.description}</p>
              </div>
              <button className="primary-button" onClick={handleStartChallenge} type="button">
                Iniciar reto
              </button>
            </div>

            <div className="exercise-stack">
              {selectedChallenge.exercises.map((exercise, index) => (
                <article className="exercise-card" key={exercise.id}>
                  <div className="exercise-meta">
                    <span>Ejercicio {index + 1}</span>
                    <strong>{exercise.points} pts</strong>
                  </div>
                  <p>{exercise.statement}</p>
                  <div className="answer-row">
                    <input
                      aria-label={`Respuesta del ejercicio ${index + 1}`}
                      onChange={(event) =>
                        setAnswers((current) => ({ ...current, [exercise.id]: event.target.value }))
                      }
                      placeholder="Escribe tu respuesta"
                      value={answers[exercise.id] ?? ''}
                    />
                    <button onClick={() => handleSubmitAnswer(exercise)} type="button">
                      Enviar
                    </button>
                  </div>
                  {feedback[exercise.id] && (
                    <p className={feedback[exercise.id].correct ? 'feedback correct' : 'feedback warning'}>
                      {feedback[exercise.id].feedback}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>

          <aside className="progress-panel">
            <h2>Progreso</h2>
            <div className="metric">
              <span>Intento</span>
              <strong>{attemptId ? 'Activo' : 'Pendiente'}</strong>
            </div>
            <div className="metric">
              <span>Respuestas enviadas</span>
              <strong>{Object.keys(feedback).length}</strong>
            </div>
            <div className="metric">
              <span>Correctas</span>
              <strong>{Object.values(feedback).filter((item) => item.correct).length}</strong>
            </div>
            {progress.length > 0 && (
              <div className="progress-list">
                {progress.map((item) => (
                  <p key={item.topicId}>
                    Tema {item.topicId}: {item.masteryLevel}
                  </p>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

export default App;
