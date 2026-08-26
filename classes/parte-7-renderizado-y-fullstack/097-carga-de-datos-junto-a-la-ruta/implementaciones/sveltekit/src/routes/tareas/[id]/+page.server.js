import { error } from "@sveltejs/kit";

import { pedirUnaTarea } from "$lib/datos.js";

/**
 * `params` llega como argumento: la función de carga sabe de qué ruta es.
 *
 * Y `error(404, …)` lanza. SvelteKit lo recoge, pinta su página de error y manda
 * un 404 de verdad. Es la misma idea que `notFound()` en Next y que devolver una
 * `Response` en Astro: tres formas de decir lo mismo.
 */
export async function load({ params }) {
  const tarea = await pedirUnaTarea(params.id);
  if (!tarea) error(404, "esa tarea no existe");
  return { tarea };
}
