import { crear } from "../../almacen";

/**
 * NUXT NO TIENE ACCIONES DE FORMULARIO, Y ESTO ES LO QUE HAY QUE ESCRIBIR.
 *
 * El sufijo `.post` del nombre del archivo hace que esta ruta atienda solo los
 * POST a `/tareas`; los GET siguen llegando a la página. Funciona, y es una ruta
 * de servidor como cualquier otra: Nitro no sabe que tiene nada que ver con la
 * pantalla que la usa.
 *
 * Ahí está la diferencia con Remix y SvelteKit, y no es de sintaxis: allí el
 * framework sabe que una escritura acabada invalida lo que se había leído, y
 * vuelve a cargarlo. Aquí no hay nada que invalidar porque no hay relación
 * declarada entre las dos cosas.
 */
export default defineEventHandler(async (event) => {
  const formulario = await readFormData(event);
  if (formulario.get("intencion") === "crear") {
    crear(formulario.get("texto"));
  }
  return sendRedirect(event, "/tareas", 303);
});
