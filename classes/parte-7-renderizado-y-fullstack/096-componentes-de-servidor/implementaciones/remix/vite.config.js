import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

/**
 * REMIX NO TIENE COMPONENTES DE SERVIDOR, Y LO QUE TIENE EN SU LUGAR FUNCIONA.
 *
 * Su mecanismo es más viejo y más simple: al construir el paquete del navegador,
 * **borra las exportaciones `loader` y `action` de cada archivo de ruta** y todo
 * lo que solo ellas usaban. Por eso un `loader` puede importar `node:fs` sin que
 * `node:fs` acabe en el navegador.
 *
 * El contrato de esta clase lo comprueba igual que en Next: descargando todo el
 * JavaScript de la página y buscando la llave dentro. No aparece.
 *
 * Lo que Remix no puede hacer es que **un componente** lea el disco. El dato lo
 * saca la ruta y baja por propiedades. Con un nivel no se nota; con seis, sí.
 */
export default defineConfig({
  plugins: [remix({ future: { v3_singleFetch: true } })],
});
