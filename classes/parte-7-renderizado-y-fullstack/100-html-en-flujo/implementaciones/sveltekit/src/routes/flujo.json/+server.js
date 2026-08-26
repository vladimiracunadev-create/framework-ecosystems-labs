import { json } from "@sveltejs/kit";

import { medir } from "$lib/medicion.js";

export async function GET({ request }) {
  return json({
    framework: "sveltekit",
    como_se_declara: "no poniendo el await: load devuelve la promesa sin resolver",
    quien_espera: "la promesa devuelta por load, cosida por el framework al llegar",
    que_llega_primero: "el documento con el bloque {#await} pintado en su rama de espera",
    ...(await medir(request.headers.get("host"))),
  });
}
