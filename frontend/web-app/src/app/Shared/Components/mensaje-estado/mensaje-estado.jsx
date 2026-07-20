export function StatusMessage({ id, message, type = 'error' }) {
  if (!message) {
    return null;
  }

  const isError = type === 'error';

  return (
    <p
      aria-atomic="true"
      aria-live={isError ? 'assertive' : 'polite'}
      className={`system-message system-message--${type}`}
      id={id}
      role={isError ? 'alert' : 'status'}
    >
      <strong>{isError ? 'Revisa lo siguiente:' : 'Listo:'}</strong> {message}
    </p>
  );
}
