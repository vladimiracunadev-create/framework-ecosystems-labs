/**
 * LAS ISLAS DE NUXT VAN EN LA DIRECCIÓN CONTRARIA, Y HAY QUE ENCENDERLAS.
 *
 * En Astro el documento es estático y las islas son los trozos vivos. En Nuxt la
 * aplicación está viva entera y una isla es un componente que se queda en el
 * servidor: un archivo `.server.vue`, cuyo HTML llega renderizado y cuyo código
 * no viaja.
 *
 * Lo que se consigue es parecido —el artículo no manda su código al navegador—
 * pero el punto de partida es el opuesto: aquí se recorta desde una aplicación
 * completa, allí se añade sobre un documento vacío de JavaScript. Los números de
 * `/islas.json` enseñan exactamente esa diferencia de punto de partida.
 *
 * `componentIslands` sigue bajo `experimental`, y eso también es un dato de la
 * comparación: en Astro esto no es una opción, es el producto.
 */
export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  experimental: { componentIslands: true },
});
