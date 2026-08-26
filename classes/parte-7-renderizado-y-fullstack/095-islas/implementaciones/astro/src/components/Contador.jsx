import { useState } from "preact/hooks";

/** ISLA 1: un botón que cuenta. No sabe nada del resto de la página, y el resto
 *  de la página no sabe nada de él. Esa incomunicación es el precio del modelo
 *  —clase 141— y aquí no molesta porque no hay nada que comunicar. */
export default function Contador() {
  const [veces, setVeces] = useState(0);
  return (
    <button data-isla="contador" data-cuenta={veces} onClick={() => setVeces(veces + 1)}>
      Me ha gustado ({veces})
    </button>
  );
}
