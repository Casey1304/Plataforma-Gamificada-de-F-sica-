import { useMemo } from 'react';
import { useApp } from '@/app/Core/Context/usar-app.js';
import { formatNumber } from '@/app/Core/Utils/formato.util.js';
import '../paginas-estudiante.css';

const DEMO_CLASSMATES = [
  { id: 'ana', name: 'Ana Torres', xp: 1280, gems: 42, streak: 7 },
  { id: 'marco', name: 'Marco Ruiz', xp: 980, gems: 31, streak: 4 },
  { id: 'sofia', name: 'Sofia Diaz', xp: 760, gems: 26, streak: 5 },
  { id: 'luis', name: 'Luis Vega', xp: 620, gems: 18, streak: 2 }
];

export function RankingPage() {
  const { user } = useApp();

  const ranking = useMemo(() => {
    const currentUser = {
      id: 'current-user',
      name: user.name || 'Tu estudiante',
      xp: user.xp,
      gems: user.gems,
      streak: user.streak,
      current: true
    };

    return [currentUser, ...DEMO_CLASSMATES]
      .sort((a, b) => b.xp - a.xp)
      .map((item, index) => ({ ...item, position: index + 1 }));
  }, [user.gems, user.name, user.streak, user.xp]);

  return (
    <section className="student-page student-page-wide">
      <div className="student-page-header">
        <span>Ranking</span>
        <h1>Clasificación de practica</h1>
      </div>

      <div className="student-list-panel ranking-list">
        {ranking.map((item) => (
          <article className={item.current ? 'ranking-row is-current-user' : 'ranking-row'} key={item.id}>
            <strong className="ranking-position">#{item.position}</strong>
            <div>
              <strong>{item.name}</strong>
              <span>{item.current ? 'Tu posicion actual' : 'Estudiante'}</span>
            </div>
            <span>{formatNumber(item.xp)} XP</span>
            <span>{item.gems} gemas</span>
            <span>{item.streak} dias</span>
          </article>
        ))}
      </div>
    </section>
  );
}
