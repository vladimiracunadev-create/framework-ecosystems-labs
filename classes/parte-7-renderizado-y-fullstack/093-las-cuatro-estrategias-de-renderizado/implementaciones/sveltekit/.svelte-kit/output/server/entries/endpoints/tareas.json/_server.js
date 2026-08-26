import { json } from "@sveltejs/kit";
import { T as TAREAS } from "../../../chunks/datos.js";
const prerender = true;
function GET() {
  return json({ tareas: TAREAS });
}
export {
  GET,
  prerender
};
