/**
 * EL MANEJADOR DEL PADRE, fuera de todo componente.
 *
 * Igual que en las otras siete: una función que calcula el estado siguiente a
 * partir del actual y del evento. No sabe nada de Solid, y por eso se prueba
 * sola.
 */
export function alRecibirCambio(valorActual, paso) {
  return valorActual + paso;
}
