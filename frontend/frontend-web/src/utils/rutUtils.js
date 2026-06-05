export function normalizeRut(input) {
  return (input || '').replace(/[^0-9kK]/g, '').toUpperCase();
}
