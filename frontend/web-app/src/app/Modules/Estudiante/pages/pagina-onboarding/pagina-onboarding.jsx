import { useApp } from '@/app/Core/Context/usar-app.js';
import { pasosOnboarding } from '@/app/Core/Models/onboarding.config.js';
import { PageHeader } from '@/app/Shared/Components/encabezado-pagina/encabezado-pagina.jsx';
import { OptionIcon, TipIcon } from '@/app/Shared/Components/iconos/iconos.jsx';
import './pagina-onboarding.css';

export function OnboardingPage() {
  const { user, preferences, stepIndex, logout, nextStep, previousStep, setPreferences } = useApp();
  const currentStep = pasosOnboarding[stepIndex];
  const progress = (stepIndex + 1) * 20;

  return (
    <main className="onboarding-shell app-page-shell" id="main-content" tabIndex="-1">
      <PageHeader
        onLogout={logout}
        subtitle="Configuración inicial"
        title="Primeros pasos"
        user={user}
      />

      <section aria-label="Progreso de la configuración" className="setup-progress">
        <span>
          PASO {stepIndex + 1} DE {pasosOnboarding.length}
        </span>
        <strong>{progress}% Completado</strong>
        <div
          aria-valuemax="100"
          aria-valuemin="0"
          aria-valuenow={progress}
          role="progressbar"
        >
          <span aria-hidden="true" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="setup-copy">
        <h2 id="onboarding-question">{currentStep.title}</h2>
        <p>{currentStep.description}</p>
      </section>

      <section aria-labelledby="onboarding-question" className="option-cards">
        {currentStep.options.map((option) => (
          <button
            className={
              preferences[currentStep.key] === option.id ? 'setup-card selected' : 'setup-card'
            }
            aria-pressed={preferences[currentStep.key] === option.id}
            key={option.id}
            onClick={() => setPreferences((current) => ({ ...current, [currentStep.key]: option.id }))}
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
        <button className="secondary-button" onClick={previousStep} type="button">
          ← Atrás
        </button>
        <span className="setup-help">Puedes cambiar estas preferencias más adelante.</span>
        <button className="primary-setup-button" onClick={nextStep} type="button">
          Continuar →
        </button>
      </div>

      <div className="science-tip">
        <div aria-hidden="true" className="tip-grid" />
        <p>
          <TipIcon size={24} /> ¿Sabías que…? La física es el lenguaje con el que modelamos el universo.
        </p>
      </div>
    </main>
  );
}
