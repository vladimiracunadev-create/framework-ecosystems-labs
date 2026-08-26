import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import preact from "@astrojs/preact";

/**
 * ASTRO NO TIENE «MODO ISLAS»: ES LO ÚNICO QUE SABE HACER.
 *
 * La integración de Preact no enciende nada. Solo dice **con qué motor** se
 * revivirán las islas cuando alguien ponga una directiva `client:*`. Sin
 * directivas, esta configuración no manda ni un byte de Preact al navegador.
 *
 * Es una diferencia de fondo con los otros dos de esta clase: en Next y en Nuxt
 * hay una aplicación que se arranca y las islas son partes de ella; aquí no hay
 * aplicación, hay un documento con trozos vivos.
 */
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [preact()],
});
