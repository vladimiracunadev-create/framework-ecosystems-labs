import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import preact from "@astrojs/preact";

/**
 * ASTRO NO HIDRATA NADA POR OMISIÓN, Y ESA ES SU POSTURA ENTERA.
 *
 * Las plantillas `.astro` se ejecutan en el servidor y no viajan al navegador
 * ni una línea. Para que algo se hidrate hay que pedirlo explícitamente, con
 * una directiva `client:*`, y para eso hace falta una integración: un motor de
 * componentes que sepa revivirlos. Aquí es Preact.
 *
 * Consecuencia directa: una página de Astro sin islas manda **cero** JavaScript
 * de componentes. En los otros cuatro hay que trabajar para conseguir eso.
 */
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [preact()],
});
