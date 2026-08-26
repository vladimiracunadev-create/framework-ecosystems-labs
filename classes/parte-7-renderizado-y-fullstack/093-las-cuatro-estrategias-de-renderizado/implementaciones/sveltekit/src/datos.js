/**
 * EL CONTENIDO, IDÉNTICO EN LAS TRES PANTALLAS, y el sello que las distingue.
 *
 * Mismo archivo que en las otras cuatro implementaciones de la clase: si el
 * contenido cambiara, la comparación mediría el contenido en lugar de la
 * estrategia.
 */
export const TAREAS = ["comprar pan", "regar las plantas", "llamar al taller"];

export function sello() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
