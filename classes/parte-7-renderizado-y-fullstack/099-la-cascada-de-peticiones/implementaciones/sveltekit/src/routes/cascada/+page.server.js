import { enCascada } from "$lib/fuente.js";

/** Tres `await` seguidos dentro de `load`. Tener la carga junto a la ruta no
 *  impide escribir una cascada. */
export async function load() {
  return { datos: await enCascada() };
}
