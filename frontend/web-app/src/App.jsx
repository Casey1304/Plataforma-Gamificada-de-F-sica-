import { useEffect, useMemo, useState } from 'react';
import { requestPredictiveAnalysis } from './api.js';

const STUDENT = {
  name: 'Alex Rivera',
  level: 15,
  xp: 1250,
  gems: 1250,
  streak: 2,
  precision: 72,
  levelProgress: 46
};

const baseChallenge = {
  id: 'newton-base',
  title: 'Reto: Leyes de Newton',
  badge: 'Pregunta 2 de 5',
  timer: '01:30',
  question: 'Un cuerpo de 10 kg acelera a 2 m/s². ¿Cuál es la fuerza aplicada?',
  massLabel: '10 kg',
  vectorLabel: 'a = 2 m/s²',
  formula: 'F = 10 kg × 2 m/s² = 20 N',
  explanation: 'La fuerza se calcula con la fórmula F = m × a.',
  correctAnswer: '20 N',
  options: ['5 N', '20 N', '50 N', '100 N']
};

const aiChallenge = {
  id: 'ai-force-boost',
  title: 'Reto IA: Fuerza y Aceleración',
  badge: 'Refuerzo generado',
  timer: '02:00',
  question: 'Un bloque de 6 kg acelera a 3 m/s². ¿Qué fuerza neta actúa sobre el bloque?',
  massLabel: '6 kg',
  vectorLabel: 'a = 3 m/s²',
  formula: 'F = 6 kg × 3 m/s² = 18 N',
  explanation: 'La IA eligió un refuerzo directo: multiplicar masa por aceleración.',
  correctAnswer: '18 N',
  options: ['9 N', '18 N', '24 N', '36 N']
};

const suggestions = [
  'Practicar ejercicios básicos de Fuerza.',
  'Revisar la fórmula F = m × a y su aplicación.',
  'Resolver reto de refuerzo: Aceleración y Fuerza.'
];

const defaultAnalytics = {
  tiempoPromedio: '1m 20s',
  intentosFallidos: 3,
  temaMasErrores: 'Fuerza y Aceleración'
};

const defaultPrediction = {
  alerta: 'Se detectó dificultad en la Segunda Ley de Newton.',
  tendencia: 'Refuerza la relación entre masa, aceleración y fuerza antes de subir de nivel.'
};

const navItems = [
  ['Inicio', '⌂'],
  ['Retos', '◎'],
  ['Tutor IA', '▣'],
  ['Progreso', '▥'],
  ['Ranking', '♕'],
  ['Bloc de notas', '□']
];

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

function optionLetter(index) {
  return String.fromCharCode(65 + index);
}

function extractPhysicsLabels(question) {
  const text = question ?? '';
  const massMatch = text.match(/(\d+(?:[.,]\d+)?)\s*kg/i);
  const accelerationMatch = text.match(/acelera\s+a\s+(\d+(?:[.,]\d+)?)\s*m\/s(?:²|2)/i)
    ?? text.match(/aceleraci[oó]n\s+(?:es|de)?\s*(\d+(?:[.,]\d+)?)\s*m\/s(?:²|2)/i);

  return {
    massLabel: massMatch ? `${massMatch[1].replace(',', '.')} kg` : aiChallenge.massLabel,
    vectorLabel: accelerationMatch ? `a = ${accelerationMatch[1].replace(',', '.')} m/s²` : aiChallenge.vectorLabel
  };
}

function buildChallengeFromPrediction(nextCustomChallenge) {
  if (!nextCustomChallenge) {
    return aiChallenge;
  }

  const question = nextCustomChallenge.pregunta ?? aiChallenge.question;
  const labels = extractPhysicsLabels(question);
  const options = nextCustomChallenge.opciones
    ? [
        nextCustomChallenge.opciones.A,
        nextCustomChallenge.opciones.B,
        nextCustomChallenge.opciones.C,
        nextCustomChallenge.opciones.D
      ].filter(Boolean)
    : aiChallenge.options;

  return {
    id: `gemini-${Date.now()}`,
    title: 'Reto IA: Nivelación predictiva',
    badge: 'Gemini 1.5 Flash',
    timer: '02:00',
    question,
    massLabel: labels.massLabel,
    vectorLabel: labels.vectorLabel,
    formula: `Respuesta correcta: ${nextCustomChallenge.respuestaCorrecta ?? aiChallenge.correctAnswer}`,
    explanation: 'Gemini generó este reto para cortar la tendencia de error detectada.',
    correctAnswer: nextCustomChallenge.respuestaCorrecta ?? aiChallenge.correctAnswer,
    options: options.length === 4 ? options : aiChallenge.options
  };
}

