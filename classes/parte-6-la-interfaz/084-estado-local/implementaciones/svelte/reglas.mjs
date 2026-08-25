/**
 * LA REGLA VIVE CON EL ESTADO, y fuera del componente.
 *
 * En un archivo `.mjs` porque no necesita compilarse: es JavaScript corriente,
 * se prueba sola y la usan tanto el componente como el contrato.
 */
export function siguiente(valorActual, paso) {
  return Math.max(0, valorActual + paso);
}
