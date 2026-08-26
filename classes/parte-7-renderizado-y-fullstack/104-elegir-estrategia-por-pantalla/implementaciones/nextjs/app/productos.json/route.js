import { PRODUCTOS } from "../datos.js";

export const dynamic = "force-static";

/** Los datos que el editor pide desde el navegador. También tienen su decisión
 *  tomada: son los mismos para todo el mundo, así que estáticos. */
export function GET() {
  return Response.json({ productos: PRODUCTOS });
}
