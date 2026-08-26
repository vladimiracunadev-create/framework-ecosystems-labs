import { medir } from "../medicion.js";

export const prerender = false;

export async function GET({ request }) {
  const medido = await medir(request.headers.get("host"));
  return new Response(
    JSON.stringify({
      framework: "astro",
      islas: ["contador", "filtro"],
      cuantas_islas: 2,
      como_se_declara: "una directiva client:* en la etiqueta del componente",
      que_es_una_isla_aqui: "un componente de otro framework —aquí Preact— incrustado en un documento que no es una aplicación",
      el_resto_se_queda_en_el_servidor: true,
      hay_grados: "client:load, client:idle, client:visible y client:media",
      ...medido,
    }),
    { headers: { "content-type": "application/json; charset=utf-8" } },
  );
}
