import { cuantasTareasSeVen } from "../cuenta.js";

export const prerender = false;

export async function GET({ request }) {
  return new Response(
    JSON.stringify({
      framework: "astro",
      mecanismo: "un if sobre Astro.request.method en el frontmatter de la propia página",
      funciona_sin_javascript: true,
      revalida_sola: false,
      como_se_declara_en_la_plantilla: "<form method=\"post\"> sin atributo action: apunta a sí misma",
      que_hace_al_terminar: "lo que se escriba: aquí, redirigir con 303",
      cuantas_tareas_se_ven: await cuantasTareasSeVen(request.headers.get("host")),
    }),
    { headers: { "content-type": "application/json; charset=utf-8" } },
  );
}
