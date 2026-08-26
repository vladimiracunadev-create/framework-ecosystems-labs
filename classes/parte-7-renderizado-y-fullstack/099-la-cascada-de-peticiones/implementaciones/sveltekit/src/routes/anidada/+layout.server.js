import { pedirUsuario } from "$lib/fuente.js";

/**
 * LA CARGA DE LA DISPOSICIÓN, QUE NO BLOQUEA A LA DE LA PÁGINA.
 *
 * SvelteKit resuelve la ruta entera antes de cargar nada: sabe que esta petición
 * activa esta disposición y esta página, y lanza sus dos `load` a la vez.
 *
 * La diferencia con un framework que carga y pinta en cascada por el árbol de
 * componentes se mide en `/cascada.json`, y es de sesenta milisegundos por cada
 * nivel de anidamiento.
 */
export async function load() {
  return { usuario: await pedirUsuario() };
}
