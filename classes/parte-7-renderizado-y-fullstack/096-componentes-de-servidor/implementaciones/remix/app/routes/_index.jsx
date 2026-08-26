import { useLoaderData } from "@remix-run/react";

import Inventario from "../Inventario.jsx";
import Marco from "../Marco.jsx";
import { cuantasCosasHay } from "../../servidor/secretos.js";

/**
 * AQUÍ ESTÁ LA DIFERENCIA, Y CABE EN DOS LÍNEAS.
 *
 * El `loader` importa el módulo del servidor y lee el disco. Al construir el
 * paquete del navegador, Remix borra esta función y con ella la importación, así
 * que la llave no viaja — el contrato lo comprueba archivo por archivo.
 *
 * Lo que no puede hacer es que `Inventario` lo pida por su cuenta. El número
 * sale de aquí, entra por `useLoaderData` y baja por propiedades a través de
 * `Marco`, que no lo necesita para nada.
 *
 * Con un nivel de profundidad esto no es un problema. La pregunta es qué pasa
 * con seis, y es justo la pregunta que los componentes de servidor vinieron a
 * contestar.
 */
export function loader() {
  return { cuantos: cuantasCosasHay() };
}

export default function Indice() {
  const { cuantos } = useLoaderData();
  return (
    <>
      <h1>Componentes de servidor</h1>
      <Marco>
        <Inventario cuantos={cuantos} />
      </Marco>
    </>
  );
}
