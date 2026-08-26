import { json } from "@sveltejs/kit";

import { PRODUCTOS } from "../../datos.js";

export const prerender = true;

export function GET() {
  return json({ productos: PRODUCTOS });
}
