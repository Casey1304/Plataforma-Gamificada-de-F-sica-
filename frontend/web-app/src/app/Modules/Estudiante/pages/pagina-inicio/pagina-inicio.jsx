import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/Core/Models/rutas.js';
import { STUDENT_NAV_LINKS } from '@/app/Core/Models/navegacion.js';
import { useApp } from '@/app/Core/Context/usar-app.js';
import '../paginas-estudiante.css';

export function DashboardPage() {
  const { user } = useApp();
  const quickLinks = STUDENT_NAV_LINKS.filter((link) => link.id !== 'inicio');

  return (
    <section className="student-page student-page-wide student-home">
      <div className="student-page-header home-header-modern">
        <span>Panel del estudiante</span>
        <h1>Hola, {user.name.split(' ')[0]}</h1>
        <p>
          Accede rápidamente a tus retos, progreso, ranking, tutor IA y notas personales.
        </p>

        <Link className="home-primary-action" to={ROUTES.APP_CHALLENGES}>
          Comenzar práctica
        </Link>
      </div>

      <div className="home-quick-links home-quick-modern">
        {quickLinks.map((link) => (
          <Link
            className={`home-quick-card home-card-${link.id}`}
            key={link.id}
            to={link.path}
          >
            <div className="home-card-line"></div>
            <strong>{link.label}</strong>
            <span>{link.description}</span>
            <small>Ingresar</small>
          </Link>
        ))}
      </div>

      <div className="home-study-banner">
        <div>
          <strong>Continúa mejorando tu aprendizaje</strong>
          <p>Practica constantemente para dominar los conceptos de física dinámica.</p>
        </div>
        <Link to={ROUTES.APP_CHALLENGES}>Ir a retos</Link>
      </div>
    </section>
  );
}