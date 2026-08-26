import { enParalelo } from "$lib/fuente.js";

/** El mismo `load` con `Promise.all`. */
export async function load() {
  return { datos: await enParalelo() };
}
