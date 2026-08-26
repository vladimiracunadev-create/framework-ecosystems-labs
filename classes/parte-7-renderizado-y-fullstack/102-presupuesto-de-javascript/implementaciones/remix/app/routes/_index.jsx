import { useState } from "react";

/** Lo único interactivo. En Remix no hay forma de que este botón no viaje: la
 *  aplicación se hidrata entera —clase 094— y no hay interruptor por ruta. */
export default function Indice() {
  const [veces, setVeces] = useState(0);
  return (
    <>
      <h1 data-pantalla="presupuesto">Una pantalla con un botón</h1>
      <button data-cuenta={veces} onClick={() => setVeces(veces + 1)}>
        Pulsado {veces} veces
      </button>
    </>
  );
}
