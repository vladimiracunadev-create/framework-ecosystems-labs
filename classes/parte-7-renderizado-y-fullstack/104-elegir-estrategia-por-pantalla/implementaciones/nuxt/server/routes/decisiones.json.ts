import { DECISIONES, ESTRATEGIAS, LAS_TRES_PREGUNTAS, PANTALLAS } from "../../decisiones";

export default defineEventHandler(() => ({
  framework: "nuxt",
  una_sola_aplicacion: true,
  pantallas: PANTALLAS,
  estrategias: ESTRATEGIAS,
  las_tres_preguntas: LAS_TRES_PREGUNTAS,
  donde_se_declara: "una tabla central: routeRules en nuxt.config.ts",
  cuesta_cambiar_de_estrategia: "una linea de la tabla, sin tocar la pantalla",
  detalle: DECISIONES,
}));
