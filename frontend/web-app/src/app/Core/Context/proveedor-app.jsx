import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { analiticasPorDefecto, prediccionPorDefecto, sugerenciasIa } from '@/app/Core/Models/ia.defecto.js';
import { desafioBase, desafioIa } from '@/app/Core/Models/retos.defecto.js';
import { pasosOnboarding } from '@/app/Core/Models/onboarding.config.js';
import { usuarioInicial } from '@/app/Core/Models/usuario.defecto.js';
import { ROUTES, legacyPathToRoute, initialRouteByRole } from '@/app/Core/Models/rutas.js';
import {
  clearSession,
  getCurrentUser,
  login,
  PUBLIC_ROUTES,
  readInitialAppState,
  registerStudent,
  saveSession,
  saveStudentPreferences,
  updateSessionPath
} from '@/app/Core/Services/servicio-autenticacion.js';
import {
  createAttempt,
  getChallenges,
  getGamification,
  submitAnswer
} from '@/app/Core/Services/servicio-retos.js';
import {
  generatePersonalizedExercises,
  getAiInsights,
  requestPredictiveAnalysis
} from '@/app/Core/Services/servicio-ia.js';
import {
  answersMatch,
  buildChallengeFromApi,
  buildChallengeFromPersonalized,
  buildChallengeFromPrediction,
  formatTimer,
  mapAiInsights,
  mapInsightsToPrediction
} from '@/app/Core/Utils/retos.util.js';
import {
  feedbackDesdeResultado,
  feedbackLocal,
  feedbackMisionCompletada,
  feedbackRevisando
} from '@/app/Core/Utils/retroalimentacion.util.js';
import { construirResumenRuta } from '@/app/Core/Utils/resumen-ruta.util.js';
import { AppContext } from './contexto-app.js';

