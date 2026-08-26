import { DECISIONES, ESTRATEGIAS, LAS_TRES_PREGUNTAS, PANTALLAS } from "../decisiones.js";

export const prerender = false;

export function GET() {
  return new Response(
    JSON.stringify({
      framework: "astro",
      una_sola_aplicacion: true,
      pantallas: PANTALLAS,
      estrategias: ESTRATEGIAS,
      las_tres_preguntas: LAS_TRES_PREGUNTAS,
      donde_se_declara: "una linea por pagina: export const prerender",
      cuesta_cambiar_de_estrategia: "una palabra: true o false",
      detalle: DECISIONES,
    }),
    { headers: { "content-type": "application/json; charset=utf-8" } },
  );
}
