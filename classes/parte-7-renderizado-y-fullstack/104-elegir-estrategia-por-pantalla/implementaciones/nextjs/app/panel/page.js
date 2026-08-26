import { sello, ventasDeHoy } from "../datos.js";

export const dynamic = "force-dynamic";

/**
 * LA SEGUNDA PANTALLA: el panel, en cada petición.
 *
 * La pantalla de al lado, con la misma línea y el valor contrario. Esa
 * proximidad es el argumento de esta clase: la decisión vive con la pantalla, no
 * en un ajuste del proyecto, y por eso se puede tomar pantalla a pantalla sin
 * pedir permiso a nadie.
 */
export default function Pagina() {
  const ventas = ventasDeHoy();
  return (
    <>
      <h1>Panel</h1>
      {/* Una sola expresión y no tres: React separa los trozos de texto con
          comentarios en el HTML, y entonces «12 pedidos» deja de estar seguido.
          Es invisible en pantalla y se ve en cuanto algo lee la respuesta. */}
      <p data-estrategia="servidor" data-sello={sello()}>
        {`${ventas.pedidos} pedidos, ${ventas.importe} euros`}
      </p>
    </>
  );
}
