import { useCallback, useEffect, useState } from 'react';
import { useApp } from '@/app/Core/Context/usar-app.js';
import { PageHeader } from '@/app/Shared/Components/encabezado-pagina/encabezado-pagina.jsx';
import { AdminIcon, MetricIcon } from '@/app/Shared/Components/iconos/iconos.jsx';
import { StatusMessage } from '@/app/Shared/Components/mensaje-estado/mensaje-estado.jsx';
import {
  updateUser,
  createUser,
  getStudentDetail,
  listStudents,
  listUsers
} from '@/app/Core/Services/servicio-admin.js';
import { formatNumber } from '@/app/Core/Utils/formato.util.js';
import './pagina-panel-admin.css';

export function AdminDashboardPage() {
  const { user, logout, systemMessage, setSystemMessage } = useApp();
  const [usuarios, setUsuarios] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyUserId, setBusyUserId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombreCompleto: '',
    correoElectronico: '',
    contrasena: '',
    rol: 'estudiante'
  });

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usuariosData, estudiantesData] = await Promise.all([
        listUsers(user.userId),
        listStudents(user.userId)
      ]);
      setUsuarios(usuariosData);
      setEstudiantes(estudiantesData);
      setSystemMessage('');
    } catch (error) {
      setSystemMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [setSystemMessage, user.userId]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  async function crearUsuario(event) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      await createUser(user.userId, {
        nombreCompleto: nuevoUsuario.nombreCompleto,
        correoElectronico: nuevoUsuario.correoElectronico,
        contrasena: nuevoUsuario.contrasena,
        rol: nuevoUsuario.rol,
        preferencias: null
      });
      setNuevoUsuario({ nombreCompleto: '', correoElectronico: '', contrasena: '', rol: 'estudiante' });
      await cargarDatos();
      setSuccessMessage('La cuenta se creó correctamente.');
    } catch (error) {
      setSystemMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function cambiarEstado(usuarioId, estado) {
    if (
      estado === 'inactivo' &&
      !window.confirm('¿Confirmas que deseas desactivar esta cuenta? La persona no podrá iniciar sesión.')
    ) {
      return;
    }
    setBusyUserId(usuarioId);
    setSuccessMessage('');
    try {
      await updateUser(user.userId, usuarioId, { estado, rol: null });
      await cargarDatos();
      setSuccessMessage(
        estado === 'activo' ? 'La cuenta quedó activa.' : 'La cuenta quedó desactivada.'
      );
    } catch (error) {
      setSystemMessage(error.message);
    } finally {
      setBusyUserId(null);
    }
  }

  async function verDetalle(studentId) {
    try {
      const data = await getStudentDetail(user.userId, studentId);
      setDetalle(data);
    } catch (error) {
      setSystemMessage(error.message);
    }
  }

  return (
    <main className="management-shell app-page-shell" id="main-content" tabIndex="-1">
      <PageHeader
        onLogout={logout}
        subtitle="Gestión de cuentas"
        title="Panel de administración"
        user={user}
      />

      <StatusMessage message={systemMessage} />
      <StatusMessage message={successMessage} type="success" />
      {isLoading && (
        <p aria-live="polite" className="loading-message" role="status">
          Cargando información del panel...
        </p>
      )}

      <section className="management-grid">
        <article className="management-card">
          <h2><AdminIcon /> Crear usuario del sistema</h2>
          <p className="card-hint">Los profesores y administradores solo se crean desde este panel.</p>
          <form className="inline-form stacked" onSubmit={crearUsuario}>
            <label className="field-block" htmlFor="admin-full-name">
              <span>Nombre completo <span aria-hidden="true">*</span></span>
              <input
                autoComplete="name"
                id="admin-full-name"
                onChange={(event) => setNuevoUsuario((c) => ({ ...c, nombreCompleto: event.target.value }))}
                required
                value={nuevoUsuario.nombreCompleto}
              />
            </label>
            <label className="field-block" htmlFor="admin-email">
              <span>Correo electrónico <span aria-hidden="true">*</span></span>
              <input
                autoComplete="email"
                id="admin-email"
                onChange={(event) => setNuevoUsuario((c) => ({ ...c, correoElectronico: event.target.value }))}
                required
                type="email"
                value={nuevoUsuario.correoElectronico}
              />
            </label>
            <label className="field-block" htmlFor="admin-password">
              <span>Contraseña temporal <span aria-hidden="true">*</span></span>
              <small className="field-hint" id="admin-password-hint">Mínimo 6 caracteres.</small>
              <input
                aria-describedby="admin-password-hint"
                autoComplete="new-password"
                id="admin-password"
                minLength="6"
                onChange={(event) => setNuevoUsuario((c) => ({ ...c, contrasena: event.target.value }))}
                required
                type="password"
                value={nuevoUsuario.contrasena}
              />
            </label>
            <label className="field-block" htmlFor="admin-role">
              <span>Rol <span aria-hidden="true">*</span></span>
              <select
                id="admin-role"
                onChange={(event) => setNuevoUsuario((c) => ({ ...c, rol: event.target.value }))}
                value={nuevoUsuario.rol}
              >
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor</option>
                <option value="administrador">Administrador</option>
              </select>
            </label>
            <button
              aria-busy={isSubmitting}
              className="primary-setup-button"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Creando cuenta...' : 'Crear usuario'}
            </button>
          </form>
        </article>

        <article className="management-card wide">
          <h2><AdminIcon /> Usuarios del sistema</h2>
          <div className="table-scroll">
          <table className="data-table">
            <caption>Usuarios registrados en PhysicsPlay</caption>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Rol</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.usuarioId}>
                  <td>{u.nombreCompleto}</td>
                  <td>{u.correoElectronico}</td>
                  <td>{u.rol}</td>
                  <td>{u.estado}</td>
                  <td className="action-cell">
                    {u.estado === 'activo' ? (
                      <button
                        className="text-button destructive-action"
                        disabled={busyUserId === u.usuarioId}
                        onClick={() => cambiarEstado(u.usuarioId, 'inactivo')}
                        type="button"
                      >
                        {busyUserId === u.usuarioId ? 'Procesando...' : 'Desactivar'}
                      </button>
                    ) : (
                      <button
                        className="text-button"
                        disabled={busyUserId === u.usuarioId}
                        onClick={() => cambiarEstado(u.usuarioId, 'activo')}
                        type="button"
                      >
                        {busyUserId === u.usuarioId ? 'Procesando...' : 'Activar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!isLoading && usuarios.length === 0 && (
                <tr>
                  <td colSpan="5">No hay usuarios para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </article>

        <article className="management-card wide">
          <h2><MetricIcon name="tema" /> Progreso de estudiantes</h2>
          <div className="table-scroll">
          <table className="data-table">
            <caption>Progreso general de estudiantes</caption>
            <thead>
              <tr>
                <th scope="col">Estudiante</th>
                <th scope="col">Nivel</th>
                <th scope="col">XP</th>
                <th scope="col">Precisión</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((est) => (
                <tr key={est.estudianteId}>
                  <td>{est.nombreCompleto}</td>
                  <td>{est.nivel}</td>
                  <td>{formatNumber(est.xp)}</td>
                  <td>{est.precisionPorcentaje}%</td>
                  <td>
                    <button className="text-button" onClick={() => verDetalle(est.estudianteId)} type="button">
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && estudiantes.length === 0 && (
                <tr>
                  <td colSpan="5">No hay datos de estudiantes para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </article>
      </section>

      {detalle && (
        <section aria-labelledby="admin-detail-title" className="management-card detail-panel">
          <div className="detail-header">
            <h2 id="admin-detail-title">Detalle: {detalle.resumen.nombreCompleto}</h2>
            <button aria-label="Cerrar detalle del estudiante" className="text-button" onClick={() => setDetalle(null)} type="button">Cerrar</button>
          </div>
          <p>{detalle.panelIa?.diagnosis}</p>
        </section>
      )}
    </main>
  );
}
