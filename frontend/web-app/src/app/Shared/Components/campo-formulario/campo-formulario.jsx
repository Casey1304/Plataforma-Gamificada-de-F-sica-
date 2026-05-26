import { FieldIcon } from '@/app/Shared/Components/iconos/iconos.jsx';

export function FormField({
  icon,
  label,
  onChange,
  placeholder,
  type = 'text',
  value,
  required = false,
  minLength
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <span className="field-shell">
        <FieldIcon name={icon} />
        <input
          minLength={minLength}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
        />
      </span>
    </label>
  );
}
