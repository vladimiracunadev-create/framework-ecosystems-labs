import { useLoaderData } from "@remix-run/react";

import { sello, ventasDeHoy } from "../datos.js";

/** LA SEGUNDA PANTALLA, que en Remix no necesita declarar nada porque no hay
 *  alternativa que declarar. Es el modelo por omisión y el único. */
export function loader() {
  return { ventas: ventasDeHoy(), marca: sello() };
}

export default function Panel() {
  const { ventas, marca } = useLoaderData();
  return (
    <>
      <h1>Panel</h1>
      {/* Una sola expresión y no tres: React separa los trozos de texto con
          comentarios en el HTML, y entonces «12 pedidos» deja de estar seguido. */}
      <p data-estrategia="servidor" data-sello={marca}>
        {`${ventas.pedidos} pedidos, ${ventas.importe} euros`}
      </p>
    </>
  );
}
