import { TAREAS } from "../datos";

// El origen de datos de la pantalla de cliente. Aparte, porque la estrategia de
// cliente NO incrusta el contenido en el HTML: lo pide después.
export const dynamic = "force-static";

export function GET() {
  return Response.json({ tareas: TAREAS });
}
