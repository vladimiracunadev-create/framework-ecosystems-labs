import { DECISIONES, ESTRATEGIAS, LAS_TRES_PREGUNTAS, PANTALLAS } from "../decisiones.js";

export function loader() {
  return Response.json({
    framework: "remix",
    una_sola_aplicacion: true,
    pantallas: PANTALLAS,
    estrategias: ESTRATEGIAS,
    las_tres_preguntas: LAS_TRES_PREGUNTAS,
    donde_se_declara: "en ningun sitio: no hay estrategia que elegir, todas las rutas van al servidor",
    cuesta_cambiar_de_estrategia: "no se cambia: lo estatico se consigue fuera, con Cache-Control y una red de distribucion",
    detalle: DECISIONES,
  });
}
