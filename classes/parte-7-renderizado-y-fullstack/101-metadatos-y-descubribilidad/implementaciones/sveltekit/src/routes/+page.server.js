import { PORTADA } from "$lib/datos.js";

export function load({ url }) {
  return { meta: PORTADA, origen: url.origin };
}
