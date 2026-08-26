import { json } from "@sveltejs/kit";

import { medir } from "../../../presupuesto.mjs";

export async function GET() {
  return json({
    framework: "sveltekit",
    se_comprueba_al_construir: true,
    que_entra_en_el_presupuesto: "el arranque de SvelteKit y los componentes compilados: no viaja motor de árbol virtual",
    ...medir(),
  });
}
