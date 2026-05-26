export const pasosOnboarding = [
  {
    key: 'level',
    eyebrow: 'Paso 1 de 5',
    title: 'Personaliza tu experiencia',
    description: 'Ayúdanos a calibrar los experimentos y desafíos según tus conocimientos previos de física.',
    options: [
      { id: 'basico', icon: 'basico', title: 'Básico', tag: 'Explorador', body: 'Ideal si estás empezando o quieres repasar fundamentos desde cero.' },
      { id: 'intermedio', icon: 'intermedio', title: 'Intermedio', tag: 'Científico', body: 'Ya conoces leyes básicas y buscas resolver problemas dinámicos.' },
      { id: 'avanzado', icon: 'avanzado', title: 'Avanzado', tag: 'Maestro', body: 'Estás listo para desafíos complejos y análisis más profundo.' }
    ]
  },
  {
    key: 'style',
    eyebrow: 'Paso 2 de 5',
    title: 'Elige tu estilo de aprendizaje',
    description: 'La plataforma ajustará la ruta, ejemplos y retroalimentación a tu forma favorita de aprender.',
    options: [
      { id: 'visual', icon: 'visual', title: 'Visual', tag: 'Simulaciones', body: 'Prefieres diagramas, animaciones y escenas para entender conceptos.' },
      { id: 'practico', icon: 'practico', title: 'Práctico', tag: 'Retos', body: 'Aprendes mejor resolviendo ejercicios y recibiendo retroalimentación inmediata.' },
      { id: 'teorico', icon: 'teorico', title: 'Teórico', tag: 'Conceptos', body: 'Quieres explicaciones ordenadas antes de pasar a los ejercicios.' }
    ]
  },
  {
    key: 'goal',
    eyebrow: 'Paso 3 de 5',
    title: 'Define tu meta académica',
    description: 'Esto ayuda a priorizar contenidos, dificultad y recomendaciones de IA.',
    options: [
      { id: 'aprobar', icon: 'aprobar', title: 'Aprobar evaluaciones', tag: 'Enfoque', body: 'Ruta orientada a exámenes, fórmulas clave y práctica frecuente.' },
      { id: 'dominar', icon: 'dominar', title: 'Dominar dinámica', tag: 'Dominio', body: 'Más ejercicios sobre fuerza, masa, aceleración y leyes de Newton.' },
      { id: 'explorar', icon: 'explorar', title: 'Explorar laboratorios', tag: 'Curiosidad', body: 'Más simulaciones y retos conectados con situaciones reales.' }
    ]
  },
  {
    key: 'pace',
    eyebrow: 'Paso 4 de 5',
    title: 'Escoge tu ritmo',
    description: 'Tu avance diario será realista para mantener motivación y constancia.',
    options: [
      { id: 'ligero', icon: 'ligero', title: '10 minutos al día', tag: 'Ligero', body: 'Microretos para mantener racha sin saturarte.' },
      { id: 'constante', icon: 'constante', title: '20 minutos al día', tag: 'Constante', body: 'Equilibrio entre teoría, ejercicios y retroalimentación.' },
      { id: 'intensivo', icon: 'intensivo', title: '30 minutos al día', tag: 'Intensivo', body: 'Ruta rápida con más misiones, laboratorios y refuerzo con IA.' }
    ]
  },
  {
    key: 'support',
    eyebrow: 'Paso 5 de 5',
    title: 'Cómo quieres que te apoye la IA',
    description: 'PhysicsPlay detectará patrones de error y recomendará actividades personalizadas.',
    options: [
      { id: 'pistas', icon: 'pistas', title: 'Pistas graduales', tag: 'Guía', body: 'Primero recibes pistas antes de mostrar la solución completa.' },
      { id: 'paso-a-paso', icon: 'paso-a-paso', title: 'Explicación paso a paso', tag: 'Tutor IA', body: 'La IA descompone fórmulas y razonamiento después de cada intento.' },
      { id: 'refuerzo', icon: 'refuerzo', title: 'Refuerzo automático', tag: 'Adaptativo', body: 'Se generan ejercicios extra cuando hay errores frecuentes.' }
    ]
  }
];
