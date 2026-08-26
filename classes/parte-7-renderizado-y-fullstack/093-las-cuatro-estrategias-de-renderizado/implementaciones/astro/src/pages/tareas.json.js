export const prerender = true;

import { TAREAS } from "../datos.mjs";

/**
 * EL ORIGEN DE DATOS DE LA PANTALLA DE CLIENTE.
 *
 * Está aquí porque la estrategia de cliente **no incrusta el contenido en el
 * HTML**: lo pide después. Si estuviera incrustado, la página de cliente no
 * sería una página de cliente — sería una estática con un adorno.
 *
 * Y esa segunda petición es justo lo que se paga: el navegador descarga el HTML,
 * descarga el JavaScript, lo ejecuta, pide los datos y entonces pinta. Cuatro
 * pasos donde la estática tiene uno.
 */
export function GET() {
  return new Response(JSON.stringify({ tareas: TAREAS }), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
