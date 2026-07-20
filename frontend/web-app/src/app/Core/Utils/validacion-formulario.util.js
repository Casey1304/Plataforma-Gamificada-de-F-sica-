const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthForm({ email, fullName, password }, includeName = false) {
  const errors = {};

  if (includeName && !fullName.trim()) {
    errors.fullName = 'Escribe tu nombre completo.';
  }

  if (!email.trim()) {
    errors.email = 'Escribe tu correo electrónico.';
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Usa un correo con formato nombre@dominio.com.';
  }

  if (!password) {
    errors.password = 'Escribe tu contraseña.';
  } else if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  }

  return errors;
}

export function focusFirstInvalidField(errors) {
  const firstField = Object.keys(errors)[0];
  if (!firstField) {
    return;
  }

  window.requestAnimationFrame(() => {
    document.getElementById(`auth-${firstField}`)?.focus();
  });
}
