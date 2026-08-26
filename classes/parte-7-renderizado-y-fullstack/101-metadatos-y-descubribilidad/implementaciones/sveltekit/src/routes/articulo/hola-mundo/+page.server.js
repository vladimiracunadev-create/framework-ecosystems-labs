import { ARTICULO, grafoDelArticulo } from "$lib/datos.js";

export function load({ url }) {
  return { meta: ARTICULO, origen: url.origin, grafo: grafoDelArticulo(url.origin) };
}
