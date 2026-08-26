import { PRODUCTOS } from "../datos.mjs";

export const prerender = true;

/** Los datos que el editor pide desde el navegador. Estáticos: son los mismos
 *  para todo el mundo, así que la cuarta ruta de la aplicación también tiene su
 *  decisión tomada. */
export function GET() {
  return new Response(JSON.stringify({ productos: PRODUCTOS }), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
