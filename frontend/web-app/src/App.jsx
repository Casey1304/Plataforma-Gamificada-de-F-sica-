import { useEffect, useMemo, useRef, useState } from 'react';
import {
  crearAulaProfesor,
  crearUsuarioAdmin,
  createAttempt,
  detalleEstudianteAdmin,
  detalleEstudianteProfesor,
  generatePersonalizedExercises,
  getAiInsights,
  getChallenges,
  getGamification,
  iniciarSesion,
  obtenerSesionActual,
  inscribirEstudianteAula,
  listarAulasProfesor,
  listarEstudiantesAdmin,
  listarEstudiantesDisponiblesProfesor,
  listarEstudiantesProfesor,
  listarUsuariosAdmin,
  actualizarUsuarioAdmin,
  guardarPreferenciasEstudiante,
  registrarEstudiante,
  requestPredictiveAnalysis,
  submitAnswer
} from './api.js';
import {
  answersMatch,
  buildChallengeFromApi,
  buildChallengeFromPersonalized,
  buildChallengeFromPrediction,
  formatTimer,
  mapAiInsights,
  mapInsightsToPrediction
} from './challengeUtils.js';
import {
  actualizarPantallaSesion,
  guardarSesion,
  leerEstadoInicialApp,
  limpiarSesion
} from './session.js';
import {
  feedbackDesdeResultado,
  feedbackLocal,
  feedbackMisionCompletada,
  feedbackRevisando,
  mensajePasoActual
} from './studentFeedback.js';
import {
  AdminIcon,
  AuthModeIcon,
  BrandLogo,
  CheckBadge,
  ClassroomIcon,
  FeedbackIcon,
  FieldIcon,
  MetricIcon,
  NAV_ITEMS,
  NavIcon,
  OptionIcon,
  PanelAiBadge,
  RouteFeatureIcons,
  TipIcon,
  UserAvatar
} from './components/Icons.jsx';

