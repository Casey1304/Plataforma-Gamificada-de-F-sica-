import { ROUTES } from './rutas.js';

/**
 * Edita este archivo para cambiar la barra lateral izquierda del estudiante.
 *
 * Cada objeto pinta un boton en Layout/Components/barra-lateral/barra-lateral.jsx.
 * Si agregas un boton nuevo, agrega tambien su ruta en Modules/Estudiante/estudiante.routes.jsx.
 *
 * Campos:
 * - id: identificador interno unico.
 * - label: texto visible en el menu.
 * - path: ruta a la que navega.
 * - icon: nombre disponible en Shared/Components/iconos/iconos.jsx > NavIcon.
 * - description: texto de ayuda para accesibilidad y tooltip.
 */
export const STUDENT_NAV_LINKS = [
  {
    id: 'inicio',
    label: 'Inicio',
    path: ROUTES.APP_HOME,
    icon: 'inicio',
    description: 'Pantalla de bienvenida y accesos rapidos'
  },
  {
    id: 'retos',
    label: 'Retos',
    path: ROUTES.APP_CHALLENGES,
    icon: 'retos',
    description: 'Resolver ejercicios de fisica y ganar XP'
  },
  {
    id: 'ia',
    label: 'Tutor IA',
    path: ROUTES.APP_AI,
    icon: 'ia',
    description: 'Recomendaciones y ejercicios personalizados con IA'
  },
  {
    id: 'progreso',
    label: 'Progreso',
    path: ROUTES.APP_PROGRESS,
    icon: 'progreso',
    description: 'Estadisticas de aprendizaje por tema'
  },
  {
    id: 'ranking',
    label: 'Ranking',
    path: ROUTES.APP_RANKING,
    icon: 'ranking',
    description: 'Clasificacion por XP, gemas y racha'
  },
  {
    id: 'notas',
    label: 'Notas',
    path: ROUTES.APP_NOTES,
    icon: 'notas',
    description: 'Apuntes personales guardados en el navegador'
  }
  
];

export const LOGOUT_NAV_ACTION = {
  id: 'salir',
  label: 'Cerrar sesion',
  icon: 'salir',
  description: 'Cierra la sesion y vuelve al login'
};
