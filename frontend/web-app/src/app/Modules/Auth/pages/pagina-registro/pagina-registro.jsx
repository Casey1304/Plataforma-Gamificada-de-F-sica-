import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '@/app/Core/Context/usar-app.js';
import { ROUTES, initialRouteByRole } from '@/app/Core/Models/rutas.js';
import { AuthModeIcon } from '@/app/Shared/Components/iconos/iconos.jsx';
import { AuthHero } from '@/app/Shared/Components/portada-auth/portada-auth.jsx';
import { FormField } from '@/app/Shared/Components/campo-formulario/campo-formulario.jsx';
import '../pagina-login/pagina-login.css';

export function RegisterPage() {
  const navigate = useNavigate();
  const { user, authForm, updateAuthField, registerUser, authLoading, systemMessage, onboardingComplete } =
    useApp();

  if (user?.userId) {
    return <Navigate replace to={initialRouteByRole(user.role, onboardingComplete)} />;
  }

  return (
    <main className="auth-shell">
      <AuthHero />
      <section className="auth-card">
        <button className="back-link" onClick={() => navigate(ROUTES.AUTH_LOGIN)} type="button">
          ← Volver al inicio de sesión
        </button>
        <div className="auth-heading">
          <span className="small-mark">
            <AuthModeIcon mode="register" size={28} />
          </span>
          <div>
            <h2>Crear cuenta de estudiante</h2>
            <p>
              Regístrate con tu correo. Profesores y administradores reciben acceso desde el panel
              administrativo.
            </p>
          </div>
        </div>

        <form className="auth-form" onSubmit={registerUser}>
          <FormField
            icon="user"
            label="Nombre completo"
            onChange={(value) => updateAuthField('fullName', value)}
            placeholder="Isaac Newton"
            required
            value={authForm.fullName}
          />
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
          <button className="primary-auth-button" disabled={authLoading} type="submit">
            {authLoading ? 'Procesando...' : 'Crear cuenta'} <span>→</span>
          </button>
          {systemMessage && <p className="system-message">{systemMessage}</p>}
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
