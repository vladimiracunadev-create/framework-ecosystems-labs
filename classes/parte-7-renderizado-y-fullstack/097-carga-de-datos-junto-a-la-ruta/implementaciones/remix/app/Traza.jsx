import { secuencia } from "./registro.js";

/** Se pinta el último, cuando la secuencia ya está completa. */
export default function Traza() {
  return <span data-secuencia={secuencia()}></span>;
}
