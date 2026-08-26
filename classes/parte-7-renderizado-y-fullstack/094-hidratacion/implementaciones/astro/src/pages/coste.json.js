import { medir } from "../medicion.js";

export const prerender = false;

/**
 * Pide sus propias dos pantallas y publica los números.
 *
 * Fíjate en de dónde sale la dirección: de la cabecera `Host` de la petición,
 * no de `Astro.url`. El adaptador de Node devuelve ahí `http://localhost` sin
 * puerto, y una petición a esa dirección no llega a ninguna parte. Es un
 * detalle pequeño y un aviso grande: lo que un framework dice que es su propia
 * dirección no siempre lo es.
 */
export async function GET({ request }) {
  const medido = await medir(request.headers.get("host"));
  return new Response(
    JSON.stringify({
      framework: "astro",
      hidrata: true,
      que_hidrata: "solo lo que lleva una directiva client:*, y nada más",
      mecanismo: "un atributo props dentro de <astro-island>",
      por_omision: "no hidratar: las plantillas .astro no viajan al navegador",
      ...medido,
    }),
    { headers: { "content-type": "application/json; charset=utf-8" } },
  );
}
