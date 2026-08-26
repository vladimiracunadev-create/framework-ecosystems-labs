import { useLoaderData } from "@remix-run/react";

import { ARTICULO, grafoDelArticulo } from "../datos.js";

export function loader({ request }) {
  const origen = new URL(request.url).origin;
  return { origen, grafo: grafoDelArticulo(origen) };
}

export const meta = ({ data }) => {
  const canonica = `${data.origen}${ARTICULO.ruta}`;
  return [
    { title: ARTICULO.titulo },
    { name: "description", content: ARTICULO.descripcion },
    { tagName: "link", rel: "canonical", href: canonica },
    { property: "og:title", content: ARTICULO.titulo },
    { property: "og:description", content: ARTICULO.descripcion },
    { property: "og:type", content: ARTICULO.tipo },
    { property: "og:url", content: canonica },
  ];
};

export default function Articulo() {
  const { grafo } = useLoaderData();
  return (
    <>
      <h1>{ARTICULO.titulo}</h1>
      <p>{ARTICULO.descripcion}</p>
      {/* El grafo, otra vez fuera de la API dedicada. Son cinco frameworks y
          cinco veces la misma excepción. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(grafo) }}
      />
    </>
  );
}
