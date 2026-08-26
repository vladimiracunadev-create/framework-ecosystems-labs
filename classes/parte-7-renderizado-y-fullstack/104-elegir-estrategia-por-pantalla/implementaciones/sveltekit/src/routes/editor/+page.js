export const prerender = true;

/**
 * LA TERCERA PANTALLA, y aquí hubo una decisión que merece contarse.
 *
 * SvelteKit tiene la declaración más explícita de las cinco para esto:
 * `ssr = false` dice literalmente «esta pantalla no se renderiza en el
 * servidor». Se probó y se quitó, por un motivo que se ve en el HTML: con
 * `ssr = false` **no se renderiza ni el hueco**. El documento llega con un
 * `<div>` vacío, sin la lista, sin la marca de «cargando» y sin nada donde
 * reservar el espacio.
 *
 * Con solo `prerender = true`, el armazón sí se genera al construir —es un
 * archivo estático— y el navegador lo rellena. La pantalla llega vacía de datos
 * pero no de estructura, que es lo que evita que salte al llegar el contenido.
 *
 * La diferencia entre las dos formas de «renderizar en el cliente» no está en
 * ninguna comparativa y se ve en dos líneas de `curl`.
 */
