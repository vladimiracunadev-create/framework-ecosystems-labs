/**
 * EL MANEJADOR DEL PADRE, fuera del componente.
 *
 * En un proyecto de Angular esto viviría en un servicio inyectable — la clase
 * 036 explica por qué. Aquí es una función suelta por la misma razón que en las
 * otras siete: para que se pueda llamar sin arrancar nada.
 */
export function alRecibirCambio(valorActual: number, paso: number): number {
  return valorActual + paso;
}
