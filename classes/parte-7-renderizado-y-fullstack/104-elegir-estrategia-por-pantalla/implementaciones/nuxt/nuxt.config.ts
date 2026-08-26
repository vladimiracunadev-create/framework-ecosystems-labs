/**
 * LAS TRES DECISIONES, EN UNA TABLA.
 *
 * Nuxt es el único de los cinco donde estas tres líneas se leen juntas, y ese es
 * su argumento para esta clase: **se puede auditar la arquitectura de la
 * aplicación sin abrir una sola pantalla**.
 *
 * Y su desventaja, que es la misma vista del revés: la decisión sobre el
 * catálogo está lejos del catálogo. Quien edite `pages/catalogo.vue` no tiene
 * ninguna pista de que esa pantalla se genera al construir, y puede meterle una
 * consulta que dependa de quién mira sin que nada proteste hasta producción.
 */
export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  routeRules: {
    "/catalogo": { prerender: true },
    "/editor": { prerender: true },
    "/productos.json": { prerender: true },
    // Sin regla, una ruta se renderiza en el servidor en cada petición: es el
    // valor por omisión de Nuxt. Se escribe igualmente para que la tabla esté
    // completa y no haya que deducir nada.
    "/panel": { prerender: false },
  },
});
