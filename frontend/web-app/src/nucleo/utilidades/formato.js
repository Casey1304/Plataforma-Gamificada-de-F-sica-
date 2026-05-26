export function formatNumber(value) {
  return new Intl.NumberFormat('es-PE').format(value);
}

export function optionLetter(index) {
  return String.fromCharCode(65 + index);
}
