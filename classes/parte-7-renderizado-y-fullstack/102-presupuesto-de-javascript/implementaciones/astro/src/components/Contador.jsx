import { useState } from "preact/hooks";

/** Lo único interactivo de la pantalla, y por tanto lo único que ocupa
 *  presupuesto. En Astro, quitar la directiva `client:load` de la página deja el
 *  presupuesto en cero. */
export default function Contador() {
  const [veces, setVeces] = useState(0);
  return (
    <button data-cuenta={veces} onClick={() => setVeces(veces + 1)}>
      Pulsado {veces} veces
    </button>
  );
}
