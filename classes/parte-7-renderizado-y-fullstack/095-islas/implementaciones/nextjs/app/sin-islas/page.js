import Articulo from "../Articulo.jsx";

export const dynamic = "force-dynamic";

/**
 * El mismo artículo sin las dos zonas vivas. Ningún componente de esta pantalla
 * lleva `"use client"`.
 *
 * Aun así llega con `<script>`: Next arranca su tiempo de ejecución en toda
 * página del App Router para poder navegar sin recargar. La diferencia con `/`
 * es real y se mide, pero no baja a cero como en Astro.
 */
export default function Pagina() {
  return (
    <>
      <h1>Sin islas</h1>
      <Articulo />
    </>
  );
}
