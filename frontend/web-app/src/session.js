const STORAGE_KEY = 'physicsplay_session';

export function usuarioDesdeApi(usuarioAutenticado) {
  return {
    usuarioId: usuarioAutenticado.usuarioId,
    estudianteId: usuarioAutenticado.estudianteId ?? null,
    nombreCompleto: usuarioAutenticado.nombreCompleto ?? '',
    correoElectronico: usuarioAutenticado.correoElectronico ?? '',
    rol: usuarioAutenticado.rol ?? 'estudiante',
    nivel: usuarioAutenticado.nivel ?? 1,
    xp: usuarioAutenticado.xp ?? 0,
    gemas: usuarioAutenticado.gemas ?? 0,
    rachaActual: usuarioAutenticado.rachaActual ?? 0
  };
}

export function usuarioAEstadoApp(usuarioGuardado) {
  if (!usuarioGuardado?.usuarioId) {
    return null;
  }

  return {
    userId: usuarioGuardado.usuarioId,
    studentId: usuarioGuardado.estudianteId,
    name: usuarioGuardado.nombreCompleto || 'Estudiante PhysicsPlay',
    email: usuarioGuardado.correoElectronico || '',
    role: usuarioGuardado.rol || 'estudiante',
    level: usuarioGuardado.nivel ?? 1,
    xp: usuarioGuardado.xp ?? 0,
    gems: usuarioGuardado.gemas ?? 0,
    streak: usuarioGuardado.rachaActual ?? 0,
    precision: 0,
    levelProgress: 0
  };
}

function pantallaPorRol(rol, onboardingCompleto) {
  if (rol === 'profesor') {
    return 'teacher-dashboard';
  }
  if (rol === 'administrador') {
    return 'admin-dashboard';
  }
  return onboardingCompleto ? 'dashboard' : 'onboarding';
}

export function leerSesionGuardada() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed?.usuario?.usuarioId) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function leerEstadoInicialApp() {
  const sesion = leerSesionGuardada();
  if (!sesion) {
    return { screen: 'login', user: null, onboardingCompleto: false };
  }

  return {
    screen: sesion.screen ?? pantallaPorRol(sesion.usuario.rol, sesion.onboardingCompleto),
    user: usuarioAEstadoApp(sesion.usuario),
    onboardingCompleto: Boolean(sesion.onboardingCompleto)
  };
}

export function guardarSesion({ usuarioAutenticado, screen, onboardingCompleto, recordar = true }) {
  if (!usuarioAutenticado?.usuarioId) {
    return;
  }

  const payload = {
    usuario: usuarioDesdeApi(usuarioAutenticado),
    screen: screen ?? pantallaPorRol(usuarioAutenticado.rol, onboardingCompleto),
    onboardingCompleto: Boolean(onboardingCompleto),
    guardadoEn: new Date().toISOString()
  };

  const serialized = JSON.stringify(payload);
  if (recordar) {
    window.localStorage.setItem(STORAGE_KEY, serialized);
    window.sessionStorage.removeItem(STORAGE_KEY);
  } else {
    window.sessionStorage.setItem(STORAGE_KEY, serialized);
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function actualizarPantallaSesion(screen, onboardingCompleto) {
  const sesion = leerSesionGuardada();
  if (!sesion) {
    return;
  }

  const serialized = JSON.stringify({
    ...sesion,
    screen,
    onboardingCompleto: onboardingCompleto ?? sesion.onboardingCompleto
  });

  if (window.localStorage.getItem(STORAGE_KEY)) {
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } else {
    window.sessionStorage.setItem(STORAGE_KEY, serialized);
  }
}

export function limpiarSesion() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(STORAGE_KEY);
}
