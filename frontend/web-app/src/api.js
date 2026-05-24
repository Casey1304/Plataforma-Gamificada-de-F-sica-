const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

function authHeaders(userId) {
  return {
    'Content-Type': 'application/json',
    'X-User-Id': String(userId)
  };
}

async function parseResponse(response, fallbackMessage) {
  if (!response.ok) {
    let message = fallbackMessage;
    const contentType = response.headers.get('content-type') ?? '';

    try {
      if (contentType.includes('application/json')) {
        const error = await response.json();
        message =
          error.message ??
          error.detail ??
          error.error ??
          error.title ??
          (Array.isArray(error.errors) ? error.errors[0] : null) ??
          fallbackMessage;
      } else {
        const text = await response.text();
        if (text) {
          message = text.length > 240 ? `${text.slice(0, 240)}…` : text;
        }
      }
    } catch {
      message = `${fallbackMessage} (código HTTP ${response.status})`;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function request(url, options, fallbackMessage) {
  try {
    const response = await fetch(url, options);
    return parseResponse(response, fallbackMessage);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'No se pudo conectar con el servidor. Comprueba que el backend esté en ejecución (puerto 8080) y que la base de datos en Supabase esté configurada.'
      );
    }
    throw error;
  }
}

export async function registrarEstudiante({ nombreCompleto, correoElectronico, contrasena }) {
  return request(
    `${API_BASE_URL}/auth/registro`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombreCompleto, correoElectronico, contrasena })
    },
    'No se pudo crear la cuenta de estudiante.'
  );
}

export async function guardarPreferenciasEstudiante(userId, preferencias) {
  return request(
    `${API_BASE_URL}/auth/preferencias`,
    {
      method: 'PUT',
      headers: authHeaders(userId),
      body: JSON.stringify({
        nivelConocimiento: preferencias.level,
        estiloAprendizaje: preferencias.style,
        metaAprendizaje: preferencias.goal,
        ritmoDiario: preferencias.pace,
        modoApoyoIa: preferencias.support
      })
    },
    'No se pudieron guardar las preferencias.'
  );
}

export async function iniciarSesion(credenciales) {
  return request(
    `${API_BASE_URL}/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credenciales)
    },
    'No se pudo iniciar sesión.'
  );
}

export async function obtenerSesionActual(userId) {
  return request(
    `${API_BASE_URL}/auth/sesion`,
    { headers: authHeaders(userId) },
    'No se pudo restaurar la sesión.'
  );
}

export async function getChallenges() {
  return request(`${API_BASE_URL}/challenges`, {}, 'No se pudieron cargar los retos.');
}

export async function createAttempt(studentId, challengeId) {
  return request(
    `${API_BASE_URL}/attempts`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, challengeId })
    },
    'No se pudo iniciar el intento.'
  );
}

export async function submitAnswer(attemptId, payload) {
  return request(
    `${API_BASE_URL}/attempts/${attemptId}/answers`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    },
    'No se pudo registrar la respuesta.'
  );
}

export async function getProgress(studentId) {
  return request(`${API_BASE_URL}/students/${studentId}/progress`, {}, 'No se pudo consultar el progreso.');
}

export async function getGamification(studentId) {
  return request(
    `${API_BASE_URL}/students/${studentId}/gamification`,
    {},
    'No se pudo consultar la gamificación.'
  );
}

export async function getAiInsights(studentId) {
  return request(
    `${API_BASE_URL}/students/${studentId}/ai-insights`,
    {},
    'No se pudieron consultar las analíticas de IA.'
  );
}

export async function generatePersonalizedExercises(studentId) {
  return request(
    `${API_BASE_URL}/ai/personalized-exercises`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId })
    },
    'No se pudieron generar ejercicios personalizados.'
  );
}

export async function requestPredictiveAnalysis(payload) {
  return request(
    `${API_BASE_URL}/ai/predictive-analysis`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    },
    'No se pudo generar el análisis predictivo con IA.'
  );
}

export async function listarAulasProfesor(userId) {
  return request(`${API_BASE_URL}/teacher/classrooms`, { headers: authHeaders(userId) }, 'No se pudieron cargar las aulas.');
}

export async function crearAulaProfesor(userId, datos) {
  return request(
    `${API_BASE_URL}/teacher/classrooms`,
    {
      method: 'POST',
      headers: authHeaders(userId),
      body: JSON.stringify(datos)
    },
    'No se pudo crear el aula.'
  );
}

export async function inscribirEstudianteAula(userId, classroomId, studentId) {
  return request(
    `${API_BASE_URL}/teacher/classrooms/${classroomId}/students/${studentId}`,
    { method: 'POST', headers: authHeaders(userId) },
    'No se pudo inscribir al estudiante.'
  );
}

export async function listarEstudiantesProfesor(userId) {
  return request(`${API_BASE_URL}/teacher/students`, { headers: authHeaders(userId) }, 'No se pudieron cargar los estudiantes.');
}

export async function listarEstudiantesDisponiblesProfesor(userId) {
  return request(
    `${API_BASE_URL}/teacher/students/available`,
    { headers: authHeaders(userId) },
    'No se pudieron cargar estudiantes disponibles.'
  );
}

export async function detalleEstudianteProfesor(userId, studentId) {
  return request(
    `${API_BASE_URL}/teacher/students/${studentId}`,
    { headers: authHeaders(userId) },
    'No se pudo cargar el detalle del estudiante.'
  );
}

export async function listarUsuariosAdmin(userId) {
  return request(`${API_BASE_URL}/admin/users`, { headers: authHeaders(userId) }, 'No se pudieron cargar los usuarios.');
}

export async function crearUsuarioAdmin(userId, datos) {
  return request(
    `${API_BASE_URL}/admin/users`,
    {
      method: 'POST',
      headers: authHeaders(userId),
      body: JSON.stringify(datos)
    },
    'No se pudo crear el usuario.'
  );
}

export async function actualizarUsuarioAdmin(userId, targetUserId, datos) {
  return request(
    `${API_BASE_URL}/admin/users/${targetUserId}`,
    {
      method: 'PATCH',
      headers: authHeaders(userId),
      body: JSON.stringify(datos)
    },
    'No se pudo actualizar el usuario.'
  );
}

export async function listarEstudiantesAdmin(userId) {
  return request(`${API_BASE_URL}/admin/students`, { headers: authHeaders(userId) }, 'No se pudieron cargar los estudiantes.');
}

export async function detalleEstudianteAdmin(userId, studentId) {
  return request(
    `${API_BASE_URL}/admin/students/${studentId}`,
    { headers: authHeaders(userId) },
    'No se pudo cargar el detalle del estudiante.'
  );
}
