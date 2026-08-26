import { nombreDeQuienMira, pedirLaLista } from "$lib/fuente.js";

/** El mismo `load` con el `await` puesto. Una palabra de diferencia, y la
 *  respuesta pasa de llegar en dos tandas a llegar de golpe. */
export async function load() {
  return {
    nombre: nombreDeQuienMira(),
    tareas: await pedirLaLista(),
  };
}
