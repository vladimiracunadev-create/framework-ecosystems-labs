import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * EL MÓDULO QUE NO PUEDE VIAJAR, Y ES IDÉNTICO EN LAS DOS IMPLEMENTACIONES.
 *
 * Contiene tres cosas que un navegador no puede tener:
 *
 *   1. Una llave. Está aquí escrita en claro a propósito: si esta cadena
 *      apareciera en cualquier archivo que el navegador descarga, sería una
 *      filtración de verdad, y el contrato la busca uno por uno.
 *   2. Una lectura de disco con `node:fs`. No existe en el navegador.
 *   3. Un dato que solo el servidor conoce.
 *
 * Que un componente pueda importar esto y seguir siendo un componente es la
 * novedad entera de los componentes de servidor. Antes había que sacar el dato
 * en una función aparte —un `loader`, un `getServerSideProps`— y pasarlo hacia
 * abajo por propiedades.
 */

/** Si esta cadena aparece en un archivo que el navegador descarga, hay una
 *  filtración. El contrato la busca en todos, uno por uno. */
export const LLAVE_QUE_NO_DEBE_VIAJAR = "llave-de-servidor-7c1f9e";

/** Lee el almacén del disco. `node:fs` no existe en el navegador: si este
 *  módulo acabara en el paquete de cliente, la construcción fallaría o el
 *  navegador reventaría al importarlo. */
export function leerElAlmacen() {
  const archivo = path.join(process.cwd(), "almacen", "existencias.json");
  return JSON.parse(readFileSync(archivo, "utf8"));
}

/** Un dato que solo el servidor tiene. Se usa para demostrar que el componente
 *  lo pudo leer sin que la llave saliera de aquí. */
export function cuantasCosasHay() {
  return leerElAlmacen().articulos.length;
}
