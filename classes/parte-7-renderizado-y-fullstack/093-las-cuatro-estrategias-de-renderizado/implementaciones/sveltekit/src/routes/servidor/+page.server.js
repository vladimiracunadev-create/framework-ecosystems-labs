import { TAREAS, sello } from "../../datos.js";

/**
 * `prerender = false` deja esta ruta en el servidor.
 *
 * `load` se ejecuta en CADA petición, así que el sello cambia. Es la misma
 * función, el mismo componente y el mismo contenido: lo único distinto es esta
 * línea.
 */
export const prerender = false;

export function load() {
  return { tareas: TAREAS, marca: sello(), estrategia: "servidor" };
}
