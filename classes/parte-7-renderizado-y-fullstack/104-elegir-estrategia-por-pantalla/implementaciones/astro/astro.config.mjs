import node from "@astrojs/node";
import { defineConfig } from "astro/config";

/**
 * `output: "static"` es el valor por omisión de Astro, y es una postura: **por
 * omisión no hay servidor**. Las páginas se generan al construir y se sirven
 * como archivos.
 *
 * El adaptador de Node existe para las páginas que sí necesitan un servidor. Una
 * página se pasa a ese lado poniendo `export const prerender = false`, y esa
 * granularidad —por página, no por proyecto— es lo que esta clase quiere
 * enseñar.
 */
export default defineConfig({
  output: "static",
  adapter: node({ mode: "standalone" }),
  server: { port: Number(process.env.PORT ?? 3000), host: "127.0.0.1" },
});
