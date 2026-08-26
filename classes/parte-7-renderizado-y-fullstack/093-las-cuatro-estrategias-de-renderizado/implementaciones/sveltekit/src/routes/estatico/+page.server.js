import { TAREAS, sello } from "../../datos.js";

/**
 * `prerender = true` manda esta ruta al lote estático.
 *
 * SvelteKit la ejecuta AL CONSTRUIR, guarda el HTML resultante y en producción
 * lo sirve como un archivo. `load` no se vuelve a ejecutar nunca.
 */
export const prerender = true;

export function load() {
  return { tareas: TAREAS, marca: sello(), estrategia: "estatico" };
}