const initialAppState = readInitialAppState();

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const ubicacion = useLocation();

  const [user, setUser] = useState(initialAppState.user ?? usuarioInicial);
  const [onboardingComplete, setOnboardingComplete] = useState(initialAppState.onboardingComplete);
  const [restoringSession, setRestoringSession] = useState(Boolean(initialAppState.user?.userId));
  const [authForm, setAuthForm] = useState({
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
  const [systemMessage, setSystemMessage] = useState('');
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

  /** Restaura sesión del backend y vuelve a la última ruta guardada */
  useEffect(() => {
    async function refrescarSesionGuardada() {
      if (!initialAppState.user?.userId) {
        setRestoringSession(false);
        return;
      }

      try {
        const usuarioActualizado = await getCurrentUser(initialAppState.user.userId);
        aplicarSesion(usuarioActualizado, {
          nuevaCuenta: !initialAppState.onboardingComplete,
          persistir: false,
          rutaDestino: initialAppState.pathname
        });
      } catch {
        clearSession();
        setUser(usuarioInicial);
        navigate(ROUTES.AUTH_LOGIN, { replace: true });
      } finally {
        setRestoringSession(false);
      }
    }

    refrescarSesionGuardada();
    // Solo al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Tras cargar, ir a la ruta persistida si el usuario abrió "/" */
  useEffect(() => {
    if (restoringSession || !initialAppState.pathname) {
      return;
    }
    if (ubicacion.pathname === '/' || ubicacion.pathname === '') {
      navigate(initialAppState.pathname, { replace: true });
    }
  }, [restoringSession, navigate, ubicacion.pathname]);

  /** Persistir ruta actual en localStorage */
  useEffect(() => {
    if (!user.userId || PUBLIC_ROUTES.has(ubicacion.pathname)) {
      return;
    }
    updateSessionPath(ubicacion.pathname, onboardingComplete);
  }, [ubicacion.pathname, user.userId, onboardingComplete]);

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

  /** Carga retos y gamificación al entrar en /estudiante/retos */
  useEffect(() => {
    if (ubicacion.pathname !== ROUTES.APP_CHALLENGES) {
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
        setSystemMessage(error.message);
      }
    }

    cargarPanelRetos();
  }, [ubicacion.pathname, user.studentId]);

  useEffect(() => {
    if (ubicacion.pathname !== ROUTES.APP_CHALLENGES || !challenge.secondsLimit) {
      return undefined;
    }

    setSegundosRestantes(challenge.secondsLimit);
    const intervalId = window.setInterval(() => {
      setSegundosRestantes((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [ubicacion.pathname, challenge.id, challenge.secondsLimit]);

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
    setAuthForm((current) => ({ ...current, [field]: value }));
  }

  function aplicarSesion(
    usuarioAutenticado,
    { nuevaCuenta = false, persistir = true, rutaDestino = null } = {}
  ) {
    const esEstudiante = usuarioAutenticado.rol === 'estudiante';
    const onboardingListo = esEstudiante ? !nuevaCuenta : true;

    let ruta =
      rutaDestino ??
      initialRouteByRole(usuarioAutenticado.rol, onboardingListo);

    if (typeof ruta === 'string' && !ruta.startsWith('/')) {
      ruta = legacyPathToRoute(ruta);
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

    setOnboardingComplete(onboardingListo);
    navigate(ruta, { replace: true });

    if (persistir) {
      saveSession({
        usuarioAutenticado,
        pathname: ruta,
        onboardingComplete: onboardingListo,
        recordar: authForm.remember !== false
      });
    }
  }

  function logout() {
    clearSession();
    setUser(usuarioInicial);
    setOnboardingComplete(false);
    setAuthForm({ fullName: '', email: '', password: '', remember: true });
    setStepIndex(0);
    setFeedback(null);
    setSystemMessage('');
    navigate(ROUTES.AUTH_LOGIN, { replace: true });
  }

  async function registerUser(event) {
    event.preventDefault();
    setSystemMessage('');
    setAuthLoading(true);
    try {
      const usuarioAutenticado = await registerStudent({
        nombreCompleto: authForm.fullName.trim(),
        correoElectronico: authForm.email.trim(),
        contrasena: authForm.password
      });
      aplicarSesion(usuarioAutenticado, { nuevaCuenta: true });
    } catch (error) {
      setSystemMessage(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function loginUser(event) {
    event.preventDefault();
    setSystemMessage('');
    setAuthLoading(true);
    try {
      const usuarioAutenticado = await login({
        correoElectronico: authForm.email.trim(),
        contrasena: authForm.password
      });
      aplicarSesion(usuarioAutenticado);
    } catch (error) {
      setSystemMessage(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function completeOnboarding() {
    setSystemMessage('');
    setAuthLoading(true);
    try {
      await saveStudentPreferences(user.userId, preferences);
      setOnboardingComplete(true);
      navigate(ROUTES.APP_HOME, { replace: true });
      saveSession({
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
        pathname: ROUTES.APP_HOME,
        onboardingComplete: true,
        recordar: authForm.remember !== false
      });
    } catch (error) {
      setSystemMessage(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  function nextStep() {
    if (stepIndex < pasosOnboarding.length - 1) {
      setStepIndex((current) => current + 1);
      return;
    }
    navigate(ROUTES.APP_ONBOARDING_SUMMARY);
  }

  function previousStep() {
    if (stepIndex > 0) {
      setStepIndex((current) => current - 1);
      return;
    }
    navigate(ROUTES.AUTH_REGISTER);
  }

  function avanzarSiguienteEjercicio() {
    if (!retoApi) {
      return;
    }
    const siguienteIndice = (challenge.exerciseIndex ?? 0) + 1;
    if (siguienteIndice >= (retoApi.exercises?.length ?? 0)) {
      setFeedback(feedbackMisionCompletada(challenge.title));
      setSystemMessage('');
      enfocarRetroalimentacion();
      return;
    }
    aplicarReto(retoApi, siguienteIndice);
    setSystemMessage('¡Nuevo ejercicio! Lee la pregunta y elige tu respuesta.');
  }

  function repetirMision() {
    if (!retoApi) {
      return;
    }
    aplicarReto(retoApi, 0);
    setFeedback(null);
    setSystemMessage('Empezamos de nuevo la misión. ¡Tú puedes!');
  }

  async function resolveExercise() {
    if (!selectedAnswer) {
      setSystemMessage('Primero elige una opción (A, B, C o D). Luego pulsa «Resolver ejercicio».');
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
    setSystemMessage('');

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
      setSystemMessage(error.message);
      setFeedback(feedbackLocal(correct, challenge, retoApi));
    } finally {
      setResolviendo(false);
    }
  }

  async function generateAiExercise() {
    setIsGenerating(true);
    setFeedback(null);
    setSystemMessage('');

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
      setSystemMessage('¡Listo! Te preparamos un ejercicio nuevo. Léelo y responde cuando quieras.');
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

  function seleccionarRespuesta(answer) {
    setSelectedAnswer(answer);
    if (feedback && !feedback.correct) {
      setFeedback(null);
    }
    setSystemMessage('');
  }

  const contextValue = {
    user,
    preferences,
    setPreferences,
    authForm,
    updateAuthField,
    authLoading,
    systemMessage,
    setSystemMessage,
    restoringSession,
    onboardingComplete,
    currentStep,
    stepIndex,
    routeSummary,
    challenge,
    feedback,
    feedbackRef,
    isGenerating,
    resolviendo,
    selectedAnswer,
    aiRecommendations,
    analytics,
    prediction,
    timerLabel: formatTimer(segundosRestantes),
    logout,
    registerUser,
    loginUser,
    completeOnboarding,
    nextStep,
    previousStep,
    avanzarSiguienteEjercicio,
    repetirMision,
    resolveExercise,
    generateAiExercise,
    seleccionarRespuesta
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
