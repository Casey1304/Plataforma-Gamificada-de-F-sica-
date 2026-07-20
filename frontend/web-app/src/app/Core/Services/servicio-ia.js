import { API_BASE_URL, authHeaders, get, post } from './api.js';

export function getAiInsights(studentId) {
  return get(
    `${API_BASE_URL}/students/${studentId}/ai-insights`,
    'No se pudieron consultar las analíticas de IA.'
  );
}

export function generatePersonalizedExercises(studentId) {
  return post(
    `${API_BASE_URL}/ai/personalized-exercises`,
    { studentId },
    'No se pudieron generar ejercicios personalizados.'
  );
}

export function requestPredictiveAnalysis(payload) {
  return post(
    `${API_BASE_URL}/ai/predictive-analysis`,
    payload,
    'No se pudo generar el análisis predictivo con IA.'
  );
}

export function askConnor(userId, pregunta, contextoReciente = []) {
  return post(
    `${API_BASE_URL}/tutor-ia/connor/chat`,
    { pregunta, contextoReciente },
    'Connor no pudo responder en este momento.',
    authHeaders(userId)
  );
}
