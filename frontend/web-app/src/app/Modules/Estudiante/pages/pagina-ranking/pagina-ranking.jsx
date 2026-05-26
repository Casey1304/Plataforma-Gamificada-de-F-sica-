import { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/app/Core/Context/usar-app.js';
import { formatNumber } from '@/app/Core/Utils/formato.util.js';
import '../paginas-estudiante.css';

export function RankingPage() {
  const { user } = useApp();
  const [students, setStudents] = useState([]);

  useEffect(() => {
  fetch('/api/ranking')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      setStudents(Array.isArray(data) ? data : []);
    })
    .catch((error) => {
      console.error('Error cargando ranking:', error);
      setStudents([]);
    });
}, []);

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

      <div className="student-list-panel ranking-list">
        {ranking.map((item) => (
          <article
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
          </article>
        ))}
      </div>
    </section>
  );
}