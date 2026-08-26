import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

/**
 * REMIX NO DEJA ELEGIR ESTRATEGIA POR PANTALLA, Y ES LA POSTURA MÁS CLARA DE
 * LAS CINCO.
 *
 * No hay `prerender`, ni `dynamic`, ni `routeRules`. Todas las rutas se
 * renderizan en el servidor, en cada petición, y punto.
 *
 * Su argumento —el de la clase 093— es que lo estático es un caso particular de
 * lo dinámico con una caché delante, y que esa caché la resuelve mejor una red
 * de distribución con `Cache-Control` que el framework con un modo aparte.
 *
 * Esta implementación lo hace exactamente así: el catálogo devuelve una cabecera
 * de caché de una hora, y su sello se calcula una vez al arrancar el módulo. El
 * efecto observable es el mismo que el de una página estática; el mecanismo, no.
 * Y está declarado en cada archivo para que nadie lo confunda.
 */
export default defineConfig({
  plugins: [remix({ future: { v3_singleFetch: true } })],
});
