import { cuantasTareasSeVen } from "../../cuenta";

export default defineEventHandler(async (event) => ({
  framework: "nuxt",
  mecanismo: "una ruta de servidor aparte, escrita a mano: server/routes/tareas.post.ts",
  funciona_sin_javascript: true,
  revalida_sola: false,
  como_se_declara_en_la_plantilla: "<form method=\"post\" action=\"/tareas\">, con el destino explícito",
  que_hace_al_terminar: "lo que se escriba: aquí, sendRedirect con 303",
  cuantas_tareas_se_ven: await cuantasTareasSeVen(getRequestHeader(event, "host")),
}));
