import { API_BASE_URL, authHeaders, post, put, request } from './api.js';
import { ROUTES, legacyPathToRoute, initialRouteByRole } from '../Models/rutas.js';

const STORAGE_KEY = 'physicsplay_session';

export function mapApiUserToStorage(apiUser) {
  return {
    usuarioId: apiUser.usuarioId,
    estudianteId: apiUser.estudianteId ?? null,
    nombreCompleto: apiUser.nombreCompleto ?? '',
    correoElectronico: apiUser.correoElectronico ?? '',
    rol: apiUser.rol ?? 'estudiante',
    nivel: apiUser.nivel ?? 1,
    xp: apiUser.xp ?? 0,
    gemas: apiUser.gemas ?? 0,
    rachaActual: apiUser.rachaActual ?? 0
  };
}

export function mapStorageUserToApp(stored) {
  if (!stored?.usuarioId) {
    return null;
  }
  return {
    userId: stored.usuarioId,
    studentId: stored.estudianteId,
    name: stored.nombreCompleto || 'Estudiante PhysicsPlay',
    email: stored.correoElectronico || '',
    role: stored.rol || 'estudiante',
    level: stored.nivel ?? 1,
    xp: stored.xp ?? 0,
    gems: stored.gemas ?? 0,
    streak: stored.rachaActual ?? 0,
    precision: 0,
    levelProgress: 0
  };
}

export function readStoredSession() {
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ?? window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed?.usuario?.usuarioId ? parsed : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(readStoredSession()?.usuario?.usuarioId);
}

export function readInitialAppState() {
  const session = readStoredSession();
  if (!session) {
    return { pathname: null, user: null, onboardingComplete: false };
  }

  const onboardingComplete = Boolean(session.onboardingComplete ?? session.onboardingCompleto);
  const pathname =
    normalizePathname(session.pathname) ??
    legacyPathToRoute(session.screen) ??
    initialRouteByRole(session.usuario.rol, onboardingComplete);

  return {
    pathname,
    user: mapStorageUserToApp(session.usuario),
    onboardingComplete
  };
}

export function normalizePathname(pathname) {
  if (!pathname) {
    return null;
  }
  return legacyPathToRoute(pathname) ?? pathname;
}

export function saveSession({
  usuarioAutenticado,
  pathname,
  screen,
  onboardingComplete,
  onboardingCompleto,
  recordar,
  remember = true
}) {
  if (!usuarioAutenticado?.usuarioId) {
    return;
  }

  const onboardingReady = Boolean(onboardingComplete ?? onboardingCompleto);
  const route =
    normalizePathname(pathname) ??
    (screen ? legacyPathToRoute(screen) : null) ??
    initialRouteByRole(usuarioAutenticado.rol, onboardingReady);

  const payload = {
    usuario: mapApiUserToStorage(usuarioAutenticado),
    pathname: route,
    screen: screen ?? null,
    onboardingComplete: onboardingReady,
    onboardingCompleto: onboardingReady,
    guardadoEn: new Date().toISOString()
  };

  const serialized = JSON.stringify(payload);
  const shouldRemember = recordar ?? remember;
  if (shouldRemember) {
    window.localStorage.setItem(STORAGE_KEY, serialized);
    window.sessionStorage.removeItem(STORAGE_KEY);
  } else {
    window.sessionStorage.setItem(STORAGE_KEY, serialized);
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function updateSessionPath(pathname, onboardingComplete) {
  const session = readStoredSession();
  if (!session) {
    return;
  }
  const onboardingReady = onboardingComplete ?? session.onboardingComplete ?? session.onboardingCompleto;

  const serialized = JSON.stringify({
    ...session,
    pathname: normalizePathname(pathname) ?? pathname,
    onboardingComplete: Boolean(onboardingReady),
    onboardingCompleto: Boolean(onboardingReady)
  });

  if (window.localStorage.getItem(STORAGE_KEY)) {
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } else {
    window.sessionStorage.setItem(STORAGE_KEY, serialized);
  }
}

export function clearSession() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export async function login(credentials) {
  return post(`${API_BASE_URL}/auth/login`, credentials, 'No se pudo iniciar sesión.');
}

export async function registerStudent(payload) {
  return post(`${API_BASE_URL}/auth/registro`, payload, 'No se pudo crear la cuenta de estudiante.');
}

export async function getCurrentUser(userId) {
  return request(
    `${API_BASE_URL}/auth/sesion`,
    { headers: authHeaders(userId) },
    'No se pudo restaurar la sesión.'
  );
}

export async function saveStudentPreferences(userId, preferences) {
  return put(
    `${API_BASE_URL}/auth/preferencias`,
    {
      nivelConocimiento: preferences.level,
      estiloAprendizaje: preferences.style,
      metaAprendizaje: preferences.goal,
      ritmoDiario: preferences.pace,
      modoApoyoIa: preferences.support
    },
    'No se pudieron guardar las preferencias.',
    authHeaders(userId)
  );
}

export const PUBLIC_ROUTES = new Set([ROUTES.AUTH_LOGIN, ROUTES.AUTH_REGISTER]);
