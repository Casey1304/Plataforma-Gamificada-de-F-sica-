import { FieldIcon } from './Iconos.jsx';

export default function CampoFormulario({
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
    <label className="field-block">
      <span>{label}</span>
      <div className="field-control">
        <FieldIcon name={icon} />
        <input
          minLength={minLength}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
        />
      </div>
    </label>
  );
}
