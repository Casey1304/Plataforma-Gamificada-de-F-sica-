import { useEffect, useState } from 'react';
import EncabezadoPagina from '../../../compartido/componentes/EncabezadoPagina.jsx';
import { AdminIcon, MetricIcon } from '../../../compartido/componentes/Iconos.jsx';
import {
  actualizarUsuarioAdmin,
  crearUsuarioAdmin,
  detalleEstudianteAdmin,
  listarEstudiantesAdmin,
  listarUsuariosAdmin
} from '../../../nucleo/servicios/api.js';
import { formatNumber } from '../../../nucleo/utilidades/formato.js';
import './PaginaAdministrador.css';

export default function PaginaAdministrador({ user, onLogout, systemMessage, setSystemMessage }) {
  const [usuarios, setUsuarios] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombreCompleto: '',
    correoElectronico: '',
    contrasena: '',
    rol: 'estudiante'
  });

  async function cargarDatos() {
    try {
      const [usuariosData, estudiantesData] = await Promise.all([
        listarUsuariosAdmin(user.userId),
        listarEstudiantesAdmin(user.userId)
      ]);
      setUsuarios(usuariosData);
      setEstudiantes(estudiantesData);
      setSystemMessage('');
    } catch (error) {
      setSystemMessage(error.message);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, [user.userId]);

  async function crearUsuario(event) {
    event.preventDefault();
    try {
      await crearUsuarioAdmin(user.userId, {
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
      await actualizarUsuarioAdmin(user.userId, usuarioId, { estado, rol: null });
      await cargarDatos();
    } catch (error) {
      setSystemMessage(error.message);
    }
  }

  async function verDetalle(studentId) {
    try {
      const data = await detalleEstudianteAdmin(user.userId, studentId);
      setDetalle(data);
    } catch (error) {
      setSystemMessage(error.message);
    }
  }

  return (
    <main className="management-shell app-page-shell">
      <EncabezadoPagina
        onLogout={onLogout}
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
