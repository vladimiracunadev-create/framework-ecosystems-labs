import { json } from "@sveltejs/kit";

import { medir } from "$lib/medicion.js";

export async function GET({ request }) {
  return json({
    framework: "sveltekit",
    donde_se_arregla: "en load, con Promise.all",
    anidadas_en_paralelo_por_diseno: true,
    por_que: "SvelteKit resuelve la ruta entera antes de cargar y lanza los load de todos sus niveles a la vez",
    ...(await medir(request.headers.get("host"))),
  });
}
