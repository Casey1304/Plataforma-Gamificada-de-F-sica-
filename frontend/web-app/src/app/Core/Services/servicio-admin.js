import { API_BASE_URL, authHeaders, post, patch, request } from './api.js';

export function listUsers(userId) {
  return request(
    `${API_BASE_URL}/admin/users`,
    { headers: authHeaders(userId) },
    'No se pudieron cargar los usuarios.'
  );
}

export function createUser(userId, data) {
  return post(`${API_BASE_URL}/admin/users`, data, 'No se pudo crear el usuario.', authHeaders(userId));
}

export function updateUser(userId, targetUserId, data) {
  return patch(
    `${API_BASE_URL}/admin/users/${targetUserId}`,
    data,
    'No se pudo actualizar el usuario.',
    authHeaders(userId)
  );
}

export function listStudents(userId) {
  return request(
    `${API_BASE_URL}/admin/students`,
    { headers: authHeaders(userId) },
    'No se pudieron cargar los estudiantes.'
  );
}

export function getStudentDetail(userId, studentId) {
  return request(
    `${API_BASE_URL}/admin/students/${studentId}`,
    { headers: authHeaders(userId) },
    'No se pudo cargar el detalle del estudiante.'
  );
}
