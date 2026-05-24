const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export async function getChallenges() {
  const response = await fetch(`${API_BASE_URL}/challenges`);
  if (!response.ok) {
    throw new Error('No se pudieron cargar los retos.');
  }
  return response.json();
}

export async function createAttempt(studentId, challengeId) {
  const response = await fetch(`${API_BASE_URL}/attempts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, challengeId })
  });
  if (!response.ok) {
    throw new Error('No se pudo iniciar el intento.');
  }
  return response.json();
}

export async function submitAnswer(attemptId, payload) {
  const response = await fetch(`${API_BASE_URL}/attempts/${attemptId}/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error('No se pudo registrar la respuesta.');
  }
  return response.json();
}

export async function getProgress(studentId) {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}/progress`);
  if (!response.ok) {
    throw new Error('No se pudo consultar el progreso.');
  }
  return response.json();
}

export async function getGamification(studentId) {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}/gamification`);
  if (!response.ok) {
    throw new Error('No se pudo consultar la gamificacion.');
  }
  return response.json();
}

export async function getAiInsights(studentId) {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}/ai-insights`);
  if (!response.ok) {
    throw new Error('No se pudieron consultar las analiticas de IA.');
  }
  return response.json();
}

export async function generatePersonalizedExercises(studentId) {
  const response = await fetch(`${API_BASE_URL}/ai/personalized-exercises`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId })
  });
  if (!response.ok) {
    throw new Error('No se pudieron generar ejercicios personalizados.');
  }
  return response.json();
}

export async function requestPredictiveAnalysis(payload) {
  const response = await fetch(`${API_BASE_URL}/ai/predictive-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error('No se pudo generar el analisis predictivo con IA.');
  }
  return response.json();
}
