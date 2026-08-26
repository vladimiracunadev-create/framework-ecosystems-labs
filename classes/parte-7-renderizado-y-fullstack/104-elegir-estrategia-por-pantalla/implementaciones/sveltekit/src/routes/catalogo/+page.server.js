import { PRODUCTOS, sello } from "../../datos.js";

export const prerender = true;

/** LA PRIMERA PANTALLA. `prerender = true` hace que SvelteKit ejecute esta
 *  función AL CONSTRUIR y guarde el resultado. No se vuelve a ejecutar nunca. */
export function load() {
  return { productos: PRODUCTOS, marca: sello() };
}
