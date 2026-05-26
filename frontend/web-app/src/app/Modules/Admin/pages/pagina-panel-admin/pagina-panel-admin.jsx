import { useCallback, useEffect, useState } from 'react';
import { useApp } from '@/app/Core/Context/usar-app.js';
import { PageHeader } from '@/app/Shared/Components/encabezado-pagina/encabezado-pagina.jsx';
import { AdminIcon, MetricIcon } from '@/app/Shared/Components/iconos/iconos.jsx';
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
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombreCompleto: '',
    correoElectronico: '',
    contrasena: '',
    rol: 'estudiante'
  });

  const cargarDatos = useCallback(async () => {
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
    }
  }, [setSystemMessage, user.userId]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  async function crearUsuario(event) {
    event.preventDefault();
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
    } catch (error) {
      setSystemMessage(error.message);
    }
  }

  async function cambiarEstado(usuarioId, estado) {
    try {
      await updateUser(user.userId, usuarioId, { estado, rol: null });
      await cargarDatos();
    } catch (error) {
      setSystemMessage(error.message);
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
    <main className="management-shell app-page-shell">
      <PageHeader
        onLogout={logout}
        subtitle="Gestión de cuentas"
        title="Panel de administración"
        user={user}
      />

      {systemMessage && <p className="system-message">{systemMessage}</p>}

      <section className="management-grid">
        <article className="management-card">
          <h2><AdminIcon /> Crear usuario del sistema</h2>
          <p className="card-hint">Los profesores y administradores solo se crean desde este panel.</p>
          <form className="inline-form stacked" onSubmit={crearUsuario}>
            <input
              onChange={(event) => setNuevoUsuario((c) => ({ ...c, nombreCompleto: event.target.value }))}
              placeholder="Nombre completo"
              required
              value={nuevoUsuario.nombreCompleto}
            />
            <input
              onChange={(event) => setNuevoUsuario((c) => ({ ...c, correoElectronico: event.target.value }))}
              placeholder="Correo"
              required
              type="email"
              value={nuevoUsuario.correoElectronico}
            />
            <input
              onChange={(event) => setNuevoUsuario((c) => ({ ...c, contrasena: event.target.value }))}
              placeholder="Contraseña (mín. 6)"
              required
              type="password"
              value={nuevoUsuario.contrasena}
            />
            <select
              onChange={(event) => setNuevoUsuario((c) => ({ ...c, rol: event.target.value }))}
              value={nuevoUsuario.rol}
            >
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
              <option value="administrador">Administrador</option>
            </select>
            <button className="primary-setup-button" type="submit">Crear usuario</button>
          </form>
        </article>

        <article className="management-card wide">
          <h2><AdminIcon /> Usuarios del sistema</h2>
          <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
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
                      <button className="text-button" onClick={() => cambiarEstado(u.usuarioId, 'inactivo')} type="button">
                        Desactivar
                      </button>
                    ) : (
                      <button className="text-button" onClick={() => cambiarEstado(u.usuarioId, 'activo')} type="button">
                        Activar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </article>

        <article className="management-card wide">
          <h2><MetricIcon name="tema" /> Progreso de estudiantes</h2>
          <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Nivel</th>
                <th>XP</th>
                <th>Precisión</th>
                <th />
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
            </tbody>
          </table>
          </div>
        </article>
      </section>

      {detalle && (
        <section className="management-card detail-panel">
          <div className="detail-header">
            <h2>Detalle: {detalle.resumen.nombreCompleto}</h2>
            <button className="text-button" onClick={() => setDetalle(null)} type="button">Cerrar</button>
          </div>
          <p>{detalle.panelIa?.diagnosis}</p>
        </section>
      )}
    </main>
  );
}
