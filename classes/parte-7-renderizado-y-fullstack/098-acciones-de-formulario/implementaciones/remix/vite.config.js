import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

/**
 * REMIX PUSO LA PALABRA «ACCIÓN» EN ESTE SITIO.
 *
 * Su `action` es la pareja simétrica del `loader` de la clase 097: una función
 * exportada por el archivo de la ruta que recibe la petición cuando llega un
 * POST. Y trae de serie lo que en los demás hay que pedir: al terminar, Remix
 * vuelve a ejecutar los `loader` de las rutas activas, porque da por hecho que
 * escribir cambia lo que se leía.
 */
export default defineConfig({
  plugins: [remix({ future: { v3_singleFetch: true } })],
});
