import './diagrama-fisica.css';

export function PhysicsDiagram({ challenge }) {
  if (challenge.showDiagram === false) {
    return null;
  }

  return (
    <>
      <div className="vector-diagram">
        <div className="motion-aura" />
        <div className="block">{challenge.massLabel}</div>
        <div className="arrow-line" />
        <strong>{challenge.vectorLabel}</strong>
      </div>
      <div className="ground-line" />
    </>
  );
}
