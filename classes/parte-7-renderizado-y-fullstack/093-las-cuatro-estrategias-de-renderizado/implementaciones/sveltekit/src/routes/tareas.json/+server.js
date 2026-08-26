import { json } from "@sveltejs/kit";

import { TAREAS } from "../../datos.js";

// El origen de datos de la pantalla de cliente. Está aparte porque la estrategia
// de cliente NO incrusta el contenido: lo pide.
export const prerender = true;

export function GET() {
  return json({ tareas: TAREAS });
}
