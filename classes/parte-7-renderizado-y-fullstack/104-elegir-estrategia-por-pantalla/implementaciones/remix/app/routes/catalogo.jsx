import { useLoaderData } from "@remix-run/react";

import { PRODUCTOS, sello } from "../datos.js";

/**
 * EL SELLO SE CALCULA UNA VEZ, AL CARGARSE EL MÓDULO.
 *
 * Es lo más parecido a una página estática que Remix ofrece, y no es lo mismo:
 * aquí el servidor SÍ trabaja en cada petición —renderiza el componente— y lo
 * único constante es el dato. En los otros cuatro, el servidor no ejecuta nada
 * porque el HTML ya existe.
 *
 * Decirlo importa: el contrato ve el mismo sello dos veces en los cinco, y solo
 * en cuatro de ellos eso significa lo que parece.
 */
const SELLO_DE_ARRANQUE = sello();

export function loader() {
  return { productos: PRODUCTOS, marca: SELLO_DE_ARRANQUE };
}

export function headers() {
  // La cabecera que en un despliegue real haría el trabajo de lo estático, y
  // que es toda la propuesta de Remix para esta clase.
  return { "Cache-Control": "public, max-age=3600" };
}

export default function Catalogo() {
  const { productos, marca } = useLoaderData();
  return (
    <>
      <h1>Catálogo</h1>
      <ul data-estrategia="estatico" data-sello={marca}>
        {productos.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </>
  );
}
