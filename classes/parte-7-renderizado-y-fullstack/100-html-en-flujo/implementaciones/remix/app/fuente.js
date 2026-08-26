/**
 * UNA PARTE RÁPIDA Y UNA LENTA, IDÉNTICAS EN LAS TRES IMPLEMENTACIONES.
 *
 * La cabecera se sabe al instante: el nombre de quien mira está en la sesión. La
 * lista tarda trescientos milisegundos, que es lo que tarda una consulta que
 * cruza tres tablas.
 *
 * Sin flujo, la respuesta entera espera a la lista: la pantalla está en blanco
 * trescientos milisegundos aunque la mitad estuviera lista desde el principio.
 * Con flujo, la cabecera sale ya y la lista llega cuando llega.
 */

/** Lo que tarda la parte lenta. Trescientos milisegundos es bastante para que la
 *  diferencia no se pueda confundir con ruido de red local. */
export const RETARDO_MS = 300;

export function nombreDeQuienMira() {
  return "Ada";
}

export async function pedirLaLista() {
  await new Promise((seguir) => setTimeout(seguir, RETARDO_MS));
  return ["comprar pan", "regar las plantas", "llamar al fontanero"];
}
