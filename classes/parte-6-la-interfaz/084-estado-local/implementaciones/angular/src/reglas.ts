/** LA REGLA VIVE CON EL ESTADO, y fuera del componente para poder probarla. */
export function siguiente(valorActual: number, paso: number): number {
  return Math.max(0, valorActual + paso);
}
