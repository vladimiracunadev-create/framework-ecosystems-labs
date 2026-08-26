import { medir } from "../../medicion.js";

export default defineEventHandler(async (event) => {
  const medido = await medir(getRequestHeader(event, "host"));
  return {
    framework: "nuxt",
    donde_se_arregla: "en el cargador, con Promise.all",
    anidadas_en_paralelo_por_diseno: medido.las_cargas_anidadas_van_en_paralelo,
    por_que: "la disposición es un componente que envuelve a la página, no una ruta con carga propia",
    ...medido,
  };
});
