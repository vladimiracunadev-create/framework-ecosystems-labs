import { medir } from "../../medicion.js";

/**
 * Nuxt es el único de los cinco cuyo manejador de servidor no recibe una
 * petición estándar de la plataforma web, sino un `event` de h3 con sus propias
 * funciones auxiliares. `getRequestHeader` hace lo mismo que
 * `request.headers.get` en los otros cuatro.
 */
export default defineEventHandler(async (event) => {
  const medido = await medir(getRequestHeader(event, "host"));
  return {
    framework: "nuxt",
    hidrata: true,
    que_hidrata: "la aplicación entera, salvo lo que la tabla de reglas excluya",
    mecanismo: "un <script type=\"application/json\" id=\"__NUXT_DATA__\"> con la carga útil",
    por_omision: "hidratar: en Nuxt hay que apagarlo, y con una opción experimental",
    ...medido,
  };
});
