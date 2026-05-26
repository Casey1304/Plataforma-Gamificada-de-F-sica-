import { API_BASE_URL, get, post } from './api.js';

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
