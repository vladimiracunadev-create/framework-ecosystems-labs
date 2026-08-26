import { headers } from "next/headers";

import { ARTICULO, grafoDelArticulo } from "../../datos.js";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const origen = `http://${(await headers()).get("host")}`;
  return {
    title: ARTICULO.titulo,
    description: ARTICULO.descripcion,
    alternates: { canonical: `${origen}${ARTICULO.ruta}` },
    openGraph: {
      title: ARTICULO.titulo,
      description: ARTICULO.descripcion,
      type: ARTICULO.tipo,
      url: `${origen}${ARTICULO.ruta}`,
    },
  };
}

export default async function Pagina() {
  const origen = `http://${(await headers()).get("host")}`;
  return (
    <>
      <h1>{ARTICULO.titulo}</h1>
      <p>{ARTICULO.descripcion}</p>
      {/*
        El grafo de schema.org no cabe en el objeto de `generateMetadata`, así
        que se escribe como una etiqueta más. Es el recordatorio de que una API
        dedicada cubre lo previsto, y lo no previsto vuelve al método manual.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(grafoDelArticulo(origen)) }}
      />
    </>
  );
}
