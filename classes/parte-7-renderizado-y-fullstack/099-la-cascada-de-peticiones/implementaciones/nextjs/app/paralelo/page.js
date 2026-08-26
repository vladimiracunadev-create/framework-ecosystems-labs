import Panel from "../Panel.jsx";
import { enParalelo } from "../fuente.js";

export const dynamic = "force-dynamic";

/** El mismo componente con `Promise.all`. */
export default async function Pagina() {
  return <Panel como="paralelo" datos={await enParalelo()} />;
}
