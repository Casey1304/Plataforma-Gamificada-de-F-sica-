import { useCallback, useEffect, useState } from 'react';
import { useApp } from '@/app/Core/Context/usar-app.js';
import { PageHeader } from '@/app/Shared/Components/encabezado-pagina/encabezado-pagina.jsx';
import { ClassroomIcon, UserAvatar } from '@/app/Shared/Components/iconos/iconos.jsx';
import { StatusMessage } from '@/app/Shared/Components/mensaje-estado/mensaje-estado.jsx';
import {
  createClassroom,
  getStudentDetail,
  enrollStudent,
  listClassrooms,
  listAvailableStudents,
  listStudents
} from '@/app/Core/Services/servicio-profesor.js';
import { formatNumber } from '@/app/Core/Utils/formato.util.js';
import './pagina-panel-profesor.css';

export function TeacherDashboardPage() {
  const { user, logout, systemMessage, setSystemMessage } = useApp();
  const [aulas, setAulas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [disponibles, setDisponibles] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [nuevaAula, setNuevaAula] = useState('');
  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);
  const [estudianteInscribir, setEstudianteInscribir] = useState('');

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    try {
      const [aulasData, estudiantesData, disponiblesData] = await Promise.all([
        listClassrooms(user.userId),
        listStudents(user.userId),
        listAvailableStudents(user.userId)
      ]);
      setAulas(aulasData);
      setEstudiantes(estudiantesData);
      setDisponibles(disponiblesData);
      setAulaSeleccionada((current) => current ?? aulasData[0]?.id ?? null);
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

  async function crearAula(event) {
    event.preventDefault();
    if (!nuevaAula.trim()) {
      setSystemMessage('Escribe un nombre para el aula.');
      return;
    }
    setIsCreating(true);
    setSuccessMessage('');
    try {
      await createClassroom(user.userId, { nombre: nuevaAula.trim(), grado: '5to de secundaria' });
      setNuevaAula('');
      await cargarDatos();
      setSuccessMessage('El aula se creó correctamente.');
    } catch (error) {
      setSystemMessage(error.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function inscribir(event) {
    event.preventDefault();
    if (!aulaSeleccionada || !estudianteInscribir) {
      setSystemMessage('Selecciona un aula y una persona estudiante para continuar.');
      return;
    }
    setIsEnrolling(true);
    setSuccessMessage('');
    try {
      await enrollStudent(user.userId, aulaSeleccionada, Number(estudianteInscribir));
      setEstudianteInscribir('');
      await cargarDatos();
      setSuccessMessage('La inscripción se completó correctamente.');
    } catch (error) {
      setSystemMessage(error.message);
    } finally {
      setIsEnrolling(false);
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
        subtitle="Supervisión de estudiantes"
        title="Panel del profesor"
        user={user}
      />

      <StatusMessage message={systemMessage} />
      <StatusMessage message={successMessage} type="success" />
      {isLoading && (
        <p aria-live="polite" className="loading-message" role="status">
          Cargando aulas y estudiantes...
        </p>
      )}

      <section className="management-grid">
        <article className="management-card">
          <h2><ClassroomIcon /> Mis aulas</h2>
          <form className="inline-form" onSubmit={crearAula}>
            <label className="field-block" htmlFor="classroom-name">
              <span>Nombre del aula <span aria-hidden="true">*</span></span>
              <input
                id="classroom-name"
                onChange={(event) => setNuevaAula(event.target.value)}
                placeholder="Ejemplo: 5to A"
                required
                value={nuevaAula}
              />
            </label>
            <button
              aria-busy={isCreating}
              className="primary-setup-button"
              disabled={isCreating}
              type="submit"
            >
              {isCreating ? 'Creando aula...' : 'Crear aula'}
            </button>
          </form>
          <ul className="data-list">
            {aulas.map((aula) => (
              <li key={aula.id}>
                <strong>{aula.name}</strong>
                <span>{aula.enrolledStudents} estudiantes</span>
              </li>
            ))}
            {!isLoading && aulas.length === 0 && (
              <li className="empty-hint">Aún no tienes aulas registradas.</li>
            )}
          </ul>
        </article>

        <article className="management-card">
          <h2>Inscribir estudiante</h2>
          <form className="inline-form stacked" onSubmit={inscribir}>
            <label className="field-block" htmlFor="enrollment-classroom">
              <span>Aula <span aria-hidden="true">*</span></span>
              <select
                id="enrollment-classroom"
                onChange={(event) => setAulaSeleccionada(Number(event.target.value))}
                required
                value={aulaSeleccionada ?? ''}
              >
                <option value="">Selecciona un aula</option>
                {aulas.map((aula) => (
                  <option key={aula.id} value={aula.id}>{aula.name}</option>
                ))}
              </select>
            </label>
            <label className="field-block" htmlFor="enrollment-student">
              <span>Estudiante <span aria-hidden="true">*</span></span>
              <select
                id="enrollment-student"
                onChange={(event) => setEstudianteInscribir(event.target.value)}
                required
                value={estudianteInscribir}
              >
                <option value="">Selecciona una persona estudiante</option>
                {disponibles.map((est) => (
                  <option key={est.estudianteId} value={est.estudianteId}>{est.nombreCompleto}</option>
                ))}
              </select>
            </label>
            <button
              aria-busy={isEnrolling}
              className="primary-setup-button"
              disabled={isEnrolling || aulas.length === 0 || disponibles.length === 0}
              type="submit"
            >
              {isEnrolling ? 'Inscribiendo...' : 'Inscribir estudiante'}
            </button>
            {!isLoading && disponibles.length === 0 && (
              <p className="empty-hint">No hay estudiantes disponibles para inscribir.</p>
            )}
          </form>
        </article>

        <article className="management-card wide">
          <h2><UserAvatar size={28} /> Estudiantes supervisados</h2>
          <div className="table-scroll">
          <table className="data-table">
            <caption>Estudiantes supervisados y su progreso</caption>
            <thead>
              <tr>
                <th scope="col">Estudiante</th>
                <th scope="col">Nivel</th>
                <th scope="col">XP</th>
                <th scope="col">Precisión</th>
                <th scope="col">Tema por reforzar</th>
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
                  <td>{est.temaConMasErrores}</td>
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
          {estudiantes.length === 0 && (
            <p className="empty-hint">Crea un aula e inscribe estudiantes para ver su progreso.</p>
          )}
        </article>
      </section>

      {detalle && (
        <section aria-labelledby="teacher-detail-title" className="management-card detail-panel">
          <div className="detail-header">
            <h2 id="teacher-detail-title">Detalle: {detalle.resumen.nombreCompleto}</h2>
            <button aria-label="Cerrar detalle del estudiante" className="text-button" onClick={() => setDetalle(null)} type="button">Cerrar</button>
          </div>
          <p>{detalle.panelIa?.diagnosis}</p>
          <ul className="data-list">
            {detalle.progresoPorTema?.map((tema) => (
              <li key={tema.topicId}>
                Tema #{tema.topicId} — {tema.masteryLevel} — {tema.correctAnswers} correctas / {tema.incorrectAnswers} incorrectas
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

