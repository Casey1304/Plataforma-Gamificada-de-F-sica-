export function mensajePasoActual(challenge) {
  if (challenge?.badge) {
    return `Estás en: ${challenge.badge}`;
  }
  return 'Paso 1: lee la pregunta y elige una respuesta.';
}

export function feedbackRevisando() {
  return {
    checking: true,
    title: 'Revisando tu respuesta…',
    body: 'Un momentito. Estamos viendo si tu opción es correcta.',
    formula: '',
    xp: 0,
    gems: 0
  };
}

export function feedbackMisionCompletada(challengeTitle) {
  return {
    missionComplete: true,
    correct: true,
    title: '¡Felicitaciones! Completaste la misión',
    body: `¡Lo hiciste muy bien en "${challengeTitle}"! Ya no hay más ejercicios nuevos en esta misión, pero puedes practicar otra vez los mismos o pedir un reto extra con IA.`,
    formula: 'Sigue practicando para ganar más XP y gemas.',
    xp: 0,
    gems: 0,
    canAdvance: false
  };
}

export function feedbackDesdeResultado(resultado, challenge, retoApi) {
  const indice = challenge.exerciseIndex ?? 0;
  const total = retoApi?.exercises?.length ?? challenge.totalExercises ?? 1;
  const esUltimo = indice + 1 >= total;

  if (resultado.correct && esUltimo) {
    return feedbackMisionCompletada(challenge.title);
  }

  return {
    checking: false,
    correct: resultado.correct,
    title: resultado.correct ? '¡Correcto!' : 'Todavía no es esa',
    body: resultado.feedback ?? resultado.body,
    formula: resultado.correct ? challenge.formula : 'Pista: revisa el enunciado con calma.',
    xp: resultado.earnedXp ?? resultado.xp ?? 0,
    gems: resultado.earnedGems ?? resultado.gems ?? 0,
    fromGemini: resultado.feedbackFromGemini ?? false,
    canAdvance: resultado.correct && !esUltimo,
    missionComplete: false
  };
}

export function feedbackLocal(correct, challenge, retoApi) {
  const indice = challenge.exerciseIndex ?? 0;
  const total = retoApi?.exercises?.length ?? challenge.totalExercises ?? 1;
  if (correct && indice + 1 >= total) {
    return feedbackMisionCompletada(challenge.title);
  }

  const fake = {
    correct,
    feedback: correct
      ? challenge.explanation || '¡Buen trabajo!'
      : 'Revisa el concepto e inténtalo otra vez.',
    earnedXp: correct ? 50 : 0,
    earnedGems: correct ? 10 : 0,
    feedbackFromGemini: false
  };
  return feedbackDesdeResultado(fake, challenge, retoApi);
}
