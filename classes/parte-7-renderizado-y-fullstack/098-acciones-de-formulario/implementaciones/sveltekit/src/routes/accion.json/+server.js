import { json } from "@sveltejs/kit";

import { cuantasTareasSeVen } from "$lib/cuenta.js";

export async function GET({ request }) {
  return json({
    framework: "sveltekit",
    mecanismo: "un objeto actions exportado por +page.server.js, con una entrada por acción",
    funciona_sin_javascript: true,
    revalida_sola: true,
    como_se_declara_en_la_plantilla: "<form method=\"POST\"> a secas; use:enhance es opcional",
    que_hace_al_terminar: "vuelve a ejecutar load; aquí además se redirige con 303",
    cuantas_tareas_se_ven: await cuantasTareasSeVen(request.headers.get("host")),
  });
}
