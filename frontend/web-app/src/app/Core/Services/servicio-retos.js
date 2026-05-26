import { API_BASE_URL, get, post } from './api.js';

export function getChallenges() {
  return get(`${API_BASE_URL}/challenges`, 'No se pudieron cargar los retos.');
}

export function createAttempt(studentId, challengeId) {
  return post(
    `${API_BASE_URL}/attempts`,
    { studentId, challengeId },
    'No se pudo iniciar el intento.'
  );
}

export function submitAnswer(attemptId, payload) {
  return post(
    `${API_BASE_URL}/attempts/${attemptId}/answers`,
    payload,
    'No se pudo registrar la respuesta.'
  );
}

export function getProgress(studentId) {
  return get(`${API_BASE_URL}/students/${studentId}/progress`, 'No se pudo consultar el progreso.');
}

export function getRecommendations(studentId) {
  return get(
    `${API_BASE_URL}/students/${studentId}/recommendations`,
    'No se pudieron consultar las recomendaciones.'
  );
}

export function getGamification(studentId) {
  return get(
    `${API_BASE_URL}/students/${studentId}/gamification`,
    'No se pudo consultar la gamificación.'
  );
}
