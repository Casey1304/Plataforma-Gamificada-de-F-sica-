import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '@/app/Core/Context/usar-app.js';
import { ROUTES, initialRouteByRole } from '@/app/Core/Models/rutas.js';
import { AuthModeIcon } from '@/app/Shared/Components/iconos/iconos.jsx';
import { AuthHero } from '@/app/Shared/Components/portada-auth/portada-auth.jsx';
import { FormField } from '@/app/Shared/Components/campo-formulario/campo-formulario.jsx';
import { StatusMessage } from '@/app/Shared/Components/mensaje-estado/mensaje-estado.jsx';
import {
  focusFirstInvalidField,
  validateAuthForm
} from '@/app/Core/Utils/validacion-formulario.util.js';
import './pagina-login.css';

/**
 * Pagina de inicio de sesion (/auth/login).
 * La logica de API esta en Core/Services/servicio-autenticacion.js via AppProvider.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});
  const { user, authForm, updateAuthField, loginUser, authLoading, systemMessage, onboardingComplete } =
    useApp();

  if (user?.userId) {
    return <Navigate replace to={initialRouteByRole(user.role, onboardingComplete)} />;
  }

  function updateField(field, value) {
    updateAuthField(field, value);
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function submitLogin(event) {
    event.preventDefault();
    const errors = validateAuthForm(authForm);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      focusFirstInvalidField(errors);
      return;
    }

    loginUser(event);
  }

  return (
    <main className="auth-shell" id="main-content" tabIndex="-1">
      <AuthHero />
      <section aria-labelledby="login-title" className="auth-card">
        <div className="auth-heading">
          <span className="small-mark">
            <AuthModeIcon mode="login" size={28} />
          </span>
          <div>
            <h2 id="login-title">Bienvenido</h2>
            <p>Inicia sesión con tu correo y contraseña.</p>
          </div>
        </div>

        <form className="auth-form" noValidate onSubmit={submitLogin}>
          <FormField
            autoComplete="email"
            error={fieldErrors.email}
            id="auth-email"
            icon="email"
            label="Correo electrónico"
            name="email"
            onChange={(value) => updateField('email', value)}
            placeholder="ejemplo@physics.edu"
            required
            type="email"
            value={authForm.email}
          />
          <FormField
            autoComplete="current-password"
            error={fieldErrors.password}
            hint="Debe tener al menos 6 caracteres."
            id="auth-password"
            icon="lock"
            label="Contraseña"
            minLength={6}
            name="password"
            onChange={(value) => updateField('password', value)}
            placeholder="Mínimo 6 caracteres"
            required
            type="password"
            value={authForm.password}
          />
          <div className="auth-options">
            <label>
              <input
                checked={authForm.remember}
                onChange={(event) => updateAuthField('remember', event.target.checked)}
                type="checkbox"
              />
              Recordarme
            </label>
          </div>
          <button
            aria-busy={authLoading}
            className="primary-auth-button"
            disabled={authLoading}
            type="submit"
          >
            {authLoading ? 'Procesando...' : 'Iniciar sesión'} <span>→</span>
          </button>
          <StatusMessage message={systemMessage} />
        </form>

        <p className="auth-switch">
          ¿Eres estudiante y no tienes cuenta?
          <button onClick={() => navigate(ROUTES.AUTH_REGISTER)} type="button">
            Regístrate gratis
          </button>
        </p>
      </section>
    </main>
  );
}
