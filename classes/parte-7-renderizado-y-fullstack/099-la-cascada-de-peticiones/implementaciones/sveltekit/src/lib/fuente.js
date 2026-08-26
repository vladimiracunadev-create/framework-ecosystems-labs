/**
 * TRES FUENTES INDEPENDIENTES, IDÉNTICAS EN LAS CINCO IMPLEMENTACIONES.
 *
 * Ninguna necesita a las otras: se pueden pedir las tres a la vez. Que en
 * `/cascada` se pidan una detrás de otra no es una necesidad del dominio, es un
 * descuido — y ese descuido es el tema de la clase.
 *
 * La cascada de verdad, la que no se puede evitar, es otra: cuando el segundo
 * dato necesita el identificador que trae el primero. Esa cuesta un rediseño de
 * la fuente, no un `Promise.all`. Distinguir las dos es lo que hay que
 * aprender a hacer.
 */

/** Lo que tarda cada una. Sesenta milisegundos es poco para una consulta real y
 *  bastante para que la diferencia entre tres seguidas y tres a la vez no se
 *  pueda confundir con ruido. */
export const RETARDO_MS = 60;

export const PETICIONES = 3;

async function tardar() {
  await new Promise((seguir) => setTimeout(seguir, RETARDO_MS));
}

export async function pedirUsuario() {
  await tardar();
  return { nombre: "Ada" };
}

export async function pedirPedidos() {
  await tardar();
  return [{ id: 7, importe: 32 }];
}

export async function pedirAvisos() {
  await tardar();
  return ["la entrega llega el martes"];
}

/** LA CASCADA. Tres `await` seguidos, y ninguno necesita al anterior. Tarda la
 *  suma: unos ciento ochenta milisegundos. */
export async function enCascada() {
  const usuario = await pedirUsuario();
  const pedidos = await pedirPedidos();
  const avisos = await pedirAvisos();
  return { usuario, pedidos, avisos };
}

/** EN PARALELO. El mismo trabajo, lanzado a la vez. Tarda lo que la más lenta:
 *  unos sesenta. El cambio son dos líneas y no toca ni la fuente ni la pantalla. */
export async function enParalelo() {
  const [usuario, pedidos, avisos] = await Promise.all([
    pedirUsuario(),
    pedirPedidos(),
    pedirAvisos(),
  ]);
  return { usuario, pedidos, avisos };
}
