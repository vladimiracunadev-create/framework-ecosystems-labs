import { PRODUCTOS } from "../datos.js";

export function loader() {
  return Response.json({ productos: PRODUCTOS });
}
