/**
 * LA ESTRATEGIA POR RUTA, EN UNA TABLA.
 *
 * Nuxt es el único de los cinco que reúne las decisiones de renderizado **en un
 * solo sitio**: `routeRules` es un mapa de patrón de ruta a estrategia.
 *
 * Tiene una ventaja concreta sobre escribirlo en cada página: se puede leer la
 * arquitectura de la aplicación entera de un vistazo, sin abrir veinte archivos.
 * Y una desventaja simétrica: la decisión queda lejos de la pantalla a la que
 * afecta, así que es fácil que se desincronicen.
 */
export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  routeRules: {
    "/estatico": { prerender: true },
    "/cliente": { prerender: true },
    "/tareas.json": { prerender: true },
    "/estrategias.json": { prerender: true },
    // Sin regla, una ruta se renderiza en el servidor en cada petición: es el
    // valor por omisión de Nuxt, al contrario que Astro y Next.
    "/servidor": { prerender: false },
  },
});
