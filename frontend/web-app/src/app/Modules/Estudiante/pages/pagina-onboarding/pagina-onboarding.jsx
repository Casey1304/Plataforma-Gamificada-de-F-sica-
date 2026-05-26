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
    <main className="onboarding-shell app-page-shell">
      <PageHeader
        onLogout={logout}
        subtitle="Configuración inicial"
        title="Primeros pasos"
        user={user}
      />

      <section className="setup-progress">
        <span>
          PASO {stepIndex + 1} DE {pasosOnboarding.length}
        </span>
        <strong>{progress}% Completado</strong>
        <div>
          <span style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="setup-copy">
        <h1>{currentStep.title}</h1>
        <p>{currentStep.description}</p>
      </section>

      <section className="option-cards">
        {currentStep.options.map((option) => (
          <button
            className={
              preferences[currentStep.key] === option.id ? 'setup-card selected' : 'setup-card'
            }
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
        <em>Puedes cambiar esto en cualquier momento desde tu perfil.</em>
        <button className="primary-setup-button" onClick={nextStep} type="button">
          Continuar →
        </button>
      </div>

      <div className="science-tip">
        <div className="tip-grid" />
        <p>
          <TipIcon size={24} /> ¿Sabías que…? La física es el lenguaje con el que modelamos el universo.
        </p>
      </div>
    </main>
  );
}
