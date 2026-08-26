import { medir } from "../medicion.js";

export const prerender = false;

export async function GET({ request }) {
  const medido = await medir(request.headers.get("host"));
  return new Response(
    JSON.stringify({
      framework: "astro",
      donde_se_arregla: "en el frontmatter, con Promise.all",
      anidadas_en_paralelo_por_diseno: medido.las_cargas_anidadas_van_en_paralelo,
      por_que: "no hay rutas anidadas: hay un componente marco que se renderiza después de la página, así que sus esperas se suman",
      ...medido,
    }),
    { headers: { "content-type": "application/json; charset=utf-8" } },
  );
}
