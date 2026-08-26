import { sello, ventasDeHoy } from "../../datos.js";

export const prerender = false;

/**
 * LA SEGUNDA PANTALLA, con la línea contraria.
 *
 * En SvelteKit hay un detalle que conviene saber al tomar estas decisiones: el
 * adaptador manda por encima. Con `adapter-static` esta línea no serviría de
 * nada, porque no habría servidor donde ejecutarla. La decisión por pantalla
 * solo existe si el destino la permite.
 */
export function load() {
  return { ventas: ventasDeHoy(), marca: sello() };
}
