import { FieldIcon } from '@/app/Shared/Components/iconos/iconos.jsx';

export function FormField({
  autoComplete,
  error,
  hint,
  icon,
  id,
  label,
  name,
  onChange,
  placeholder,
  type = 'text',
  value,
  required = false,
  minLength
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="form-field">
      <label className="field-label" htmlFor={id}>
        {label}
        {required && (
          <span className="required-label">
            <span aria-hidden="true"> *</span>
            <span className="sr-only">, obligatorio</span>
          </span>
        )}
      </label>
      {hint && (
        <small className="field-hint" id={hintId}>
          {hint}
        </small>
      )}
      <span className={error ? 'field-shell field-shell--error' : 'field-shell'}>
        <FieldIcon name={icon} />
        <input
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          id={id}
          minLength={minLength}
          name={name}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
        />
      </span>
      {error && (
        <small className="field-error" id={errorId} role="alert">
          Error: {error}
        </small>
      )}
    </div>
  );
}
