export const mockChallenges = [
  {
    id: 1,
    topicId: 1,
    title: 'Mision 1: Fuerzas en accion',
    description: 'Practica el concepto de fuerza neta en situaciones cotidianas.',
    levelNumber: 1,
    rewardPoints: 120,
    timeLimitSeconds: 300,
    exercises: [
      {
        id: 1,
        statement: 'Si una caja recibe una fuerza de 20 N hacia la derecha y 5 N hacia la izquierda, cual es la fuerza neta?',
        points: 10,
        correctAnswer: '15 N'
      },
      {
        id: 2,
        statement: 'Segun la segunda ley de Newton, que formula relaciona fuerza, masa y aceleracion?',
        points: 10,
        correctAnswer: 'F = m * a'
      }
    ]
  },
  {
    id: 2,
    topicId: 4,
    title: 'Mision 2: Leyes de Newton',
    description: 'Resuelve retos sobre inercia, accion-reaccion y aceleracion.',
    levelNumber: 2,
    rewardPoints: 160,
    timeLimitSeconds: 420,
    exercises: [
      {
        id: 3,
        statement: 'Que ley explica que un cuerpo mantiene su estado de reposo o movimiento si no actua una fuerza neta?',
        points: 10,
        correctAnswer: 'Primera ley de Newton'
      },
      {
        id: 4,
        statement: 'Si la masa es 4 kg y la aceleracion es 3 m/s2, cual es la fuerza resultante?',
        points: 10,
        correctAnswer: '12 N'
      }
    ]
  }
];
