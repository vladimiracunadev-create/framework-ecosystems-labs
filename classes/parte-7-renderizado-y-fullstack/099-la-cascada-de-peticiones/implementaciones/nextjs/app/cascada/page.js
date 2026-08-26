import Panel from "../Panel.jsx";
import { enCascada } from "../fuente.js";

export const dynamic = "force-dynamic";

/** Tres `await` seguidos. En Next esto es especialmente fácil de escribir sin
 *  querer: como cualquier componente puede cargar lo suyo —clase 096—, la
 *  cascada se reparte entre archivos y deja de verse de un vistazo. */
export default async function Pagina() {
  return <Panel como="cascada" datos={await enCascada()} />;
}
