import { json } from "@sveltejs/kit";
import { medir } from "../../medicion.js";

/** `request` es una petición estándar de la plataforma web, así que el `Host`
 *  se lee igual que en Astro, Next y Remix. */
export async function GET({ request }) {
  const medido = await medir(request.headers.get("host"));
  return json({
    framework: "sveltekit",
    hidrata: true,
    que_hidrata: "la página entera, salvo que la ruta exporte csr = false",
    mecanismo: "un guion en línea con __sveltekit_… y el resultado de load dentro",
    por_omision: "hidratar: en SvelteKit hay que apagarlo, no encenderlo",
    ...medido,
  });
}
