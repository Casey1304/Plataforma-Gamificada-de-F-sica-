import './diagrama-fisica.css';

export function PhysicsDiagram({ challenge }) {
  if (challenge.showDiagram === false) {
    return null;
  }

  return (
    <figure className="physics-figure">
      <div aria-hidden="true" className="vector-diagram">
        <div className="motion-aura" />
        <div className="block">{challenge.massLabel}</div>
        <div className="arrow-line" />
        <strong>{challenge.vectorLabel}</strong>
      </div>
      <div aria-hidden="true" className="ground-line" />
      <figcaption className="sr-only">
        Diagrama del ejercicio: un bloque con {challenge.massLabel} y un vector de{' '}
        {challenge.vectorLabel}.
      </figcaption>
    </figure>
  );
}
