import { TAREAS } from "../datos";

// Los corchetes del nombre del archivo escapan el punto: sin ellos, Remix
// entendería `tareas.json` como la ruta anidada `/tareas/json`. Es la convención
// de enrutado por archivos llevada a su consecuencia, y una de las cosas que más
// desconciertan al empezar.
export function loader() {
  return Response.json({ tareas: TAREAS });
}
