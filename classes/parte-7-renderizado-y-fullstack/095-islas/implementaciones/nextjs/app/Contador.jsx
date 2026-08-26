"use client";

import { useState } from "react";

/** ISLA 1. La directiva de la primera línea es lo que la convierte en una:
 *  marca la frontera entre lo que se queda y lo que viaja. */
export default function Contador() {
  const [veces, setVeces] = useState(0);
  return (
    <button data-isla="contador" data-cuenta={veces} onClick={() => setVeces(veces + 1)}>
      Me ha gustado ({veces})
    </button>
  );
}
