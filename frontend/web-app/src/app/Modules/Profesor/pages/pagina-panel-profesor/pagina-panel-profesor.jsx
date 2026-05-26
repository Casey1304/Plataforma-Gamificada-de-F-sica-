import { useCallback, useEffect, useState } from 'react';
import { useApp } from '@/app/Core/Context/usar-app.js';
import { PageHeader } from '@/app/Shared/Components/encabezado-pagina/encabezado-pagina.jsx';
import { ClassroomIcon, UserAvatar } from '@/app/Shared/Components/iconos/iconos.jsx';
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
  const [nuevaAula, setNuevaAula] = useState('');
  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);
  const [estudianteInscribir, setEstudianteInscribir] = useState('');

  const cargarDatos = useCallback(async () => {
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
    }
  }, [setSystemMessage, user.userId]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  async function crearAula() {
    if (!nuevaAula.trim()) {
      return;
    }
    try {
      await createClassroom(user.userId, { nombre: nuevaAula.trim(), grado: '5to de secundaria' });
      setNuevaAula('');
      await cargarDatos();
    } catch (error) {
      setSystemMessage(error.message);
    }
  }

  async function inscribir() {
    if (!aulaSeleccionada || !estudianteInscribir) {
      return;
    }
    try {
      await enrollStudent(user.userId, aulaSeleccionada, Number(estudianteInscribir));
      setEstudianteInscribir('');
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
        subtitle="Supervisión de estudiantes"
        title="Panel del profesor"
        user={user}
      />

      {systemMessage && <p className="system-message">{systemMessage}</p>}

      <section className="management-grid">
        <article className="management-card">
          <h2><ClassroomIcon /> Mis aulas</h2>
          <div className="inline-form">
            <input
              onChange={(event) => setNuevaAula(event.target.value)}
              placeholder="Nombre del aula, ej. 5to A"
              value={nuevaAula}
            />
            <button className="primary-setup-button" onClick={crearAula} type="button">Crear aula</button>
          </div>
          <ul className="data-list">
            {aulas.map((aula) => (
              <li key={aula.id}>
                <strong>{aula.name}</strong>
                <span>{aula.enrolledStudents} estudiantes</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="management-card">
          <h2>Inscribir estudiante</h2>
          <div className="inline-form stacked">
            <select onChange={(event) => setAulaSeleccionada(Number(event.target.value))} value={aulaSeleccionada ?? ''}>
              <option value="">Selecciona aula</option>
              {aulas.map((aula) => (
                <option key={aula.id} value={aula.id}>{aula.name}</option>
              ))}
            </select>
            <select onChange={(event) => setEstudianteInscribir(event.target.value)} value={estudianteInscribir}>
              <option value="">Selecciona estudiante</option>
              {disponibles.map((est) => (
                <option key={est.estudianteId} value={est.estudianteId}>{est.nombreCompleto}</option>
              ))}
            </select>
            <button className="primary-setup-button" onClick={inscribir} type="button">Inscribir</button>
          </div>
        </article>

        <article className="management-card wide">
          <h2><UserAvatar size={28} /> Estudiantes supervisados</h2>
          <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Nivel</th>
                <th>XP</th>
                <th>Precisión</th>
                <th>Tema débil</th>
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
        <section className="management-card detail-panel">
          <div className="detail-header">
            <h2>Detalle: {detalle.resumen.nombreCompleto}</h2>
            <button className="text-button" onClick={() => setDetalle(null)} type="button">Cerrar</button>
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

