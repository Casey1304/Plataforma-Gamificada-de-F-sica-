/**
 * Rutas de la SPA. Equivalente a app.routes.ts del proyecto Angular de referencia.
 */
export const ROUTES = {
  AUTH: '/auth',
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',

  APP: '/app',
  APP_HOME: '/app/inicio',
  APP_CHALLENGES: '/app/retos',
  APP_ONBOARDING: '/app/onboarding',
  APP_ONBOARDING_SUMMARY: '/app/onboarding/resumen',
  APP_AI: '/app/ia',
  APP_PROGRESS: '/app/progreso',
  APP_RANKING: '/app/ranking',
  APP_NOTES: '/app/notas',
  APP_TEACHER: '/app/profesor',
  APP_ADMIN: '/app/admin'
};

/** Rutas antiguas → nuevas (sesiones guardadas antes del refactor) */
const LEGACY_PATH_MAP = {
  '/ingresar': ROUTES.AUTH_LOGIN,
  '/registro': ROUTES.AUTH_REGISTER,
  '/configuracion': ROUTES.APP_ONBOARDING,
  '/resumen-ruta': ROUTES.APP_ONBOARDING_SUMMARY,
  '/estudiante': ROUTES.APP,
  '/estudiante/inicio': ROUTES.APP_HOME,
  '/estudiante/retos': ROUTES.APP_CHALLENGES,
  '/estudiante/tutor-ia': ROUTES.APP_AI,
  '/estudiante/progreso': ROUTES.APP_PROGRESS,
  '/estudiante/ranking': ROUTES.APP_RANKING,
  '/estudiante/notas': ROUTES.APP_NOTES,
  '/profesor': ROUTES.APP_TEACHER,
  '/administrador': ROUTES.APP_ADMIN
};

const LEGACY_SCREEN_MAP = {
  login: ROUTES.AUTH_LOGIN,
  register: ROUTES.AUTH_REGISTER,
  onboarding: ROUTES.APP_ONBOARDING,
  summary: ROUTES.APP_ONBOARDING_SUMMARY,
  dashboard: ROUTES.APP_CHALLENGES,
  'teacher-dashboard': ROUTES.APP_TEACHER,
  'admin-dashboard': ROUTES.APP_ADMIN
};

export function legacyPathToRoute(value) {
  if (!value) {
    return null;
  }
  if (LEGACY_PATH_MAP[value]) {
    return LEGACY_PATH_MAP[value];
  }
  return LEGACY_SCREEN_MAP[value] ?? null;
}

export function initialRouteByRole(role, onboardingComplete) {
  if (role === 'profesor') {
    return ROUTES.APP_TEACHER;
  }
  if (role === 'administrador') {
    return ROUTES.APP_ADMIN;
  }
  if (!onboardingComplete) {
    return ROUTES.APP_ONBOARDING;
  }
  return ROUTES.APP_HOME;
}
