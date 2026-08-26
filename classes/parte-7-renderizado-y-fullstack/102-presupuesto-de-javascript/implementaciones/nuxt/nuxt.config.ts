/**
 * Sin nada especial. Nuxt trae un analizador de paquetes —`nuxi analyze`— que
 * enseña qué ocupa qué, y no trae un límite que haga fallar la construcción.
 * Ninguno de los cinco lo trae: por eso esta clase lo escribe.
 */
export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
});
