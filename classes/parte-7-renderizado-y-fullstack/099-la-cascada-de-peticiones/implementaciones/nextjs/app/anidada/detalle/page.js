import { pedirPedidos } from "../../fuente.js";

export const dynamic = "force-dynamic";

/** La página de dentro. Sus sesenta milisegundos empiezan cuando los del padre
 *  han terminado. */
export default async function Pagina() {
  const pedidos = await pedirPedidos();
  return <p data-capa="hija" data-pedidos={pedidos.length}>{pedidos.length} pedidos</p>;
}
