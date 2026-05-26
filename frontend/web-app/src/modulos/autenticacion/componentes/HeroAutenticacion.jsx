import { BrandLogo } from '../../../compartido/componentes/Iconos.jsx';
import './HeroAutenticacion.css';

export default function HeroAutenticacion() {
  return (
    <section className="auth-hero">
      <div className="logo-card">
        <BrandLogo size={56} />
        <div>
          <strong>PhysicsPlay</strong>
          <small>Aprende y diviértete</small>
        </div>
      </div>
      <h1>
        Donde la <span>energía</span> se convierte en <strong>conocimiento.</strong>
      </h1>
      <div className="lab-preview" aria-hidden="true">
        <div className="beam" />
        <div className="orbit orbit-a" />
        <div className="orbit orbit-b" />
        <div className="core" />
      </div>
      <p>Practica física con misiones, retroalimentación inmediata e IA educativa. Accede solo con tu correo y contraseña.</p>
    </section>
  );
}
