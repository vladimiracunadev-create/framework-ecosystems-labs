import { DECISIONES, ESTRATEGIAS, LAS_TRES_PREGUNTAS, PANTALLAS } from "../decisiones.js";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    framework: "nextjs",
    una_sola_aplicacion: true,
    pantallas: PANTALLAS,
    estrategias: ESTRATEGIAS,
    las_tres_preguntas: LAS_TRES_PREGUNTAS,
    donde_se_declara: "una linea por ruta: export const dynamic",
    cuesta_cambiar_de_estrategia: "una palabra, y el constructor publica el resultado con un simbolo por ruta",
    detalle: DECISIONES,
  });
}
