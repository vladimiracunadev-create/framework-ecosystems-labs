/**
 * LOS DATOS. Con identidad propia, que es de lo que va esta clase.
 *
 * Cada fruta tiene un `id` que **no depende de su posición**. Esa es la única
 * condición que una clave tiene que cumplir: identificar al elemento, no al
 * hueco donde está hoy.
 */
export const FRUTAS = [
  { id: "a1", nombre: "Aguacate" },
  { id: "b2", nombre: "Berenjena" },
  { id: "c3", nombre: "Calabaza" },
];

export function frutas({ invertido = false, vacia = false } = {}) {
  if (vacia) return [];
  return invertido ? [...FRUTAS].reverse() : [...FRUTAS];
}

/** Dos elementos distintos con la MISMA clave: el caso que rompe la reconciliación. */
export const REPETIDAS = [
  { id: "x", nombre: "Primera" },
  { id: "x", nombre: "Segunda" },
];
