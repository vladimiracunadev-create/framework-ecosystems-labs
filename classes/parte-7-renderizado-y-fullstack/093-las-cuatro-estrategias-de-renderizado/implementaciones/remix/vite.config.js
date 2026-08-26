import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

/**
 * REMIX NO TIENE MODO ESTÁTICO, Y ESO ES UNA POSTURA.
 *
 * De los cinco metaframeworks de esta clase, es el único que **no genera páginas
 * al construir**: todas sus rutas se renderizan en el servidor, en cada
 * petición.
 *
 * No es una carencia por hacer. Su argumento es que lo estático es un caso
 * particular de lo dinámico con una caché delante, y que esa caché la resuelve
 * mejor una red de distribución con cabeceras HTTP —`Cache-Control`— que el
 * framework con un modo aparte.
 *
 * Por eso esta implementación consigue el efecto de «estático» como lo
 * conseguiría un proyecto real de Remix: calculando el sello UNA VEZ al arrancar
 * el módulo. Es honesto decirlo — no es prerenderizado, es un módulo que se
 * evalúa una sola vez.
 */
export default defineConfig({
  plugins: [remix({ future: { v3_singleFetch: true } })],
});
