import { BrandLogo, NAV_ITEMS, NavIcon, TipIcon, UserAvatar } from '../../../compartido/componentes/Iconos.jsx';
import { formatNumber, optionLetter } from '../../../nucleo/utilidades/formato.js';
import { answersMatch } from '../../../nucleo/utilidades/retos.js';
import { mensajePasoActual } from '../../../nucleo/utilidades/retroalimentacionEstudiante.js';
import DiagramaFisica from '../componentes/DiagramaFisica.jsx';
import PanelLateralIa from '../componentes/PanelLateralIa.jsx';
import RetroalimentacionEjercicio from '../componentes/RetroalimentacionEjercicio.jsx';
import './PaginaRetos.css';

export default function PaginaRetos({
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
            <DiagramaFisica challenge={challenge} />
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

            <RetroalimentacionEjercicio
              feedback={feedback}
              feedbackRef={feedbackRef}
              isGenerating={isGenerating}
              mostrandoResultado={mostrandoResultado}
              onGenerateAiExercise={onGenerateAiExercise}
              onRepeatMission={onRepeatMission}
            />
          </article>
        </section>

        <PanelLateralIa
          aiRecommendations={aiRecommendations}
          analytics={analytics}
          isGenerating={isGenerating}
          onGenerateAiExercise={onGenerateAiExercise}
          prediction={prediction}
          user={user}
        />
      </div>

      <footer className="tips-bar">
        <TipIcon />
        <p>{systemMessage || 'Practica constantemente para mejorar tu comprensión de física.'}</p>
      </footer>
    </main>
  );
}
