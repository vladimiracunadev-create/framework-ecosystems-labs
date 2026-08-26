import { json } from "@sveltejs/kit";

import { DECISIONES, ESTRATEGIAS, LAS_TRES_PREGUNTAS, PANTALLAS } from "../../decisiones.js";

export function GET() {
  return json({
    framework: "sveltekit",
    una_sola_aplicacion: true,
    pantallas: PANTALLAS,
    estrategias: ESTRATEGIAS,
    las_tres_preguntas: LAS_TRES_PREGUNTAS,
    donde_se_declara: "constantes exportadas por ruta: prerender y ssr",
    cuesta_cambiar_de_estrategia: "una palabra, con el adaptador como limite: adapter-static anula la decision",
    detalle: DECISIONES,
  });
}
