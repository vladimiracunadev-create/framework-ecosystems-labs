import { pedirLasTareas } from "$lib/datos.js";

/**
 * ESTO SÍ TIENE NOMBRE, Y ESA ES TODA LA DIFERENCIA.
 *
 * `load` no es código dentro de la página: es una función con nombre y firma que
 * el framework conoce. Y como la conoce, puede hacer cosas con ella que en Astro
 * y en Next no son posibles:
 *
 *   - llamarla al pasar el ratón por encima de un enlace, antes de navegar;
 *   - ejecutarla en paralelo con la `load` de la ruta padre, en lugar de en
 *     cadena;
 *   - volver a llamarla cuando algo la invalide, sin recargar la página.
 *
 * Eso es lo que se compra al aceptar la ceremonia de un archivo aparte. La clase
 * 099 mide la segunda de las tres, que es la que más cuesta cara cuando falta.
 */
export async function load() {
  return { tareas: await pedirLasTareas() };
}
