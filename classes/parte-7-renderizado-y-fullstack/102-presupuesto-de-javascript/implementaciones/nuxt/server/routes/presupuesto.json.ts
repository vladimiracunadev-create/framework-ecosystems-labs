import { medir } from "../../presupuesto.mjs";

export default defineEventHandler(() => ({
  framework: "nuxt",
  se_comprueba_al_construir: true,
  que_entra_en_el_presupuesto: "el tiempo de ejecución de Vue y Nuxt, y los componentes que no sean .server.vue",
  ...medir(),
}));
