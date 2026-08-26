import { cuantasCosasHay } from "../servidor/secretos.js";

/**
 * ESTO ES UN COMPONENTE, Y LEE EL DISCO.
 *
 * Las dos cosas a la vez son la novedad. Antes de los componentes de servidor,
 * un componente de React no podía importar `node:fs`: lo que se importa desde un
 * componente acaba en el paquete del navegador, y ahí `node:fs` no existe.
 *
 * La forma de resolverlo era sacar la lectura fuera del componente —a un
 * `loader`, a `getServerSideProps`— y pasar el resultado hacia abajo por
 * propiedades. Eso funciona, y tiene un coste concreto: el dato tiene que
 * atravesar todos los componentes que haya en medio, aunque no les importe.
 *
 * Aquí no. Este componente pide lo que necesita, donde está.
 */
export default function Inventario() {
  return (
    <p data-desde="el-disco" data-cuantos={cuantasCosasHay()}>
      El almacén tiene {cuantasCosasHay()} artículos distintos.
    </p>
  );
}
