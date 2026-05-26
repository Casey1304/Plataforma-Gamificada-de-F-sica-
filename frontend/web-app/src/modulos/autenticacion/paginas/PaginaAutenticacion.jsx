import CampoFormulario from '../../../compartido/componentes/CampoFormulario.jsx';
import { AuthModeIcon } from '../../../compartido/componentes/Iconos.jsx';
import HeroAutenticacion from '../componentes/HeroAutenticacion.jsx';
import './PaginaAutenticacion.css';

export default function PaginaAutenticacion({
  authForm,
  mode,
  onChange,
  onSubmit,
  switchMode,
  systemMessage,
  loading
}) {
  const isRegister = mode === 'register';

  return (
    <main className="auth-shell">
      <HeroAutenticacion />

      <section className="auth-card">
        {isRegister && (
          <button className="back-link" onClick={switchMode} type="button">
            ← Volver al inicio de sesión
          </button>
        )}
        <div className="auth-heading">
          <span className="small-mark">
            <AuthModeIcon mode={isRegister ? 'register' : 'login'} size={28} />
          </span>
          <div>
            <h2>{isRegister ? 'Crear cuenta de estudiante' : 'Bienvenido de nuevo'}</h2>
            <p>
              {isRegister
                ? 'Regístrate con tu correo. Profesores y administradores reciben acceso desde el panel administrativo.'
                : 'Inicia sesión con el correo y la contraseña de tu cuenta.'}
            </p>
          </div>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {isRegister && (
            <CampoFormulario
              icon="user"
              label="Nombre completo"
              onChange={(value) => onChange('fullName', value)}
              placeholder="Isaac Newton"
              required
              value={authForm.fullName}
            />
          )}
          <CampoFormulario
            icon="email"
            label="Correo electrónico"
            onChange={(value) => onChange('email', value)}
            placeholder="ejemplo@physics.edu"
            required
            type="email"
            value={authForm.email}
          />
          <CampoFormulario
            icon="lock"
            label="Contraseña"
            minLength={6}
            onChange={(value) => onChange('password', value)}
            placeholder="Mínimo 6 caracteres"
            required
            type="password"
            value={authForm.password}
          />

          {!isRegister && (
            <div className="auth-options">
              <label>
                <input
                  checked={authForm.remember}
                  onChange={(event) => onChange('remember', event.target.checked)}
                  type="checkbox"
                />
                Recordarme
              </label>
            </div>
          )}

          <button className="primary-auth-button" disabled={loading} type="submit">
            {loading ? 'Procesando...' : isRegister ? 'Crear cuenta' : 'Iniciar sesión'} <span>→</span>
          </button>
          {systemMessage && <p className="system-message">{systemMessage}</p>}
        </form>

        <p className="auth-switch">
          {isRegister ? '¿Ya tienes cuenta?' : '¿Eres estudiante y no tienes cuenta?'}
          <button onClick={switchMode} type="button">
            {isRegister ? 'Inicia sesión' : 'Regístrate gratis'}
          </button>
        </p>
      </section>
    </main>
  );
}