function App() {
  const [student, setStudent] = useState(STUDENT);
  const [challenge, setChallenge] = useState(baseChallenge);
  const [selectedAnswer, setSelectedAnswer] = useState('20 N');
  const [feedback, setFeedback] = useState(null);
  const [hasRewardedCurrentChallenge, setHasRewardedCurrentChallenge] = useState(false);
  const [checkedSuggestions, setCheckedSuggestions] = useState(() => suggestions.map(() => true));
  const [aiRecommendations, setAiRecommendations] = useState(suggestions);
  const [analytics, setAnalytics] = useState(defaultAnalytics);
  const [prediction, setPrediction] = useState(defaultPrediction);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  const isCorrect = selectedAnswer === challenge.correctAnswer;

  useEffect(() => {
    setFeedback(null);
    setSelectedAnswer(challenge.correctAnswer);
    setHasRewardedCurrentChallenge(false);
  }, [challenge]);

  useEffect(() => {
    setCheckedSuggestions(aiRecommendations.map(() => true));
  }, [aiRecommendations]);

  function resolveExercise() {
    const nextFeedback = {
      correct: isCorrect,
      title: isCorrect ? '¡Correcto!' : 'Casi lo tienes',
      body: isCorrect ? challenge.explanation : 'Revisa la relación entre masa, aceleración y fuerza neta.',
      formula: isCorrect ? challenge.formula : 'Pista: F = m × a',
      xp: isCorrect ? 50 : 0,
      gems: isCorrect ? 10 : 0
    };

    setFeedback(nextFeedback);

    if (isCorrect && !hasRewardedCurrentChallenge) {
      setStudent((current) => ({
        ...current,
        xp: current.xp + 50,
        gems: current.gems + 10,
        streak: current.streak + 1,
        precision: 80,
        levelProgress: Math.min(100, current.levelProgress + 14)
      }));
      setSparkles([
        { id: 'xp', label: '+50 XP' },
        { id: 'gems', label: '+10 Gemas' }
      ]);
      setHasRewardedCurrentChallenge(true);
      window.setTimeout(() => setSparkles([]), 1500);
    }

    if (!isCorrect) {
      setStudent((current) => ({
        ...current,
        streak: 0,
        precision: Math.max(45, current.precision - 8)
      }));
    }
  }

  function toggleSuggestion(index) {
    setCheckedSuggestions((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? !item : item))
    );
  }

  async function generateAiExercise() {
    setIsGenerating(true);
    setFeedback(null);

    try {
      const analysis = await requestPredictiveAnalysis({
        estudiante: student.name,
        rachaErrores: Math.max(3, 5 - student.streak),
        respuestasIncorrectasConsecutivas: 3,
        tiempoPromedioSegundos: 12,
        temaActual: 'Fuerza y Aceleración'
      });

      setAnalytics(analysis.analytics ?? defaultAnalytics);
      setPrediction(analysis.prediction ?? defaultPrediction);
      setAiRecommendations(
        Array.isArray(analysis.aiRecommendation) && analysis.aiRecommendation.length > 0
          ? analysis.aiRecommendation
          : suggestions
      );
      setChallenge(buildChallengeFromPrediction(analysis.nextCustomChallenge));
    } catch {
      setPrediction({
        alerta: 'La IA predictiva no respondió. Se activó un refuerzo local de respaldo.',
        tendencia: 'Mantén práctica guiada antes de aumentar la dificultad.'
      });
      setAiRecommendations(suggestions);
      setChallenge((current) => (current.id === aiChallenge.id ? baseChallenge : aiChallenge));
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="physics-shell">
      <header className="app-topbar">
        <div className="brand-cluster">
          <button aria-label="Abrir menu" className="icon-button menu-button" type="button">
            <span />
            <span />
            <span />
          </button>
          <span className="brand-mark" aria-hidden="true">⚗</span>
          <strong>PhysicsPlay</strong>
        </div>

        <div className="player-stats" aria-label="Estado del estudiante">
          <span className="level-chip">Nivel {student.level}</span>
          <span className="level-progress" aria-label="Progreso de nivel">
            <span style={{ width: `${student.levelProgress}%` }} />
          </span>
          <span className="stat-pill xp-pill">☆ {formatNumber(student.xp)} XP</span>
          <span className="stat-pill gem-pill">$ {formatNumber(student.gems)} Gemas</span>
          <span className="profile-badge" aria-hidden="true">AR</span>
          <strong>{student.name}</strong>
          <span className="chevron">⌄</span>
          <div className="reward-bursts" aria-live="polite">
            {sparkles.map((sparkle) => (
              <span key={sparkle.id}>{sparkle.label}</span>
            ))}
          </div>
        </div>
      </header>

      <div className="workspace-grid">
        <aside className="left-nav" aria-label="Navegación principal">
          {navItems.map(([item, icon]) => (
            <button className={item === 'Retos' ? 'nav-item active' : 'nav-item'} key={item} type="button">
              <span aria-hidden="true">{icon}</span>
              {item}
            </button>
          ))}
          <button className="nav-item logout" type="button">
            <span aria-hidden="true">↪</span>
            Cerrar sesión
          </button>
        </aside>

        <section className="challenge-stage" aria-label="Panel de retos">
          <div className="challenge-toolbar">
            <button className="round-button" aria-label="Volver" type="button">‹</button>
            <strong>{challenge.title}</strong>
            <div className="question-progress">
              <span>{challenge.badge}</span>
              <span className="mini-progress"><span /></span>
            </div>
            <span className="timer">◷ {challenge.timer}</span>
          </div>

          <article className="exercise-panel">
            <div className="question-copy">
              <span>Dinámica</span>
              <h1>{challenge.question}</h1>
            </div>

            <div className="vector-diagram" aria-label="Diagrama de bloque con vector de aceleración">
              <div className="motion-aura" />
              <div className="block">{challenge.massLabel}</div>
              <div className="arrow-line" />
              <strong>{challenge.vectorLabel}</strong>
            </div>
            <div className="ground-line" />

            <div className="options-grid" role="radiogroup" aria-label="Opciones de respuesta">
              {challenge.options.map((option, index) => {
                const selected = selectedAnswer === option;
                const resolved = feedback !== null;
                const correctOption = resolved && option === challenge.correctAnswer;
                const wrongSelected = resolved && selected && option !== challenge.correctAnswer;

                return (
                  <button
                    className={[
                      'answer-option',
                      selected ? 'selected' : '',
                      correctOption ? 'correct' : '',
                      wrongSelected ? 'wrong' : ''
                    ].filter(Boolean).join(' ')}
                    key={option}
                    onClick={() => setSelectedAnswer(option)}
                    role="radio"
                    aria-checked={selected}
                    type="button"
                  >
                    <span>{optionLetter(index)}</span>
                    <strong>{option}</strong>
                  </button>
                );
              })}
            </div>

            <button className="resolve-button" onClick={resolveExercise} type="button">
              Resolver ejercicio
            </button>
          </article>

          <section className={feedback ? 'feedback-section visible' : 'feedback-section'} aria-live="polite">
            <h2>Retroalimentación inmediata</h2>
            <div className={feedback?.correct === false ? 'feedback-card needs-review' : 'feedback-card'}>
              <div className="success-icon">{feedback?.correct === false ? '!' : '✓'}</div>
              <div>
                <h3>{feedback?.title ?? 'Selecciona una respuesta'}</h3>
                <p>{feedback?.body ?? 'Cuando resuelvas, verás el razonamiento y las recompensas aquí.'}</p>
                <strong>{feedback?.formula ?? 'F = m × a'}</strong>
              </div>
              <div className="reward-column">
                <span className="reward-xp">☆ +{feedback?.xp ?? 50} XP</span>
                <span className="reward-gems">◇ +{feedback?.gems ?? 10} Gemas</span>
              </div>
            </div>
          </section>

          <div className="stage-footer">
            <span>Precisión: {student.precision}%</span>
            <span className="precision-bar"><span style={{ width: `${student.precision}%` }} /></span>
            <span>Racha actual: {student.streak} correctas</span>
            <span className="streak-mark">♨</span>
          </div>
        </section>

        <aside className="ai-panel" aria-label="Inteligencia Artificial">
          <div className="panel-title">
            <strong>⚙ Inteligencia Artificial (IA)</strong>
            <span>ⓘ</span>
          </div>

          <section className="ai-card analytics-card">
            <h2>Análisis del estudiante</h2>
            <div className="metric-row">
              <span>◷</span>
              <p>Tiempo promedio por ejercicio<br /><strong>{analytics.tiempoPromedio}</strong></p>
              <div className="metric-meter"><span style={{ width: '70%' }} /></div>
            </div>
            <div className="metric-row">
              <span>×</span>
              <p>Intentos fallidos<br /><strong>{analytics.intentosFallidos}</strong></p>
              <div className="metric-meter danger"><span style={{ width: '35%' }} /></div>
            </div>
            <div className="metric-row">
              <span>▰</span>
              <p>Tema con más errores<br /><strong>{analytics.temaMasErrores}</strong></p>
            </div>
            <div className="performance-block">
              <div>
                <span>Desempeño general</span>
                <strong>60%</strong>
              </div>
              <div className="performance-line"><span style={{ width: '60%' }} /></div>
            </div>
          </section>

          <section className="ai-card">
            <h2>▣ Recomendación IA</h2>
            <p className="recommendation-box">
              <strong>{prediction.alerta}</strong>
              <span>{prediction.tendencia}</span>
            </p>
            <h3>Sugerencias para ti</h3>
            {aiRecommendations.map((suggestion, index) => (
              <label className="suggestion-row" key={suggestion}>
                <input
                  checked={checkedSuggestions[index]}
                  onChange={() => toggleSuggestion(index)}
                  type="checkbox"
                />
                <span>{suggestion}</span>
              </label>
            ))}
            <button className="generate-button" disabled={isGenerating} onClick={generateAiExercise} type="button">
              {isGenerating ? <span className="spinner" aria-hidden="true" /> : <span aria-hidden="true">⌁</span>}
              {isGenerating ? 'Generando refuerzo...' : 'Generar ejercicios personalizados'}
            </button>
          </section>

          <div className="daily-summary">
            <div><span>Ejercicios completados hoy</span><strong>8 de 15</strong></div>
            <div><span>XP ganado hoy</span><strong>300 XP</strong></div>
          </div>
        </aside>
      </div>

      <footer className="tips-bar">
        <span>☼</span>
        <p>Consejo: Practica constantemente para mejorar tu comprensión de los temas de Física.</p>
      </footer>
    </main>
  );
}

export default App;
