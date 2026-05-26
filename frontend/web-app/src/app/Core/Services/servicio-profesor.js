import { API_BASE_URL, authHeaders, post, request } from './api.js';

export function listClassrooms(userId) {
  return request(
    `${API_BASE_URL}/teacher/classrooms`,
    { headers: authHeaders(userId) },
    'No se pudieron cargar las aulas.'
  );
}

export function createClassroom(userId, data) {
  return post(`${API_BASE_URL}/teacher/classrooms`, data, 'No se pudo crear el aula.', authHeaders(userId));
}

export function enrollStudent(userId, classroomId, studentId) {
  return request(
    `${API_BASE_URL}/teacher/classrooms/${classroomId}/students/${studentId}`,
    { method: 'POST', headers: authHeaders(userId) },
    'No se pudo inscribir al estudiante.'
  );
}

export function listStudents(userId) {
  return request(
    `${API_BASE_URL}/teacher/students`,
    { headers: authHeaders(userId) },
    'No se pudieron cargar los estudiantes.'
  );
}

export function listAvailableStudents(userId) {
  return request(
    `${API_BASE_URL}/teacher/students/available`,
    { headers: authHeaders(userId) },
    'No se pudieron cargar estudiantes disponibles.'
  );
}

export function getStudentDetail(userId, studentId) {
  return request(
    `${API_BASE_URL}/teacher/students/${studentId}`,
    { headers: authHeaders(userId) },
    'No se pudo cargar el detalle del estudiante.'
  );
}
