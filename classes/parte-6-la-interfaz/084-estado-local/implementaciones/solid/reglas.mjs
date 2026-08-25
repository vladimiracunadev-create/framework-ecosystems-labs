/** LA REGLA VIVE CON EL ESTADO, y fuera de todo framework. */
export function siguiente(valorActual, paso) {
  return Math.max(0, valorActual + paso);
}
