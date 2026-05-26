import { useEffect, useMemo, useRef, useState } from 'react';
import CargaSesion from '../compartido/paginas/CargaSesion.jsx';
import { analiticasPorDefecto, prediccionPorDefecto, sugerenciasIa } from '../nucleo/constantes/ia.js';
import { desafioBase, desafioIa } from '../nucleo/constantes/desafios.js';
import { pasosOnboarding } from '../nucleo/constantes/onboarding.js';
import { usuarioInicial } from '../nucleo/constantes/usuario.js';
import {
  createAttempt,
  generatePersonalizedExercises,
  getAiInsights,
  getChallenges,
  getGamification,
  guardarPreferenciasEstudiante,
  iniciarSesion,
  obtenerSesionActual,
  registrarEstudiante,
  requestPredictiveAnalysis,
  submitAnswer
} from '../nucleo/servicios/api.js';
import {
  actualizarPantallaSesion,
  guardarSesion,
  leerEstadoInicialApp,
  limpiarSesion
} from '../nucleo/servicios/sesion.js';
import {
  answersMatch,
  buildChallengeFromApi,
  buildChallengeFromPersonalized,
  buildChallengeFromPrediction,
  formatTimer,
  mapAiInsights,
  mapInsightsToPrediction
} from '../nucleo/utilidades/retos.js';
import {
  feedbackDesdeResultado,
  feedbackLocal,
  feedbackMisionCompletada,
  feedbackRevisando
} from '../nucleo/utilidades/retroalimentacionEstudiante.js';
import { construirResumenRuta } from '../modulos/estudiante/utilidades/resumenRuta.js';
import PaginaAdministrador from '../modulos/administrador/paginas/PaginaAdministrador.jsx';
import PaginaAutenticacion from '../modulos/autenticacion/paginas/PaginaAutenticacion.jsx';
import PaginaOnboarding from '../modulos/estudiante/paginas/PaginaOnboarding.jsx';
import PaginaProfesor from '../modulos/profesor/paginas/PaginaProfesor.jsx';
import PaginaResumen from '../modulos/estudiante/paginas/PaginaResumen.jsx';
import PaginaRetos from '../modulos/estudiante/paginas/PaginaRetos.jsx';

const estadoInicialApp = leerEstadoInicialApp();

export default function App() {
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
  const [challenge, setChallenge] = useState(desafioBase);
  const [retoApi, setRetoApi] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [mensajeSistema, setMensajeSistema] = useState('');
  const [intentoActualId, setIntentoActualId] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState(sugerenciasIa);
  const [analytics, setAnalytics] = useState(analiticasPorDefecto);
  const [prediction, setPrediction] = useState(prediccionPorDefecto);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resolviendo, setResolviendo] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(desafioBase.secondsLimit ?? 420);
  const feedbackRef = useRef(null);

  const currentStep = pasosOnboarding[stepIndex];
  const routeSummary = useMemo(() => construirResumenRuta(preferences), [preferences]);

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
    const retoWeb = buildChallengeFromApi(apiChallenge, exerciseIndex) ?? desafioBase;
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
    if (stepIndex < pasosOnboarding.length - 1) {
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
          tiempoPromedio: analysis.analytics.tiempoPromedio ?? analiticasPorDefecto.tiempoPromedio,
          intentosFallidos: analysis.analytics.intentosFallidos ?? analiticasPorDefecto.intentosFallidos,
          temaMasErrores: analysis.analytics.temaMasErrores ?? analiticasPorDefecto.temaMasErrores
        });
        setPrediction(analysis.prediction ?? prediccionPorDefecto);
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
        ejercicioDb ?? buildChallengeFromPrediction(analysis.nextCustomChallenge, desafioIa)
      );
      setSelectedAnswer('');
      setIntentoActualId(null);
      setMensajeSistema('¡Listo! Te preparamos un ejercicio nuevo. Léelo y responde cuando quieras.');
    } catch {
      setPrediction({
        alerta: 'Usamos un ejercicio de práctica preparado para ti.',
        tendencia: 'Sigue intentando: cada ejercicio te ayuda a mejorar.'
      });
      setAiRecommendations(sugerenciasIa);
      setRetoApi(null);
      setChallenge((current) => (current.id === desafioIa.id ? desafioBase : desafioIa));
      setSelectedAnswer('');
      setIntentoActualId(null);
    } finally {
      setIsGenerating(false);
    }
  }

  if (restaurandoSesion) {
    return <CargaSesion />;
  }

  if (screen === 'login') {
    return (
      <PaginaAutenticacion
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
      <PaginaAutenticacion
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
      <PaginaOnboarding
        currentStep={currentStep}
        preferences={preferences}
        progress={(stepIndex + 1) * 20}
        stepIndex={stepIndex}
        totalSteps={pasosOnboarding.length}
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
      <PaginaResumen
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
      <PaginaProfesor
        onLogout={cerrarSesion}
        systemMessage={mensajeSistema}
        setSystemMessage={setMensajeSistema}
        user={user}
      />
    );
  }

  if (screen === 'admin-dashboard') {
    return (
      <PaginaAdministrador
        onLogout={cerrarSesion}
        systemMessage={mensajeSistema}
        setSystemMessage={setMensajeSistema}
        user={user}
      />
    );
  }

  return (
    <PaginaRetos
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
