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
