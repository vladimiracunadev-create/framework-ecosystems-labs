import { useLoaderData } from "@remix-run/react";

import { pedirPedidos } from "../fuente.js";

/** La ruta hija, con la suya. Sesenta milisegundos más, y en Remix no se suman. */
export async function loader() {
  return { pedidos: await pedirPedidos() };
}

export default function Detalle() {
  const { pedidos } = useLoaderData();
  return <p data-capa="hija" data-pedidos={pedidos.length}>{pedidos.length} pedidos</p>;
}
