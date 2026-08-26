import { defineConfig } from "astro/config";
import node from "@astrojs/node";

/**
 * Sin integraciones: esta clase no hidrata nada. Lo único que hace falta es un
 * servidor que ejecute las páginas en cada petición, porque la carga de datos es
 * lo que se está midiendo.
 */
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
});
