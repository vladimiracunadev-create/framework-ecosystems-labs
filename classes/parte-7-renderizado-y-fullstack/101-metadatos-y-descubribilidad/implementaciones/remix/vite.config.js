import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

/**
 * Remix es el framework que puso de moda esta idea, y su `loader` es el modelo
 * del que copiaron los demás: una función con nombre, exportada por el archivo
 * de la ruta, que el framework llama antes de renderizar.
 */
export default defineConfig({
  plugins: [remix({ future: { v3_singleFetch: true } })],
});
