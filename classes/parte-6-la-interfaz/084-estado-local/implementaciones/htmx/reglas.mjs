/** LA REGLA VIVE CON EL ESTADO — y en htmx el estado vive en el servidor. */
export function siguiente(valorActual, paso) {
  return Math.max(0, valorActual + paso);
}
