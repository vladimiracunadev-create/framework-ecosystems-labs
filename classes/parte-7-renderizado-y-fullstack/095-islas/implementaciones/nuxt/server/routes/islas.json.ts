import { medir } from "../../medicion.js";

export default defineEventHandler(async (event) => {
  const medido = await medir(getRequestHeader(event, "host"));
  return {
    framework: "nuxt",
    islas: ["contador", "filtro"],
    cuantas_islas: 2,
    como_se_declara: "al revés: se declara lo que NO viaja, con el sufijo .server.vue",
    que_es_una_isla_aqui: "un componente que se queda en el servidor dentro de una aplicación que está viva entera",
    el_resto_se_queda_en_el_servidor: false,
    hay_grados: "no, y la propia función sigue marcada como experimental",
    ...medido,
  };
});
