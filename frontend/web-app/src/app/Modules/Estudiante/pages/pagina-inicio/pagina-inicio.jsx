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
      <div className="student-page-header">
        <span>Bienvenido</span>
        <h1>Hola, {user.name.split(' ')[0]}</h1>
        <p>
          Elige una sección del menu lateral o usa un acceso rápido.
        </p>
      </div>

      <div className="home-quick-links">
        {quickLinks.map((link) => (
          <Link className="home-quick-card" key={link.id} to={link.path}>
            <strong>{link.label}</strong>
            <span>{link.description}</span>
          </Link>
        ))}
      </div>

      <p className="home-hint">
        Listo para practicar? Ve directo a <Link to={ROUTES.APP_CHALLENGES}>Retos</Link>.
      </p>
    </section>
  );
}
