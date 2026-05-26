import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '@/app/Core/Context/usar-app.js';
import { ROUTES, initialRouteByRole } from '@/app/Core/Models/rutas.js';
import { AuthModeIcon } from '@/app/Shared/Components/iconos/iconos.jsx';
import { AuthHero } from '@/app/Shared/Components/portada-auth/portada-auth.jsx';
import { FormField } from '@/app/Shared/Components/campo-formulario/campo-formulario.jsx';
import './pagina-login.css';

/**
 * Pagina de inicio de sesion (/auth/login).
 * La logica de API esta en Core/Services/servicio-autenticacion.js via AppProvider.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { user, authForm, updateAuthField, loginUser, authLoading, systemMessage, onboardingComplete } =
    useApp();

  if (user?.userId) {
    return <Navigate replace to={initialRouteByRole(user.role, onboardingComplete)} />;
  }

  return (
    <main className="auth-shell">
      <AuthHero />
      <section className="auth-card">
        <div className="auth-heading">
          <span className="small-mark">
            <AuthModeIcon mode="login" size={28} />
          </span>
          <div>
            <h2>Bienvenido de nuevo</h2>
            <p>Inicia sesión con el correo y la contraseña de tu cuenta.</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={loginUser}>
          <FormField
            icon="email"
            label="Correo electrónico"
            onChange={(value) => updateAuthField('email', value)}
            placeholder="ejemplo@physics.edu"
            required
            type="email"
            value={authForm.email}
          />
          <FormField
            icon="lock"
            label="Contraseña"
            minLength={6}
            onChange={(value) => updateAuthField('password', value)}
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
          <button className="primary-auth-button" disabled={authLoading} type="submit">
            {authLoading ? 'Procesando...' : 'Iniciar sesión'} <span>→</span>
          </button>
          {systemMessage && <p className="system-message">{systemMessage}</p>}
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
