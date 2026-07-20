import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from '@/app/Core/Context/usar-app.js';
import { getRanking } from '@/app/Core/Services/servicio-retos.js';
import { formatNumber } from '@/app/Core/Utils/formato.util.js';
import { StatusMessage } from '@/app/Shared/Components/mensaje-estado/mensaje-estado.jsx';
import '../paginas-estudiante.css';

export function RankingPage() {
  const { user } = useApp();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadRanking = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await getRanking();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      setStudents([]);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRanking();
  }, [loadRanking]);

  const ranking = useMemo(() => {
    return students.map((item, index) => ({
      id: item.studentId,
      name: item.fullName,
      xp: item.xpTotal ?? 0,
      gems: item.gems ?? 0,
      streak: item.currentStreak ?? 0,
      level: item.level ?? 1,
      current: item.studentId === user.studentId || item.studentId === user.userId,
      position: index + 1
    }));
  }, [students, user.studentId, user.userId]);

  return (
    <section className="student-page student-page-wide">
      <div className="student-page-header ranking-header">
        <span>Ranking</span>
        <h1>Clasificación de práctica</h1>
      </div>

      {isLoading && (
        <p aria-live="polite" className="loading-message" role="status">
          Cargando clasificación...
        </p>
      )}
      <StatusMessage message={errorMessage} />
      {errorMessage && (
        <button className="secondary-button retry-button" onClick={loadRanking} type="button">
          Volver a intentar
        </button>
      )}

      {!isLoading && !errorMessage && ranking.length === 0 && (
        <p className="empty-state" role="status">
          Aún no hay estudiantes en la clasificación.
        </p>
      )}

      {ranking.length > 0 && <ol aria-label="Clasificación por experiencia" className="student-list-panel ranking-list">
        {ranking.map((item) => (
          <li
            className={item.current ? 'ranking-row is-current-user' : 'ranking-row'}
            key={item.id}
          >
            <strong className="ranking-position">#{item.position}</strong>

            <div>
              <strong>{item.name}</strong>
              <span>{item.current ? 'Tu posición actual' : `Nivel ${item.level}`}</span>
            </div>

            <span>{formatNumber(item.xp)} XP</span>
            <span>{item.gems} gemas</span>
            <span>{item.streak} días</span>
          </li>
        ))}
      </ol>}
    </section>
  );
}
