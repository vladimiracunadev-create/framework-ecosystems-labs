/**
 * LA CACHÉ DE ESTADO REMOTO, ENTERA, EN CUARENTA LÍNEAS.
 *
 * TanStack Query, SWR, Pinia Colada, svelte-query — todas las bibliotecas que
 * resuelven esto implementan las mismas cuatro ideas, y aquí están escritas para
 * que se vean sin capas encima:
 *
 *   1. una CLAVE identifica la consulta;
 *   2. la respuesta se guarda con una MARCA DE TIEMPO;
 *   3. pasado un plazo la entrada está OBSOLETA — que no es lo mismo que borrada;
 *   4. y se puede INVALIDAR a mano cuando algo cambió.
 *
 * La idea que sostiene todo lo demás: **el estado del servidor no es estado de
 * la interfaz**. No es tuyo, no lo controlas, y en cuanto lo copias en el
 * cliente tienes dos verdades. Lo que estas bibliotecas hacen no es guardarlo:
 * es gestionar el desfase.
 */
export const PLAZO_MS = 30_000;

const entradas = new Map();
export const contador = { peticiones: 0 };

/** La fuente. En un proyecto real, una petición HTTP; aquí, una función. */
function pedirALaFuente(clave) {
  contador.peticiones += 1;
  return `${clave} v${contador.peticiones <= 2 ? 1 : 2}`;
}

export function reiniciar() {
  entradas.clear();
  contador.peticiones = 0;
}

/**
 * OBSOLETO NO ES BORRADO, y esa distinción es la clase entera.
 *
 * Una entrada obsoleta **se sigue devolviendo**: el usuario ve el dato viejo al
 * instante y la actualización llega después. Es lo que la industria llama
 * «obsoleto mientras se revalida», y es la diferencia entre una pantalla que
 * parpadea con un cargando y una que no.
 */
export function estaObsoleta(entrada, ahora) {
  return ahora - entrada.momento >= PLAZO_MS;
}

export function leer(clave, { envejecer = false, ahora = Date.now() } = {}) {
  const entrada = entradas.get(clave);

  if (!entrada) {
    const dato = pedirALaFuente(clave);
    entradas.set(clave, { dato, momento: ahora });
    return { origen: "fuente", dato, se_devolvio_lo_viejo: false, se_pidio_de_nuevo: true };
  }

  // `envejecer` empuja la marca de tiempo hacia atrás para poder comprobar el
  // caso sin esperar treinta segundos. Es lo mismo que hace un reloj falso en
  // una prueba, y decirlo es parte del trato.
  const momento = envejecer ? entrada.momento - PLAZO_MS - 1 : entrada.momento;

  if (estaObsoleta({ ...entrada, momento }, ahora)) {
    const fresco = pedirALaFuente(clave);
    entradas.set(clave, { dato: fresco, momento: ahora });
    return {
      origen: "cache-obsoleta",
      dato: entrada.dato,
      dato_fresco: fresco,
      se_devolvio_lo_viejo: true,
      se_pidio_de_nuevo: true,
    };
  }

  return { origen: "cache", dato: entrada.dato, se_devolvio_lo_viejo: false, se_pidio_de_nuevo: false };
}

export function invalidar(clave) {
  const habia = entradas.delete(clave);
  return { invalidadas: habia ? 1 : 0, quedan: [...entradas.keys()] };
}
