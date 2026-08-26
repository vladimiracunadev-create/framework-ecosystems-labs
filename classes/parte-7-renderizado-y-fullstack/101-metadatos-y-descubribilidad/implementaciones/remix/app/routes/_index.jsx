import { useLoaderData } from "@remix-run/react";

import { PORTADA } from "../datos.js";

/**
 * `meta` DEVUELVE UNA LISTA DE DESCRIPTORES, NO ETIQUETAS.
 *
 * Cada elemento es un objeto y Remix decide qué etiqueta le corresponde: `title`
 * se convierte en `<title>`, `name` en `<meta name>`, `property` en
 * `<meta property>`, `tagName: "link"` en `<link>`. Es un punto intermedio entre
 * el objeto cerrado de Next y las etiquetas sueltas de Astro.
 *
 * Y recibe `data`, que es lo que devolvió el `loader`: el título puede depender
 * del dato que se cargó, sin volver a pedirlo.
 */
export function loader({ request }) {
  return { origen: new URL(request.url).origin };
}

export const meta = ({ data }) => {
  const canonica = `${data.origen}${PORTADA.ruta}`;
  return [
    { title: PORTADA.titulo },
    { name: "description", content: PORTADA.descripcion },
    { tagName: "link", rel: "canonical", href: canonica },
    { property: "og:title", content: PORTADA.titulo },
    { property: "og:description", content: PORTADA.descripcion },
    { property: "og:type", content: PORTADA.tipo },
    { property: "og:url", content: canonica },
  ];
};

export default function Portada() {
  useLoaderData();
  return (
    <>
      <h1>{PORTADA.titulo}</h1>
      <a href="/articulo/hola-mundo">un artículo</a>
    </>
  );
}
