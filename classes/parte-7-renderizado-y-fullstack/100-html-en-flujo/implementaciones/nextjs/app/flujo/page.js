import { Suspense } from "react";

import Lista from "../Lista.jsx";
import { nombreDeQuienMira } from "../fuente.js";

export const dynamic = "force-dynamic";

/**
 * `<Suspense>` ES LA LÍNEA QUE PARTE LA RESPUESTA EN DOS.
 *
 * Sin ella, Next espera a que el árbol entero esté resuelto y manda el documento
 * completo. Con ella, manda todo lo que ya tiene —incluida la cabecera y el
 * texto de espera— y deja un hueco marcado; cuando `Lista` termina, manda un
 * segundo trozo con el contenido y una instrucción para colocarlo en su sitio.
 *
 * Es la misma pantalla, la misma consulta y el mismo total. Lo que cambia es
 * cuándo se ve la primera mitad, y eso es lo que mide la persona que espera.
 */
export default function Pagina() {
  return (
    <main>
      <h1 data-parte="cabecera">Hola, {nombreDeQuienMira()}</h1>
      <Suspense fallback={<p data-parte="esperando">cargando la lista…</p>}>
        <Lista />
      </Suspense>
    </main>
  );
}
