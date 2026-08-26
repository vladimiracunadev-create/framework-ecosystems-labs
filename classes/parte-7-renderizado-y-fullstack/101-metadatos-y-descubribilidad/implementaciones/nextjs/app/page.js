import { headers } from "next/headers";

import { PORTADA } from "./datos.js";

export const dynamic = "force-dynamic";

/**
 * `generateMetadata` ES UNA API DEDICADA, Y ESO CAMBIA LO QUE PUEDE PASAR.
 *
 * No se escriben etiquetas: se devuelve un objeto, y Next lo convierte en
 * etiquetas. La diferencia con escribirlas a mano se nota en tres sitios:
 *
 *   - **No hay duplicados posibles.** Si una disposición y una página declaran
 *     título, el de la página gana; con etiquetas sueltas, saldrían las dos.
 *   - **Se puede heredar y completar.** Una disposición pone lo común y cada
 *     página sobrescribe lo suyo.
 *   - **Es asíncrona.** Puede consultar la base de datos para saber el título.
 *
 * A cambio hay que aprender qué nombre tiene cada cosa en ese objeto, y lo que
 * no esté previsto —el grafo de schema.org, por ejemplo— sigue escribiéndose a
 * mano.
 */
export async function generateMetadata() {
  const origen = `http://${(await headers()).get("host")}`;
  return {
    title: PORTADA.titulo,
    description: PORTADA.descripcion,
    alternates: { canonical: `${origen}${PORTADA.ruta}` },
    openGraph: {
      title: PORTADA.titulo,
      description: PORTADA.descripcion,
      type: PORTADA.tipo,
      url: `${origen}${PORTADA.ruta}`,
    },
  };
}

export default function Pagina() {
  return (
    <>
      <h1>{PORTADA.titulo}</h1>
      <a href="/articulo/hola-mundo">un artículo</a>
    </>
  );
}
