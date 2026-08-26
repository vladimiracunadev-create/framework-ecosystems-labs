import { pedirPedidos } from "$lib/fuente.js";

/** La carga de la página. Sesenta milisegundos que no se suman a los del padre. */
export async function load() {
  return { pedidos: await pedirPedidos() };
}
