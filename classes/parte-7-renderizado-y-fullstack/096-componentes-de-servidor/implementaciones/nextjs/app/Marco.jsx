"use client";

import { useState } from "react";

/**
 * UN COMPONENTE DE CLIENTE QUE ENVUELVE A UNO DE SERVIDOR.
 *
 * Es el detalle que más cuesta creer del modelo: `{children}` puede ser un
 * componente de servidor, aunque este archivo lleve `"use client"` y viaje
 * entero al navegador.
 *
 * Funciona porque lo que se pasa no es el componente sino **su resultado ya
 * renderizado**. El navegador recibe un hueco relleno, no una función que
 * ejecutar. Por eso `Inventario` puede leer el disco aun estando dentro de esto.
 *
 * La regla que se deduce, y que vale para cualquier proyecto: un componente de
 * cliente no puede IMPORTAR uno de servidor, pero sí puede RECIBIRLO.
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
