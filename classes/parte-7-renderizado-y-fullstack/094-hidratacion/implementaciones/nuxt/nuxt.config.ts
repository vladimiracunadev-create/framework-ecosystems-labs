/**
 * LA HIDRATACIÓN, TAMBIÉN EN LA TABLA.
 *
 * Nuxt mantiene su costumbre de reunir las decisiones por ruta en un solo sitio,
 * y la hidratación no es una excepción: `experimentalNoScripts` le dice que para
 * esa ruta no emita las etiquetas `<script>` del arranque.
 *
 * El nombre lleva «experimental» y conviene tomárselo en serio: es la forma
 * menos asentada de las cinco. SvelteKit tiene `csr = false` desde hace años y
 * Astro no necesita nada porque su valor por omisión ya es ese.
 */
export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  routeRules: {
    // Sin nada que hidratar: ni arranque de Vue, ni estado serializado.
    "/inerte": { experimentalNoScripts: true },
  },
});
