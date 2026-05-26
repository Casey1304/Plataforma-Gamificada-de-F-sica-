import EncabezadoPagina from '../../../compartido/componentes/EncabezadoPagina.jsx';
import { OptionIcon, TipIcon } from '../../../compartido/componentes/Iconos.jsx';
import './PaginaOnboarding.css';

export default function PaginaOnboarding({
  currentStep,
  preferences,
  progress,
  stepIndex,
  totalSteps,
  user,
  onBack,
  onLogout,
  onNext,
  onSelect
}) {
  return (
    <main className="onboarding-shell app-page-shell">
      <EncabezadoPagina
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
