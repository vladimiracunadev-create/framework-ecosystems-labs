import { useState } from "react";

/**
 * El mismo marco interactivo. En Remix esto no necesita ninguna directiva
 * porque no hay frontera que declarar: **todos los componentes se renderizan en
 * el servidor y todos viajan al navegador**.
 *
 * Es un modelo más fácil de explicar que el de Next —no hay dos clases de
 * componente— y más caro de ejecutar, porque no hay forma de que algo se quede
 * en el servidor.
 */
export default function Marco({ children }) {
  const [abierto, setAbierto] = useState(true);
  return (
    <section data-dentro-de="marco">
      <button data-interactivo="si" onClick={() => setAbierto(!abierto)}>
        {abierto ? "Cerrar" : "Abrir"}
      </button>
      {abierto ? children : null}
    </section>
  );
}
