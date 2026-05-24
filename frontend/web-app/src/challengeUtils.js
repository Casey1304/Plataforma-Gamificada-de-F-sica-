export function formatTimer(seconds) {
  const safe = Math.max(0, seconds ?? 0);
  const minutes = Math.floor(safe / 60);
  const remainder = safe % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

export function mapAiInsights(insights) {
  const rawSeconds =
    insights?.averageTimeSeconds != null ? Number(insights.averageTimeSeconds) : null;
  let tiempoPromedio = 'Sin datos';
  if (rawSeconds != null && !Number.isNaN(rawSeconds)) {
    const minutes = Math.floor(rawSeconds / 60);
    const seconds = Math.round(rawSeconds % 60);
    tiempoPromedio = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

  return {
    tiempoPromedio,
    tiempoPromedioSegundos: rawSeconds,
    intentosFallidos: insights?.failedAttempts ?? 0,
    temaMasErrores: insights?.weakestTopic ?? 'Sin datos aún',
    totalIntentos: insights?.totalAttempts ?? 0,
    totalRespuestas: insights?.totalAnswers ?? 0,
    respuestasCorrectas: insights?.correctAnswers ?? 0,
    precision: insights?.performancePercent ?? 0
  };
}

export function mapInsightsToPrediction(insights) {
  const temasDificiles = insights?.predictedDifficultTopics ?? [];
  const patrones = insights?.frequentErrorPatterns ?? [];

  return {
    alerta: insights?.diagnosis ?? 'Completa retos para activar el análisis predictivo.',
    tendencia: insights?.learningRouteSuggestion ?? 'La ruta se ajustará según tus resultados.',
    probabilidadAprobacion: insights?.examPassProbabilityPercent ?? null,
    temasDificiles,
    patronesError: patrones,
    fuentesDatos:
      insights?.dataSourcesAnalyzed ??
      'Retos, respuestas, tiempos, progreso por tema y recomendaciones de refuerzo.'
  };
}

export function buildChallengeFromPersonalized(exercise) {
  if (!exercise) {
    return null;
  }

  const correctAnswer = exercise.expectedAnswer ?? exercise.correctAnswer;
  const payload = {
    correctAnswer,
    explanation: exercise.hint ?? exercise.explanation ?? '',
    visualType: /ley/i.test(correctAnswer ?? '') ? 'newton_laws_concept' : 'newton_block_vector'
  };
  const diagram = inferDiagram(payload);

  return {
    id: `personalized-${Date.now()}`,
    challengeId: null,
    exerciseId: null,
    title: `Refuerzo: ${exercise.topic ?? 'Física'}`,
    badge: 'Personalizado',
    timer: '02:00',
    secondsLimit: 120,
    question: exercise.statement,
    correctAnswer,
    explanation: payload.explanation,
    formula: inferFormula(payload),
    options: exercise.options ?? [],
    showDiagram: diagram.showDiagram,
    massLabel: diagram.massLabel,
    vectorLabel: diagram.vectorLabel
  };
}

function inferDiagram(exercise) {
  if (exercise?.visualType === 'newton_laws_concept') {
    return { showDiagram: false, massLabel: 'Inercia', vectorLabel: 'Sin fuerza neta' };
  }

  const answer = (exercise?.correctAnswer ?? '').toLowerCase();
  if (answer.includes('12 n')) {
    return { showDiagram: true, massLabel: '4 kg', vectorLabel: 'a = 3 m/s2' };
  }
  if (answer.includes('15 n')) {
    return { showDiagram: true, massLabel: 'Fuerzas', vectorLabel: '20 N ↔ 5 N' };
  }
  return { showDiagram: true, massLabel: '10 kg', vectorLabel: 'a = 2 m/s2' };
}

function inferFormula(exercise) {
  const answer = exercise?.correctAnswer ?? '';
  if (/^\d+\s*N$/i.test(answer.trim())) {
    const value = answer.trim().split(/\s+/)[0];
    const diagram = inferDiagram(exercise);
    if (diagram.massLabel.endsWith('kg') && diagram.vectorLabel.includes('a =')) {
      const mass = diagram.massLabel.replace(/\D/g, '');
      const accel = diagram.vectorLabel.replace(/[^\d]/g, '');
      return `F = ${mass} kg × ${accel} m/s² = ${value} N`;
    }
    return `Respuesta: ${answer}`;
  }
  if (answer.toLowerCase().includes('primera ley')) {
    return 'La primera ley describe la inercia de los cuerpos.';
  }
  if (answer.toLowerCase().includes('f =')) {
    return 'La segunda ley: F = m × a.';
  }
  return exercise?.explanation ?? 'Revisa el concepto antes del siguiente intento.';
}

export function buildChallengeFromApi(apiChallenge, exerciseIndex = 0) {
  const exercises = apiChallenge?.exercises ?? [];
  const exercise = exercises[exerciseIndex];
  if (!apiChallenge || !exercise) {
    return null;
  }

  const diagram = inferDiagram(exercise);
  const total = exercises.length;

  return {
    id: `bd-${apiChallenge.id}-${exercise.id}`,
    challengeId: apiChallenge.id,
    exerciseId: exercise.id,
    exerciseIndex,
    totalExercises: total,
    title: apiChallenge.title,
    badge: `Pregunta ${exerciseIndex + 1} de ${total}`,
    timer: formatTimer(apiChallenge.timeLimitSeconds ?? 420),
    secondsLimit: apiChallenge.timeLimitSeconds ?? 420,
    question: exercise.statement,
    correctAnswer: exercise.correctAnswer,
    explanation: exercise.explanation ?? '',
    formula: inferFormula(exercise),
    options: exercise.options ?? [],
    showDiagram: diagram.showDiagram,
    massLabel: diagram.massLabel,
    vectorLabel: diagram.vectorLabel
  };
}

export function buildChallengeFromPrediction(nextCustomChallenge, fallback) {
  if (!nextCustomChallenge) {
    return { ...fallback, challengeId: null, exerciseId: null };
  }

  const options = nextCustomChallenge.opciones
    ? [
        nextCustomChallenge.opciones.A,
        nextCustomChallenge.opciones.B,
        nextCustomChallenge.opciones.C,
        nextCustomChallenge.opciones.D
      ].filter(Boolean)
    : fallback.options;

  const correctAnswer = nextCustomChallenge.respuestaCorrecta ?? fallback.correctAnswer;
  const exercise = {
    correctAnswer,
    explanation: 'La IA generó este reto según tus patrones de error.',
    visualType: /ley/i.test(correctAnswer) ? 'newton_laws_concept' : 'newton_block_vector'
  };
  const diagram = inferDiagram(exercise);

  return {
    ...fallback,
    id: `ai-${Date.now()}`,
    challengeId: null,
    exerciseId: null,
    title: 'Reto IA: Nivelación predictiva',
    badge: 'IA educativa',
    timer: '02:00',
    secondsLimit: 120,
    question: nextCustomChallenge.pregunta ?? fallback.question,
    formula: inferFormula(exercise),
    explanation: exercise.explanation,
    correctAnswer,
    options: options.length === 4 ? options : fallback.options,
    showDiagram: diagram.showDiagram,
    massLabel: diagram.massLabel,
    vectorLabel: diagram.vectorLabel
  };
}

export function answersMatch(selected, expected) {
  const normalize = (value) =>
    (value ?? '')
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/×/g, '*')
      .trim();
  return normalize(selected) === normalize(expected);
}