const onboardingSteps = [
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

const usuarioInicial = {
  userId: null,
  name: '',
  email: '',
  role: 'estudiante',
  studentId: null,
  level: 1,
  xp: 0,
  gems: 0,
  streak: 0,
  precision: 0,
  levelProgress: 0
};

const baseChallenge = {
  id: 'newton-base',
  title: 'Reto: Leyes de Newton',
  badge: 'Pregunta 1 de 1',
  secondsLimit: 90,
  timer: '01:30',
  showDiagram: true,
  question: 'Un cuerpo de 10 kg acelera a 2 m/s². ¿Cuál es la fuerza aplicada?',
  massLabel: '10 kg',
  vectorLabel: 'a = 2 m/s2',
  formula: 'F = 10 kg x 2 m/s2 = 20 N',
  explanation: 'La fuerza se calcula con la fórmula F = m × a.',
  correctAnswer: '20 N',
  options: ['5 N', '20 N', '50 N', '100 N']
};

const aiChallenge = {
  id: 'ai-force-boost',
  title: 'Reto IA: Fuerza y Aceleración',
  badge: 'Refuerzo generado',
  secondsLimit: 120,
  timer: '02:00',
  showDiagram: true,
  question: 'Un bloque de 6 kg acelera a 3 m/s². ¿Qué fuerza neta actúa sobre el bloque?',
  massLabel: '6 kg',
  vectorLabel: 'a = 3 m/s2',
  formula: 'F = 6 kg x 3 m/s2 = 18 N',
  explanation: 'La IA eligió un refuerzo directo: multiplicar masa por aceleración.',
  correctAnswer: '18 N',
  options: ['9 N', '18 N', '24 N', '36 N']
};

const suggestions = [
  'Practicar ejercicios básicos de fuerza.',
  'Revisar la fórmula F = m × a y su aplicación.',
  'Resolver reto de refuerzo: aceleración y fuerza.'
];

const defaultAnalytics = {
  tiempoPromedio: '1m 20s',
  intentosFallidos: 3,
  temaMasErrores: 'Fuerza y aceleración'
};

const defaultPrediction = {
  alerta: 'Se detectó dificultad en la segunda ley de Newton.',
  tendencia: 'Refuerza la relación entre masa, aceleración y fuerza antes de subir de nivel.'
};

function formatNumber(value) {
  return new Intl.NumberFormat('es-PE').format(value);
}

function optionLetter(index) {
  return String.fromCharCode(65 + index);
}

const estadoInicialApp = leerEstadoInicialApp();

function App() {
  const [screen, setScreen] = useState(estadoInicialApp.screen);
  const [user, setUser] = useState(estadoInicialApp.user ?? usuarioInicial);
  const [onboardingCompleto, setOnboardingCompleto] = useState(estadoInicialApp.onboardingCompleto);
  const [restaurandoSesion, setRestaurandoSesion] = useState(Boolean(estadoInicialApp.user?.userId));
  const [formularioAutenticacion, setFormularioAutenticacion] = useState({
    fullName: '',
    email: '',
    password: '',
    remember: true
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    level: 'intermedio',
    style: 'practico',
    goal: 'dominar',
    pace: 'constante',
    support: 'paso-a-paso'
  });
  const [stepIndex, setStepIndex] = useState(0);
  const [challenge, setChallenge] = useState(baseChallenge);
  const [retoApi, setRetoApi] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [mensajeSistema, setMensajeSistema] = useState('');
  const [intentoActualId, setIntentoActualId] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState(suggestions);
  const [analytics, setAnalytics] = useState(defaultAnalytics);
  const [prediction, setPrediction] = useState(defaultPrediction);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resolviendo, setResolviendo] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(baseChallenge.secondsLimit ?? 420);
  const feedbackRef = useRef(null);

  const currentStep = onboardingSteps[stepIndex];
  const routeSummary = useMemo(() => buildRouteSummary(preferences), [preferences]);

  useEffect(() => {
    async function refrescarSesionGuardada() {
      if (!estadoInicialApp.user?.userId) {
        setRestaurandoSesion(false);
        return;
      }

      try {
        const usuarioActualizado = await obtenerSesionActual(estadoInicialApp.user.userId);
        aplicarSesion(usuarioActualizado, {
          nuevaCuenta: !estadoInicialApp.onboardingCompleto,
          persistir: false,
          pantalla: estadoInicialApp.screen
        });
      } catch {
        limpiarSesion();
        setUser(usuarioInicial);
        setScreen('login');
      } finally {
        setRestaurandoSesion(false);
      }
    }

    refrescarSesionGuardada();
  }, []);

  useEffect(() => {
    if (!user.userId || screen === 'login' || screen === 'register') {
      return;
    }
    actualizarPantallaSesion(screen, onboardingCompleto);
  }, [screen, user.userId, onboardingCompleto]);

  function seleccionarRetoPrincipal(retos) {
    return (
      retos.find((reto) => reto.title.includes('Mision 2') && reto.title.includes('Newton')) ??
      retos.find((reto) => reto.title.includes('Newton')) ??
      retos[0]
    );
  }

  function aplicarReto(apiChallenge, exerciseIndex = 0) {
    const retoWeb = buildChallengeFromApi(apiChallenge, exerciseIndex) ?? baseChallenge;
    setRetoApi(apiChallenge);
    setChallenge(retoWeb);
    setSelectedAnswer('');
    setFeedback(null);
    setIntentoActualId(null);
    setSegundosRestantes(retoWeb.secondsLimit ?? 420);
  }

  useEffect(() => {
    if (screen !== 'dashboard') {
      return;
    }

    async function cargarPanelRetos() {
      try {
        const retos = await getChallenges();
        if (retos.length > 0) {
          aplicarReto(seleccionarRetoPrincipal(retos));
        }

        if (user.studentId) {
          const [gamification, insights] = await Promise.all([
            getGamification(user.studentId),
            getAiInsights(user.studentId)
          ]);

          setUser((current) => ({
            ...current,
            level: gamification.level ?? current.level,
            xp: gamification.xpTotal ?? current.xp,
            gems: gamification.gems ?? current.gems,
            streak: gamification.currentStreak ?? current.streak,
            levelProgress:
              gamification.xpForNextLevel > 0
                ? Math.round((gamification.xpForCurrentLevel * 100) / gamification.xpForNextLevel)
                : current.levelProgress
          }));

          setAnalytics(mapAiInsights(insights));
          setPrediction(mapInsightsToPrediction(insights));
          if (Array.isArray(insights?.suggestions) && insights.suggestions.length > 0) {
            setAiRecommendations(insights.suggestions);
          }
        }
      } catch (error) {
        setMensajeSistema(error.message);
      }
    }

    cargarPanelRetos();
  }, [screen, user.studentId]);

  useEffect(() => {
    if (screen !== 'dashboard' || !challenge.secondsLimit) {
      return undefined;
    }

    setSegundosRestantes(challenge.secondsLimit);
    const intervalId = window.setInterval(() => {
      setSegundosRestantes((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [screen, challenge.id, challenge.secondsLimit]);

  function enfocarRetroalimentacion() {
    window.requestAnimationFrame(() => {
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  useEffect(() => {
    if (feedback && !feedback.checking) {
      enfocarRetroalimentacion();
    }
  }, [feedback]);

  function updateAuthField(field, value) {
    setFormularioAutenticacion((current) => ({ ...current, [field]: value }));
  }

  function aplicarSesion(
    usuarioAutenticado,
    { nuevaCuenta = false, persistir = true, pantalla = null } = {}
  ) {
    const esEstudiante = usuarioAutenticado.rol === 'estudiante';
    const onboardingListo = esEstudiante ? !nuevaCuenta : true;
    let pantallaDestino = pantalla;

    if (!pantallaDestino) {
      if (usuarioAutenticado.rol === 'profesor') {
        pantallaDestino = 'teacher-dashboard';
      } else if (usuarioAutenticado.rol === 'administrador') {
        pantallaDestino = 'admin-dashboard';
      } else {
        pantallaDestino = nuevaCuenta ? 'onboarding' : 'dashboard';
      }
    }

    setUser((current) => ({
      ...current,
      userId: usuarioAutenticado.usuarioId,
      name: usuarioAutenticado.nombreCompleto || 'Estudiante PhysicsPlay',
      email: usuarioAutenticado.correoElectronico || '',
      role: usuarioAutenticado.rol,
      studentId: usuarioAutenticado.estudianteId,
      level: usuarioAutenticado.nivel ?? 1,
      xp: usuarioAutenticado.xp ?? 0,
      gems: usuarioAutenticado.gemas ?? 0,
      streak: usuarioAutenticado.rachaActual ?? 0,
      precision: current.precision ?? 0,
      levelProgress: current.levelProgress ?? 0
    }));

    setOnboardingCompleto(onboardingListo);
    setScreen(pantallaDestino);

    if (persistir) {
      guardarSesion({
        usuarioAutenticado,
        screen: pantallaDestino,
        onboardingCompleto: onboardingListo,
        recordar: formularioAutenticacion.remember !== false
      });
    }
  }

  function cerrarSesion() {
    limpiarSesion();
    setUser(usuarioInicial);
    setOnboardingCompleto(false);
    setFormularioAutenticacion({ fullName: '', email: '', password: '', remember: true });
    setStepIndex(0);
    setFeedback(null);
    setMensajeSistema('');
    setScreen('login');
  }

  async function registerUser(event) {
    event.preventDefault();
    setMensajeSistema('');
    setAuthLoading(true);
    try {
      const usuarioAutenticado = await registrarEstudiante({
        nombreCompleto: formularioAutenticacion.fullName.trim(),
        correoElectronico: formularioAutenticacion.email.trim(),
        contrasena: formularioAutenticacion.password
      });
      aplicarSesion(usuarioAutenticado, { nuevaCuenta: true });
    } catch (error) {
      setMensajeSistema(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function loginUser(event) {
    event.preventDefault();
    setMensajeSistema('');
    setAuthLoading(true);
    try {
      const usuarioAutenticado = await iniciarSesion({
        correoElectronico: formularioAutenticacion.email.trim(),
        contrasena: formularioAutenticacion.password
      });
      aplicarSesion(usuarioAutenticado);
    } catch (error) {
      setMensajeSistema(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function completarOnboarding() {
    setMensajeSistema('');
    setAuthLoading(true);
    try {
      await guardarPreferenciasEstudiante(user.userId, preferences);
      setOnboardingCompleto(true);
      setScreen('dashboard');
      guardarSesion({
        usuarioAutenticado: {
          usuarioId: user.userId,
          estudianteId: user.studentId,
          nombreCompleto: user.name,
          correoElectronico: user.email,
          rol: user.role,
          nivel: user.level,
          xp: user.xp,
          gemas: user.gems,
          rachaActual: user.streak
        },
        screen: 'dashboard',
        onboardingCompleto: true,
        recordar: formularioAutenticacion.remember !== false
      });
    } catch (error) {
      setMensajeSistema(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  function nextStep() {
    if (stepIndex < onboardingSteps.length - 1) {
      setStepIndex((current) => current + 1);
      return;
    }
    setScreen('summary');
  }

  function previousStep() {
    if (stepIndex > 0) {
      setStepIndex((current) => current - 1);
      return;
    }
    setScreen('register');
  }

  function avanzarSiguienteEjercicio() {
    if (!retoApi) {
      return;
    }
    const siguienteIndice = (challenge.exerciseIndex ?? 0) + 1;
    if (siguienteIndice >= (retoApi.exercises?.length ?? 0)) {
      setFeedback(feedbackMisionCompletada(challenge.title));
      setMensajeSistema('');
      enfocarRetroalimentacion();
      return;
    }
    aplicarReto(retoApi, siguienteIndice);
    setMensajeSistema('¡Nuevo ejercicio! Lee la pregunta y elige tu respuesta.');
  }

  function repetirMision() {
    if (!retoApi) {
      return;
    }
    aplicarReto(retoApi, 0);
    setFeedback(null);
    setMensajeSistema('Empezamos de nuevo la misión. ¡Tú puedes!');
  }

  async function resolveExercise() {
    if (!selectedAnswer) {
      setMensajeSistema('Primero elige una opción (A, B, C o D). Luego pulsa «Resolver ejercicio».');
      return;
    }

    if (!user.studentId) {
      setFeedback({
        correct: false,
        title: 'Cuenta de profesor o admin',
        body: 'Solo los estudiantes guardan respuestas. Inicia sesión con una cuenta de estudiante.',
        formula: 'Rol actual: ' + user.role,
        xp: 0,
        gems: 0
      });
      enfocarRetroalimentacion();
      return;
    }

    setFeedback(feedbackRevisando());
    enfocarRetroalimentacion();
    setResolviendo(true);
    setMensajeSistema('');

    const correct = answersMatch(selectedAnswer, challenge.correctAnswer);
    if (!challenge.challengeId || !challenge.exerciseId) {
      setFeedback(feedbackLocal(correct, challenge, retoApi));
      setResolviendo(false);
      return;
    }

    const tiempoRespuesta =
      challenge.secondsLimit && segundosRestantes >= 0
        ? Math.max(5, challenge.secondsLimit - segundosRestantes)
        : 80;

    try {
      const nuevoIntento = intentoActualId
        ? { attemptId: intentoActualId }
        : await createAttempt(user.studentId, challenge.challengeId);
      setIntentoActualId(nuevoIntento.attemptId);

      const resultado = await submitAnswer(nuevoIntento.attemptId, {
        exerciseId: challenge.exerciseId,
        submittedAnswer: selectedAnswer,
        attemptNumber: 1,
        responseTimeSeconds: tiempoRespuesta
      });

      setFeedback(feedbackDesdeResultado(resultado, challenge, retoApi));

      setUser((current) => ({
        ...current,
        xp: resultado.totalXp ?? current.xp,
        gems: resultado.totalGems ?? current.gems,
        streak: resultado.currentStreak ?? current.streak,
        precision: resultado.precisionPercent ?? current.precision,
        levelProgress: resultado.correct
          ? Math.min(100, current.levelProgress + 12)
          : current.levelProgress
      }));

      if (user.studentId) {
        const insights = await getAiInsights(user.studentId);
        setAnalytics(mapAiInsights(insights));
        setPrediction(mapInsightsToPrediction(insights));
        if (Array.isArray(insights?.suggestions) && insights.suggestions.length > 0) {
          setAiRecommendations(insights.suggestions);
        }
      }
    } catch (error) {
      setMensajeSistema(error.message);
      setFeedback(feedbackLocal(correct, challenge, retoApi));
    } finally {
      setResolviendo(false);
    }
  }

  async function generateAiExercise() {
    setIsGenerating(true);
    setFeedback(null);
    setMensajeSistema('');

    try {
      const temaActual = analytics.temaMasErrores ?? 'Fuerza y aceleración';
      const tiempoPromedioSegundos = Math.max(
        15,
        analytics.tiempoPromedioSegundos ?? (analytics.intentosFallidos > 0 ? 45 : 80)
      );

      const tareas = [
        requestPredictiveAnalysis({
          estudiante: user.name,
          rachaErrores: Math.max(0, 5 - user.streak),
          respuestasIncorrectasConsecutivas: Math.max(1, analytics.intentosFallidos || 1),
          tiempoPromedioSegundos,
          temaActual
        })
      ];

      if (user.studentId) {
        tareas.push(getAiInsights(user.studentId));
        tareas.push(generatePersonalizedExercises(user.studentId));
      }

      const resultados = await Promise.all(tareas);
      const analysis = resultados[0];
      const insightsActualizados = user.studentId ? resultados[1] : null;
      const ejerciciosPersonalizados = user.studentId ? resultados[2] : null;

      if (insightsActualizados) {
        setAnalytics(mapAiInsights(insightsActualizados));
        setPrediction(mapInsightsToPrediction(insightsActualizados));
        if (insightsActualizados.suggestions?.length > 0) {
          setAiRecommendations(insightsActualizados.suggestions);
        }
      } else if (analysis.analytics) {
        setAnalytics({
          tiempoPromedio: analysis.analytics.tiempoPromedio ?? defaultAnalytics.tiempoPromedio,
          intentosFallidos: analysis.analytics.intentosFallidos ?? defaultAnalytics.intentosFallidos,
          temaMasErrores: analysis.analytics.temaMasErrores ?? defaultAnalytics.temaMasErrores
        });
        setPrediction(analysis.prediction ?? defaultPrediction);
      }

      if (Array.isArray(analysis.aiRecommendation) && analysis.aiRecommendation.length > 0) {
        setAiRecommendations(analysis.aiRecommendation);
      }

      const ejercicioDb =
        Array.isArray(ejerciciosPersonalizados) && ejerciciosPersonalizados.length > 0
          ? buildChallengeFromPersonalized(ejerciciosPersonalizados[0])
          : null;

      setRetoApi(null);
      setChallenge(
        ejercicioDb ?? buildChallengeFromPrediction(analysis.nextCustomChallenge, aiChallenge)
      );
      setSelectedAnswer('');
      setIntentoActualId(null);
      setMensajeSistema('¡Listo! Te preparamos un ejercicio nuevo. Léelo y responde cuando quieras.');
    } catch {
      setPrediction({
        alerta: 'Usamos un ejercicio de práctica preparado para ti.',
        tendencia: 'Sigue intentando: cada ejercicio te ayuda a mejorar.'
      });
      setAiRecommendations(suggestions);
      setRetoApi(null);
      setChallenge((current) => (current.id === aiChallenge.id ? baseChallenge : aiChallenge));
      setSelectedAnswer('');
      setIntentoActualId(null);
    } finally {
      setIsGenerating(false);
    }
  }

  if (restaurandoSesion) {
    return (
      <main className="session-boot">
        <BrandLogo size={56} />
        <p>Restaurando tu sesión...</p>
      </main>
    );
  }

  if (screen === 'login') {
    return (
      <AuthScreen
        authForm={formularioAutenticacion}
        mode="login"
        onChange={updateAuthField}
        onSubmit={loginUser}
        switchMode={() => setScreen('register')}
        systemMessage={mensajeSistema}
        loading={authLoading}
      />
    );
  }

  if (screen === 'register') {
    return (
      <AuthScreen
        authForm={formularioAutenticacion}
        mode="register"
        onChange={updateAuthField}
        onSubmit={registerUser}
        switchMode={() => setScreen('login')}
        systemMessage={mensajeSistema}
        loading={authLoading}
      />
    );
  }

  if (screen === 'onboarding') {
    return (
      <OnboardingScreen
        currentStep={currentStep}
        preferences={preferences}
        progress={(stepIndex + 1) * 20}
        stepIndex={stepIndex}
        totalSteps={onboardingSteps.length}
        user={user}
        onBack={previousStep}
        onLogout={cerrarSesion}
        onNext={nextStep}
        onSelect={(key, value) => setPreferences((current) => ({ ...current, [key]: value }))}
      />
    );
  }

  if (screen === 'summary') {
    return (
      <SummaryScreen
        loading={authLoading}
        routeSummary={routeSummary}
        systemMessage={mensajeSistema}
        user={user}
        onEdit={() => setScreen('onboarding')}
        onLogout={cerrarSesion}
        onStart={completarOnboarding}
      />
    );
  }

  if (screen === 'teacher-dashboard') {
    return (
      <TeacherDashboardScreen
        onLogout={cerrarSesion}
        systemMessage={mensajeSistema}
        setSystemMessage={setMensajeSistema}
        user={user}
      />
    );
  }

  if (screen === 'admin-dashboard') {
    return (
      <AdminDashboardScreen
        onLogout={cerrarSesion}
        systemMessage={mensajeSistema}
        setSystemMessage={setMensajeSistema}
        user={user}
      />
    );
  }

  return (
    <DashboardScreen
      aiRecommendations={aiRecommendations}
      analytics={analytics}
      challenge={challenge}
      feedback={feedback}
      feedbackRef={feedbackRef}
      isGenerating={isGenerating}
      onAdvanceExercise={avanzarSiguienteEjercicio}
      onGenerateAiExercise={generateAiExercise}
      onLogout={cerrarSesion}
      onRepeatMission={repetirMision}
      onResolveExercise={resolveExercise}
      onSelectAnswer={(answer) => {
        setSelectedAnswer(answer);
        if (feedback && !feedback.correct) {
          setFeedback(null);
        }
        setMensajeSistema('');
      }}
      prediction={prediction}
      preferences={preferences}
      resolviendo={resolviendo}
      selectedAnswer={selectedAnswer}
      timerLabel={formatTimer(segundosRestantes)}
      user={user}
      systemMessage={mensajeSistema}
    />
  );
}

function AuthHero() {
  return (
    <section className="auth-hero">
      <div className="logo-card">
        <BrandLogo size={56} />
        <div>
          <strong>PhysicsPlay</strong>
          <small>Aprende y diviértete</small>
        </div>
      </div>
      <h1>
        Donde la <span>energía</span> se convierte en <strong>conocimiento.</strong>
      </h1>
      <div className="lab-preview" aria-hidden="true">
        <div className="beam" />
        <div className="orbit orbit-a" />
        <div className="orbit orbit-b" />
        <div className="core" />
      </div>
      <p>Practica física con misiones, retroalimentación inmediata e IA educativa. Accede solo con tu correo y contraseña.</p>
    </section>
  );
}

function AuthScreen({ authForm, mode, onChange, onSubmit, switchMode, systemMessage, loading }) {
  const isRegister = mode === 'register';

  return (
    <main className="auth-shell">
      <AuthHero />

      <section className="auth-card">
        {isRegister && (
          <button className="back-link" onClick={switchMode} type="button">
            ← Volver al inicio de sesión
          </button>
        )}
        <div className="auth-heading">
          <span className="small-mark">
            <AuthModeIcon mode={isRegister ? 'register' : 'login'} size={28} />
          </span>
          <div>
            <h2>{isRegister ? 'Crear cuenta de estudiante' : 'Bienvenido de nuevo'}</h2>
            <p>
              {isRegister
                ? 'Regístrate con tu correo. Profesores y administradores reciben acceso desde el panel administrativo.'
                : 'Inicia sesión con el correo y la contraseña de tu cuenta.'}
            </p>
          </div>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {isRegister && (
            <Field
              icon="user"
              label="Nombre completo"
              onChange={(value) => onChange('fullName', value)}
              placeholder="Isaac Newton"
              required
              value={authForm.fullName}
            />
          )}
          <Field
            icon="email"
            label="Correo electrónico"
            onChange={(value) => onChange('email', value)}
            placeholder="ejemplo@physics.edu"
            required
            type="email"
            value={authForm.email}
          />
          <Field
            icon="lock"
            label="Contraseña"
            minLength={6}
            onChange={(value) => onChange('password', value)}
            placeholder="Mínimo 6 caracteres"
            required
            type="password"
            value={authForm.password}
          />

          {!isRegister && (
            <div className="auth-options">
              <label>
                <input
                  checked={authForm.remember}
                  onChange={(event) => onChange('remember', event.target.checked)}
                  type="checkbox"
                />
                Recordarme
              </label>
            </div>
          )}

          <button className="primary-auth-button" disabled={loading} type="submit">
            {loading ? 'Procesando...' : isRegister ? 'Crear cuenta' : 'Iniciar sesión'} <span>→</span>
          </button>
          {systemMessage && <p className="system-message">{systemMessage}</p>}
        </form>

        <p className="auth-switch">
          {isRegister ? '¿Ya tienes cuenta?' : '¿Eres estudiante y no tienes cuenta?'}
          <button onClick={switchMode} type="button">
            {isRegister ? 'Inicia sesión' : 'Regístrate gratis'}
          </button>
        </p>
      </section>
    </main>
  );
}

function AppPageHeader({ user, title, subtitle, onLogout }) {
  return (
    <header className="app-topbar app-topbar-standalone">
      <div className="brand-cluster">
        <BrandLogo size={44} className="brand-mark" />
        <div>
          <strong>PhysicsPlay</strong>
          {title && <small className="page-kicker">{title}</small>}
        </div>
      </div>
      <div className="player-stats">
        {subtitle && <span className="level-chip">{subtitle}</span>}
        <UserAvatar size={40} className="profile-badge" />
        <strong className="user-name">{user.name}</strong>
        <button className="nav-item logout compact-logout" onClick={onLogout} type="button">
          <NavIcon name="salir" size={18} />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

function Field({ icon, label, onChange, placeholder, type = 'text', value, required = false, minLength }) {
  return (
    <label className="field-block">
      <span>{label}</span>
      <div className="field-control">
        <FieldIcon name={icon} />
        <input
          minLength={minLength}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
        />
      </div>
    </label>
  );
}

function OnboardingScreen({ currentStep, preferences, progress, stepIndex, totalSteps, user, onBack, onLogout, onNext, onSelect }) {
  return (
    <main className="onboarding-shell app-page-shell">
      <AppPageHeader
        onLogout={onLogout}
        subtitle="Configuración inicial"
        title="Primeros pasos"
        user={user}
      />

      <section className="setup-progress">
        <span>PASO {stepIndex + 1} DE {totalSteps}</span>
        <strong>{progress}% Completado</strong>
        <div><span style={{ width: `${progress}%` }} /></div>
      </section>

      <section className="setup-copy">
        <h1>{currentStep.title}</h1>
        <p>{currentStep.description}</p>
      </section>

      <section className="option-cards">
        {currentStep.options.map((option) => (
          <button
            className={preferences[currentStep.key] === option.id ? 'setup-card selected' : 'setup-card'}
            key={option.id}
            onClick={() => onSelect(currentStep.key, option.id)}
            type="button"
          >
            <OptionIcon name={option.icon ?? option.id} size={44} />
            <strong>{option.title}</strong>
            <small>{option.tag}</small>
            <p>{option.body}</p>
          </button>
        ))}
      </section>

      <div className="setup-actions">
        <button className="secondary-button" onClick={onBack} type="button">
          ← Atrás
        </button>
        <em>Puedes cambiar esto en cualquier momento desde tu perfil.</em>
        <button className="primary-setup-button" onClick={onNext} type="button">
          Continuar →
        </button>
      </div>

      <div className="science-tip">
        <div className="tip-grid" />
        <p><TipIcon size={24} /> ¿Sabías que…? La física es el lenguaje con el que modelamos el universo.</p>
      </div>
    </main>
  );
}

function SummaryScreen({ routeSummary, user, onEdit, onLogout, onStart, loading, systemMessage }) {
  return (
    <main className="summary-shell app-page-shell">
      <AppPageHeader onLogout={onLogout} subtitle="Resumen de ruta" title="Listo" user={user} />
      <CheckBadge size={120} />
      <h1>¡Todo listo, {(user.name || 'Estudiante').split(' ')[0]}!</h1>
      <p>Hemos personalizado tu ruta de aprendizaje según tus intereses científicos y objetivos académicos.</p>

      <section className="summary-grid">
        <article className="summary-main-card">
          <h2>Tu enfoque principal</h2>
          <div className="focus-visual">
            <span>{routeSummary.focusTag}</span>
          </div>
          <p>{routeSummary.description}</p>
        </article>
        <div className="summary-side">
          <article>
            <span>Nivel</span>
            <strong>{routeSummary.level}</strong>
          </article>
          <article>
            <span>Estilo</span>
            <strong>{routeSummary.style}</strong>
          </article>
        </div>
      </section>

      <section className="route-band">
        <RouteFeatureIcons />
        <p>Tu ruta incluye <strong>{routeSummary.missions} misiones</strong> y <strong>{routeSummary.labs} laboratorios virtuales</strong>.</p>
        <div><span>Meta estimada:</span><strong>{routeSummary.weeks} semanas</strong></div>
      </section>

      <button className="primary-setup-button wide" disabled={loading} onClick={onStart} type="button">
        {loading ? 'Guardando preferencias...' : 'Comenzar aventura →'}
      </button>
      {systemMessage && <p className="system-message">{systemMessage}</p>}
      <button className="text-button" onClick={onEdit} type="button">
        Revisar mis preferencias
      </button>
    </main>
  );
}

function DashboardScreen({
  aiRecommendations,
  analytics,
  challenge,
  feedback,
  feedbackRef,
  isGenerating,
  onAdvanceExercise,
  onGenerateAiExercise,
  onLogout,
  onRepeatMission,
  onResolveExercise,
  onSelectAnswer,
  prediction,
  preferences,
  resolviendo,
  selectedAnswer,
  systemMessage,
  timerLabel,
  user
}) {
  const mostrandoResultado = Boolean(feedback && !feedback.checking);
  const pasoGuia = mensajePasoActual(challenge);
  return (
    <main className="physics-shell">
      <header className="app-topbar">
        <div className="brand-cluster">
          <BrandLogo size={44} className="brand-mark" />
          <strong>PhysicsPlay</strong>
        </div>
        <div className="player-stats">
          <span className="level-chip">Nivel {user.level}</span>
          <span className="level-progress"><span style={{ width: `${user.levelProgress}%` }} /></span>
          <span className="stat-pill xp-pill">{formatNumber(user.xp)} XP</span>
          <span className="stat-pill gem-pill">{formatNumber(user.gems)} Gemas</span>
          <UserAvatar size={40} className="profile-badge" />
          <strong className="user-name">{user.name}</strong>
        </div>
      </header>

      <div className="workspace-grid">
        <aside className="left-nav">
          {NAV_ITEMS.map((item) => (
            <button
              aria-label={item.label}
              className={item.id === 'retos' ? 'nav-item active' : 'nav-item'}
              key={item.id}
              type="button"
            >
              <NavIcon name={item.id} />
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
          <button className="nav-item logout" onClick={onLogout} type="button">
            <NavIcon name="salir" />
            Cerrar sesión
          </button>
        </aside>

        <section className="challenge-stage">
          <div className="challenge-toolbar">
            <strong>{challenge.title}</strong>
            <div className="question-progress">
              <span>{challenge.badge}</span>
              <span className="mini-progress"><span /></span>
            </div>
            <span className="timer">{timerLabel ?? challenge.timer}</span>
          </div>

          <article className="exercise-panel">
            <p className="student-step-banner" role="status">
              {mostrandoResultado
                ? 'Mira aquí tu resultado y lo que ganaste'
                : selectedAnswer
                  ? 'Paso 2: pulsa «Resolver ejercicio»'
                  : pasoGuia}
            </p>
            <div className="question-copy">
              <span>Dinámica — {preferences.level}</span>
              <h1>{challenge.question}</h1>
            </div>
            {challenge.showDiagram !== false && (
              <>
                <div className="vector-diagram">
                  <div className="motion-aura" />
                  <div className="block">{challenge.massLabel}</div>
                  <div className="arrow-line" />
                  <strong>{challenge.vectorLabel}</strong>
                </div>
                <div className="ground-line" />
              </>
            )}
            <div className="options-grid">
              {challenge.options.map((option, index) => (
                <button
                  className={[
                    'answer-option',
                    selectedAnswer === option ? 'selected' : '',
                    feedback && answersMatch(option, challenge.correctAnswer) ? 'correct' : '',
                    feedback &&
                    answersMatch(selectedAnswer, option) &&
                    !answersMatch(option, challenge.correctAnswer)
                      ? 'wrong'
                      : ''
                  ].filter(Boolean).join(' ')}
                  key={option}
                  disabled={Boolean(feedback?.correct) || resolviendo}
                  onClick={() => onSelectAnswer(option)}
                  type="button"
                >
                  <span>{optionLetter(index)}</span>
                  <strong>{option}</strong>
                </button>
              ))}
            </div>
            <div className="exercise-actions">
              <button
                className="resolve-button"
                disabled={!selectedAnswer || resolviendo || Boolean(feedback?.correct && !feedback?.missionComplete)}
                onClick={onResolveExercise}
                type="button"
              >
                {resolviendo ? 'Revisando tu respuesta…' : 'Resolver ejercicio'}
              </button>
              {feedback?.canAdvance && (
                <button className="resolve-button" onClick={onAdvanceExercise} type="button">
                  Siguiente ejercicio →
                </button>
              )}
            </div>

            <section
              aria-live="polite"
              className={[
                'feedback-section',
                'visible',
                mostrandoResultado || feedback?.checking ? 'is-focused' : ''
              ]
                .filter(Boolean)
                .join(' ')}
              ref={feedbackRef}
            >
              <h2>Retroalimentación inmediata</h2>
              <div
                className={[
                  'feedback-card',
                  feedback?.checking ? 'is-checking' : '',
                  feedback?.missionComplete ? 'is-mission-complete' : '',
                  feedback?.correct === false ? 'needs-review' : '',
                  feedback?.correct ? 'is-correct' : ''
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {feedback?.checking ? (
                  <span className="feedback-spinner" aria-hidden="true" />
                ) : feedback ? (
                  <FeedbackIcon correct={feedback.correct} />
                ) : (
                  <span className="icon-wrap option-icon" style={{ width: 52, height: 52, borderRadius: '50%' }}>
                    <OptionIcon name="practico" size={28} />
                  </span>
                )}
                <div className="feedback-copy">
                  <h3>{feedback?.title ?? 'Elige una respuesta'}</h3>
                  <p>
                    {feedback?.body ??
                      'Marca la opción que creas correcta. Al resolver, aquí verás si acertaste y cuánto ganaste.'}
                  </p>
                  {feedback?.formula ? <strong>{feedback.formula}</strong> : null}
                  {feedback?.fromGemini && !feedback?.checking ? (
                    <span className="gemini-badge">Explicación con IA ✨</span>
                  ) : null}
                </div>
                {!feedback?.checking && !feedback?.missionComplete ? (
                  <div className="reward-column">
                    <span className="reward-xp">+{feedback?.xp ?? 0} XP</span>
                    <span className="reward-gems">+{feedback?.gems ?? 0} Gemas</span>
                  </div>
                ) : null}
              </div>

              {feedback?.missionComplete ? (
                <div className="mission-complete-actions">
                  <button className="resolve-button" onClick={onRepeatMission} type="button">
                    Practicar otra vez la misión
                  </button>
                  <button
                    className="resolve-button"
                    disabled={isGenerating}
                    onClick={onGenerateAiExercise}
                    type="button"
                  >
                    {isGenerating ? 'Preparando reto…' : 'Pedir un reto extra con IA'}
                  </button>
                </div>
              ) : null}
            </section>
          </article>
        </section>

        <aside className="ai-panel">
          <div className="panel-title">
            <strong>Inteligencia artificial</strong>
            <PanelAiBadge />
          </div>
          <section className="ai-card analytics-card">
            <h2>Análisis del estudiante</h2>
            <div className="metric-row">
              <MetricIcon name="tiempo" />
              <p>Tiempo promedio<br /><strong>{analytics.tiempoPromedio}</strong></p>
              <div className="metric-meter"><span style={{ width: '70%' }} /></div>
            </div>
            <div className="metric-row">
              <MetricIcon name="errores" />
              <p>Intentos fallidos<br /><strong>{analytics.intentosFallidos}</strong></p>
              <div className="metric-meter danger"><span style={{ width: '35%' }} /></div>
            </div>
            <div className="metric-row">
              <MetricIcon name="tema" />
              <p>Tema con más errores<br /><strong>{analytics.temaMasErrores}</strong></p>
            </div>
          </section>
          <section className="ai-card">
            <h2>Recomendación de IA</h2>
            <p className="ai-data-sources">
              Basado en: {prediction.fuentesDatos ?? 'actividad registrada en la plataforma'}
            </p>
            <p className="recommendation-box">
              <strong>{prediction.alerta}</strong>
              <span>{prediction.tendencia}</span>
            </p>
            {prediction.probabilidadAprobacion != null && (
              <p className="ai-metric-chip">
                Probabilidad estimada de aprobar evaluación: <strong>{prediction.probabilidadAprobacion}%</strong>
              </p>
            )}
            {Array.isArray(prediction.temasDificiles) && prediction.temasDificiles.length > 0 && (
              <div className="ai-tags">
                {prediction.temasDificiles.map((tema) => (
                  <span className="ai-tag" key={tema}>
                    {tema}
                  </span>
                ))}
              </div>
            )}
            {Array.isArray(prediction.patronesError) && prediction.patronesError.length > 0 && (
              <ul className="ai-pattern-list">
                {prediction.patronesError.map((patron) => (
                  <li key={patron}>{patron}</li>
                ))}
              </ul>
            )}
            {aiRecommendations.map((suggestion) => (
              <label className="suggestion-row" key={suggestion}>
                <input defaultChecked type="checkbox" />
                <span>{suggestion}</span>
              </label>
            ))}
            <button
              className="generate-button"
              disabled={isGenerating || !user.studentId}
              onClick={onGenerateAiExercise}
              type="button"
            >
              {isGenerating ? 'Generando refuerzo...' : 'Generar ejercicios personalizados'}
            </button>
          </section>
        </aside>
      </div>

      <footer className="tips-bar">
        <TipIcon />
        <p>{systemMessage || 'Practica constantemente para mejorar tu comprensión de física.'}</p>
      </footer>
    </main>
  );
}

function TeacherDashboardScreen({ user, onLogout, systemMessage, setSystemMessage }) {
  const [aulas, setAulas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [disponibles, setDisponibles] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [nuevaAula, setNuevaAula] = useState('');
  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);
  const [estudianteInscribir, setEstudianteInscribir] = useState('');

  async function cargarDatos() {
    try {
      const [aulasData, estudiantesData, disponiblesData] = await Promise.all([
        listarAulasProfesor(user.userId),
        listarEstudiantesProfesor(user.userId),
        listarEstudiantesDisponiblesProfesor(user.userId)
      ]);
      setAulas(aulasData);
      setEstudiantes(estudiantesData);
      setDisponibles(disponiblesData);
      if (aulasData.length > 0 && !aulaSeleccionada) {
        setAulaSeleccionada(aulasData[0].id);
      }
      setSystemMessage('');
    } catch (error) {
      setSystemMessage(error.message);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, [user.userId]);

  async function crearAula() {
    if (!nuevaAula.trim()) {
      return;
    }
    try {
      await crearAulaProfesor(user.userId, { nombre: nuevaAula.trim(), grado: '5to de secundaria' });
      setNuevaAula('');
      await cargarDatos();
    } catch (error) {
      setSystemMessage(error.message);
    }
  }

  async function inscribir() {
    if (!aulaSeleccionada || !estudianteInscribir) {
      return;
    }
    try {
      await inscribirEstudianteAula(user.userId, aulaSeleccionada, Number(estudianteInscribir));
      setEstudianteInscribir('');
      await cargarDatos();
    } catch (error) {
      setSystemMessage(error.message);
    }
  }

  async function verDetalle(studentId) {
    try {
      const data = await detalleEstudianteProfesor(user.userId, studentId);
      setDetalle(data);
    } catch (error) {
      setSystemMessage(error.message);
    }
  }

  return (
    <main className="management-shell app-page-shell">
      <AppPageHeader
        onLogout={onLogout}
        subtitle="Supervisión de estudiantes"
        title="Panel del profesor"
        user={user}
      />

      {systemMessage && <p className="system-message">{systemMessage}</p>}

      <section className="management-grid">
        <article className="management-card">
          <h2><ClassroomIcon /> Mis aulas</h2>
          <div className="inline-form">
            <input
              onChange={(event) => setNuevaAula(event.target.value)}
              placeholder="Nombre del aula, ej. 5to A"
              value={nuevaAula}
            />
            <button className="primary-setup-button" onClick={crearAula} type="button">Crear aula</button>
          </div>
          <ul className="data-list">
            {aulas.map((aula) => (
              <li key={aula.id}>
                <strong>{aula.name}</strong>
                <span>{aula.enrolledStudents} estudiantes</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="management-card">
          <h2>Inscribir estudiante</h2>
          <div className="inline-form stacked">
            <select onChange={(event) => setAulaSeleccionada(Number(event.target.value))} value={aulaSeleccionada ?? ''}>
              <option value="">Selecciona aula</option>
              {aulas.map((aula) => (
                <option key={aula.id} value={aula.id}>{aula.name}</option>
              ))}
            </select>
            <select onChange={(event) => setEstudianteInscribir(event.target.value)} value={estudianteInscribir}>
              <option value="">Selecciona estudiante</option>
              {disponibles.map((est) => (
                <option key={est.estudianteId} value={est.estudianteId}>{est.nombreCompleto}</option>
              ))}
            </select>
            <button className="primary-setup-button" onClick={inscribir} type="button">Inscribir</button>
          </div>
        </article>

        <article className="management-card wide">
          <h2><UserAvatar size={28} /> Estudiantes supervisados</h2>
          <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Nivel</th>
                <th>XP</th>
                <th>Precisión</th>
                <th>Tema débil</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((est) => (
                <tr key={est.estudianteId}>
                  <td>{est.nombreCompleto}</td>
                  <td>{est.nivel}</td>
                  <td>{formatNumber(est.xp)}</td>
                  <td>{est.precisionPorcentaje}%</td>
                  <td>{est.temaConMasErrores}</td>
                  <td>
                    <button className="text-button" onClick={() => verDetalle(est.estudianteId)} type="button">
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {estudiantes.length === 0 && (
            <p className="empty-hint">Crea un aula e inscribe estudiantes para ver su progreso.</p>
          )}
        </article>
      </section>

      {detalle && (
        <section className="management-card detail-panel">
          <div className="detail-header">
            <h2>Detalle: {detalle.resumen.nombreCompleto}</h2>
            <button className="text-button" onClick={() => setDetalle(null)} type="button">Cerrar</button>
          </div>
          <p>{detalle.panelIa?.diagnosis}</p>
          <ul className="data-list">
            {detalle.progresoPorTema?.map((tema) => (
              <li key={tema.topicId}>
                Tema #{tema.topicId} — {tema.masteryLevel} — {tema.correctAnswers} correctas / {tema.incorrectAnswers} incorrectas
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function AdminDashboardScreen({ user, onLogout, systemMessage, setSystemMessage }) {
  const [usuarios, setUsuarios] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombreCompleto: '',
    correoElectronico: '',
    contrasena: '',
    rol: 'estudiante'
  });

  async function cargarDatos() {
    try {
      const [usuariosData, estudiantesData] = await Promise.all([
        listarUsuariosAdmin(user.userId),
        listarEstudiantesAdmin(user.userId)
      ]);
      setUsuarios(usuariosData);
      setEstudiantes(estudiantesData);
      setSystemMessage('');
    } catch (error) {
      setSystemMessage(error.message);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, [user.userId]);

  async function crearUsuario(event) {
    event.preventDefault();
    try {
      await crearUsuarioAdmin(user.userId, {
        nombreCompleto: nuevoUsuario.nombreCompleto,
        correoElectronico: nuevoUsuario.correoElectronico,
        contrasena: nuevoUsuario.contrasena,
        rol: nuevoUsuario.rol,
        preferencias: null
      });
      setNuevoUsuario({ nombreCompleto: '', correoElectronico: '', contrasena: '', rol: 'estudiante' });
      await cargarDatos();
    } catch (error) {
      setSystemMessage(error.message);
    }
  }

  async function cambiarEstado(usuarioId, estado) {
    try {
      await actualizarUsuarioAdmin(user.userId, usuarioId, { estado, rol: null });
      await cargarDatos();
    } catch (error) {
      setSystemMessage(error.message);
    }
  }

  async function verDetalle(studentId) {
    try {
      const data = await detalleEstudianteAdmin(user.userId, studentId);
      setDetalle(data);
    } catch (error) {
      setSystemMessage(error.message);
    }
  }

  return (
    <main className="management-shell app-page-shell">
      <AppPageHeader
        onLogout={onLogout}
        subtitle="Gestión de cuentas"
        title="Panel de administración"
        user={user}
      />

      {systemMessage && <p className="system-message">{systemMessage}</p>}

      <section className="management-grid">
        <article className="management-card">
          <h2><AdminIcon /> Crear usuario del sistema</h2>
          <p className="card-hint">Los profesores y administradores solo se crean desde este panel.</p>
          <form className="inline-form stacked" onSubmit={crearUsuario}>
            <input
              onChange={(event) => setNuevoUsuario((c) => ({ ...c, nombreCompleto: event.target.value }))}
              placeholder="Nombre completo"
              required
              value={nuevoUsuario.nombreCompleto}
            />
            <input
              onChange={(event) => setNuevoUsuario((c) => ({ ...c, correoElectronico: event.target.value }))}
              placeholder="Correo"
              required
              type="email"
              value={nuevoUsuario.correoElectronico}
            />
            <input
              onChange={(event) => setNuevoUsuario((c) => ({ ...c, contrasena: event.target.value }))}
              placeholder="Contraseña (mín. 6)"
              required
              type="password"
              value={nuevoUsuario.contrasena}
            />
            <select
              onChange={(event) => setNuevoUsuario((c) => ({ ...c, rol: event.target.value }))}
              value={nuevoUsuario.rol}
            >
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
              <option value="administrador">Administrador</option>
            </select>
            <button className="primary-setup-button" type="submit">Crear usuario</button>
          </form>
        </article>

        <article className="management-card wide">
          <h2><AdminIcon /> Usuarios del sistema</h2>
          <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.usuarioId}>
                  <td>{u.nombreCompleto}</td>
                  <td>{u.correoElectronico}</td>
                  <td>{u.rol}</td>
                  <td>{u.estado}</td>
                  <td className="action-cell">
                    {u.estado === 'activo' ? (
                      <button className="text-button" onClick={() => cambiarEstado(u.usuarioId, 'inactivo')} type="button">
                        Desactivar
                      </button>
                    ) : (
                      <button className="text-button" onClick={() => cambiarEstado(u.usuarioId, 'activo')} type="button">
                        Activar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </article>

        <article className="management-card wide">
          <h2><MetricIcon name="tema" /> Progreso de estudiantes</h2>
          <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Nivel</th>
                <th>XP</th>
                <th>Precisión</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((est) => (
                <tr key={est.estudianteId}>
                  <td>{est.nombreCompleto}</td>
                  <td>{est.nivel}</td>
                  <td>{formatNumber(est.xp)}</td>
                  <td>{est.precisionPorcentaje}%</td>
                  <td>
                    <button className="text-button" onClick={() => verDetalle(est.estudianteId)} type="button">
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </article>
      </section>

      {detalle && (
        <section className="management-card detail-panel">
          <div className="detail-header">
            <h2>Detalle: {detalle.resumen.nombreCompleto}</h2>
            <button className="text-button" onClick={() => setDetalle(null)} type="button">Cerrar</button>
          </div>
          <p>{detalle.panelIa?.diagnosis}</p>
        </section>
      )}
    </main>
  );
}

function buildRouteSummary(preferences) {
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
    description: preferences.goal === 'dominar'
      ? 'Dominarás fuerza, masa, aceleración y leyes de Newton mediante retos y simulaciones interactivas.'
      : 'Tu ruta combinará teoría, práctica y retroalimentación inmediata según tus preferencias.',
    missions: preferences.pace === 'intensivo' ? 16 : 12,
    labs: preferences.style === 'visual' ? 5 : 4,
    weeks: preferences.pace === 'ligero' ? 4 : 3
  };
}

export default App;
