export function construirResumenRuta(preferences) {
  const levels = {
    basico: 'Explorador',
    intermedio: 'Científico',
    avanzado: 'Maestro de la dinámica'
  };
  const styles = {
    visual: 'Visual',
    practico: 'Práctico',
    teorico: 'Teórico'
  };
  const focus = {
    aprobar: 'Ruta de exámenes',
    dominar: 'Dinámica avanzada',
    explorar: 'Laboratorio virtual'
  };

  return {
    level: levels[preferences.level],
    style: `${styles[preferences.style]} / ${preferences.support === 'paso-a-paso' ? 'Guiado' : 'Adaptativo'}`,
    focusTag: focus[preferences.goal],
    description:
      preferences.goal === 'dominar'
        ? 'Dominarás fuerza, masa, aceleración y leyes de Newton mediante retos y simulaciones interactivas.'
        : 'Tu ruta combinará teoría, práctica y retroalimentación inmediata según tus preferencias.',
    missions: preferences.pace === 'intensivo' ? 16 : 12,
    labs: preferences.style === 'visual' ? 5 : 4,
    weeks: preferences.pace === 'ligero' ? 4 : 3
  };
}
