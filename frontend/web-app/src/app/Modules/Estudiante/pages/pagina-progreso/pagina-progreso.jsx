import { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/app/Core/Context/usar-app.js';
import { getProgress, getRecommendations } from '@/app/Core/Services/servicio-retos.js';
import { formatNumber } from '@/app/Core/Utils/formato.util.js';
import '../paginas-estudiante.css';

const TOPIC_NAMES = {
  1: 'Leyes de Newton',
  2: 'Fuerza y aceleracion',
  3: 'Masa y peso',
  4: 'Diagramas de cuerpo libre'
};

const FALLBACK_PROGRESS = [
  {
    topicId: 1,
    masteryLevel: 'en_practica',
    correctAnswers: 5,
    incorrectAnswers: 2,
    averageTimeSeconds: 68
  },
  {
    topicId: 2,
    masteryLevel: 'requiere_refuerzo',
    correctAnswers: 3,
    incorrectAnswers: 4,
    averageTimeSeconds: 92
  },
  {
    topicId: 3,
    masteryLevel: 'dominado',
    correctAnswers: 8,
    incorrectAnswers: 1,
    averageTimeSeconds: 54
  }
];

function masteryLabel(value) {
  const labels = {
    dominado: 'Dominado',
    en_practica: 'En practica',
    requiere_refuerzo: 'Requiere refuerzo'
  };
  return labels[value] ?? value ?? 'Sin datos';
}

function topicName(topicId) {
  return TOPIC_NAMES[topicId] ?? `Tema #${topicId}`;
}

function progressPercent(item) {
  const total = (item.correctAnswers ?? 0) + (item.incorrectAnswers ?? 0);
  if (total === 0) {
    return 0;
  }
  return Math.round(((item.correctAnswers ?? 0) * 100) / total);
}

function averageTimeLabel(seconds) {
  if (seconds == null) {
    return 'Sin tiempo';
  }
  const value = Number(seconds);
  if (Number.isNaN(value)) {
    return 'Sin tiempo';
  }
  return `${Math.round(value)}s promedio`;
}

export function ProgresoPage() {
  const { analytics, prediction, setSystemMessage, user } = useApp();
  const [progressItems, setProgressItems] = useState(FALLBACK_PROGRESS);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      if (!user.studentId) {
        setProgressItems(FALLBACK_PROGRESS);
        return;
      }

      try {
        const [progress, recommended] = await Promise.all([
          getProgress(user.studentId),
          getRecommendations(user.studentId)
        ]);
        if (!active) {
          return;
        }
        setProgressItems(progress.length > 0 ? progress : FALLBACK_PROGRESS);
        setRecommendations(recommended);
      } catch (error) {
        if (active) {
          setSystemMessage(error.message);
          setProgressItems(FALLBACK_PROGRESS);
        }
      }
    }

    loadProgress();

    return () => {
      active = false;
    };
  }, [setSystemMessage, user.studentId]);

  const totalAnswers = useMemo(
    () =>
      progressItems.reduce(
        (total, item) => total + (item.correctAnswers ?? 0) + (item.incorrectAnswers ?? 0),
        0
      ),
    [progressItems]
  );

  return (
    <section className="student-page student-page-wide">
      <div className="student-page-header">
        <span>Progreso</span>
        <h1>Tu avance por tema</h1>
        <p>
          Esto son tus datos del progreso
        </p>
      </div>

      <div className="student-stats-row">
        <article>
          <strong>{formatNumber(user.xp)}</strong>
          <span>XP acumulado</span>
        </article>
        <article>
          <strong>{user.level}</strong>
          <span>Nivel actual</span>
        </article>
        <article>
          <strong>{analytics.precision ?? user.precision}%</strong>
          <span>Precision</span>
        </article>
        <article>
          <strong>{totalAnswers}</strong>
          <span>Respuestas registradas</span>
        </article>
      </div>

      <div className="student-list-panel">
        {progressItems.map((item) => (
          <article className="topic-progress-row" key={item.topicId}>
            <div>
              <strong>{topicName(item.topicId)}</strong>
              <span>
                {masteryLabel(item.masteryLevel)} - {averageTimeLabel(item.averageTimeSeconds)}
              </span>
            </div>
            <div className="topic-progress-meter" aria-label={`${progressPercent(item)}%`}>
              <span style={{ width: `${progressPercent(item)}%` }} />
            </div>
            <strong>{progressPercent(item)}%</strong>
          </article>
        ))}
      </div>

      <div className="student-card-grid two-columns">
        <article className="student-info-card">
          <strong>Diagnostico IA</strong>
          <p>{prediction.alerta}</p>
          <span>{prediction.tendencia}</span>
        </article>
        <article className="student-info-card">
          <strong>Recomendaciones guardadas</strong>
          {recommendations.length > 0 ? (
            <ul>
              {recommendations.slice(0, 3).map((item) => (
                <li key={`${item.topicId}-${item.createdAt}`}>{item.recommendedActivity}</li>
              ))}
            </ul>
          ) : (
            <p>Resuelve retos para generar recomendaciones de refuerzo.</p>
          )}
        </article>
      </div>
    </section>
  );
}
