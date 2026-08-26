"use client";

import { useState } from "react";

/** Lo único interactivo. En Next, el presupuesto no empieza aquí: empieza en el
 *  tiempo de ejecución que la aplicación manda siempre —clase 095—, y este botón
 *  solo añade unos cientos de bytes encima. */
export default function Contador() {
  const [veces, setVeces] = useState(0);
  return (
    <button data-cuenta={veces} onClick={() => setVeces(veces + 1)}>
      Pulsado {veces} veces
    </button>
  );
}
