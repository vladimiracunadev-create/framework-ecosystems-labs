/** LA REGLA VIVE CON EL ESTADO, y fuera del elemento. */
export function siguiente(valorActual, paso) {
  return Math.max(0, valorActual + paso);
}
