import { TAREAS } from "../datos.js";

/**
 * `load` se ejecuta en el servidor y lo que devuelve llega al componente ya
 * pintado. Pero además **se serializa dentro del HTML**, porque el navegador
 * necesita ese mismo objeto para volver a construir el componente al hidratarlo.
 *
 * Ese es el momento exacto en el que el dato empieza a viajar dos veces, y es
 * inevitable: si el navegador no recibiera el estado, tendría que volver a
 * pedirlo, y entonces la pantalla parpadearía.
 */
export function load() {
  return { tareas: TAREAS };
}
