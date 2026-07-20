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
import '../pagina-login/pagina-login.css';

export function RegisterPage() {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});
  const { user, authForm, updateAuthField, registerUser, authLoading, systemMessage, onboardingComplete } =
    useApp();

  if (user?.userId) {
    return <Navigate replace to={initialRouteByRole(user.role, onboardingComplete)} />;
  }

  function updateField(field, value) {
    updateAuthField(field, value);
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function submitRegistration(event) {
    event.preventDefault();
    const errors = validateAuthForm(authForm, true);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      focusFirstInvalidField(errors);
      return;
    }

    registerUser(event);
  }

  return (
    <main className="auth-shell" id="main-content" tabIndex="-1">
      <AuthHero />
      <section aria-labelledby="register-title" className="auth-card">
        <button className="back-link" onClick={() => navigate(ROUTES.AUTH_LOGIN)} type="button">
          ← Volver al inicio de sesión
        </button>
        <div className="auth-heading">
          <span className="small-mark">
            <AuthModeIcon mode="register" size={28} />
          </span>
          <div>
            <h2 id="register-title">Crear cuenta de estudiante</h2>
            <p>
              Regístrate con tu correo. Profesores y administradores reciben acceso desde el panel
              administrativo.
            </p>
          </div>
        </div>

        <form className="auth-form" noValidate onSubmit={submitRegistration}>
          <FormField
            autoComplete="name"
            error={fieldErrors.fullName}
            id="auth-fullName"
            icon="user"
            label="Nombre completo"
            name="fullName"
            onChange={(value) => updateField('fullName', value)}
            placeholder="Isaac Newton"
            required
            value={authForm.fullName}
          />
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
            autoComplete="new-password"
            error={fieldErrors.password}
            hint="Usa al menos 6 caracteres."
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
          <button
            aria-busy={authLoading}
            className="primary-auth-button"
            disabled={authLoading}
            type="submit"
          >
            {authLoading ? 'Procesando...' : 'Crear cuenta'} <span>→</span>
          </button>
          <StatusMessage message={systemMessage} />
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta?
          <button onClick={() => navigate(ROUTES.AUTH_LOGIN)} type="button">
            Inicia sesión
          </button>
        </p>
      </section>
    </main>
  );
}
