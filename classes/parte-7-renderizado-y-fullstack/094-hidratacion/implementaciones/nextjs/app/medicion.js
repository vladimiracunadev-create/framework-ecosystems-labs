/**
 * LA MEDICIÓN, IDÉNTICA EN LAS CINCO IMPLEMENTACIONES.
 *
 * Este archivo es el mismo byte a byte en Astro, Next.js, Nuxt, SvelteKit y
 * Remix, y esa es la condición para que los números de la clase se puedan
 * comparar: si cada uno midiera a su manera, la tabla no diría nada.
 *
 * Lo que mide son tres cosas, todas sobre el HTML que el servidor devuelve —
 * ninguna sobre el navegador, porque este contrato no abre ninguno:
 *
 *   1. CUÁNTAS VECES APARECE EL MISMO DATO. Es la demostración central de la
 *      clase: en una pantalla hidratada el dato viaja DOS veces, una como
 *      texto ya pintado y otra como estado para que el navegador vuelva a
 *      construir lo mismo. No es un defecto de implementación: es cómo
 *      funciona la hidratación.
 *   2. CUÁNTO PESAN LOS GUIONES EN LÍNEA. Ahí es donde cada framework mete su
 *      estado serializado, con un nombre distinto en cada caso.
 *   3. LO MISMO EN UNA PANTALLA SIN NADA QUE HIDRATAR, para tener con qué
 *      comparar.
 */

/** Cuenta las apariciones de una aguja en un texto. Sin expresiones regulares:
 *  la aguja es texto literal y no debe interpretarse. */
export function contarApariciones(texto, aguja) {
  let veces = 0;
  let desde = 0;
  for (;;) {
    const donde = texto.indexOf(aguja, desde);
    if (donde === -1) return veces;
    veces += 1;
    desde = donde + aguja.length;
  }
}

/** Suma los bytes del contenido de los `<script>` SIN `src`: los que viajan
 *  dentro del propio HTML. Ahí es donde vive el estado serializado. */
export function bytesDeGuionesEnLinea(html) {
  let total = 0;
  const guion = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g;
  let encontrado;
  while ((encontrado = guion.exec(html)) !== null) {
    total += Buffer.byteLength(encontrado[1], "utf8");
  }
  return total;
}

/** El dato que se busca en el HTML. Es la primera tarea de la lista, y aparece
 *  una vez pintada y otra dentro del estado que el navegador va a leer. */
export const AGUJA = "comprar pan";

/** Los cuatro pasos, en orden. Son los mismos en los cinco frameworks porque
 *  la hidratación es un mecanismo, no una función de biblioteca. */
export const PASOS = [
  "el servidor ejecuta los componentes y devuelve HTML ya pintado",
  "el navegador lo muestra: la pantalla se ve, pero no responde",
  "el navegador descarga el código de esos mismos componentes",
  "el navegador los vuelve a ejecutar con el estado que venía en el HTML y ata los manejadores",
];

/**
 * Pide sus propias dos pantallas y devuelve los números. Es una medición de
 * verdad —dos peticiones HTTP reales contra el propio servidor—, no una cifra
 * escrita a mano en un JSON.
 *
 * Recibe el `Host` con el que llegó la petición en lugar de suponer un puerto,
 * y hay un motivo concreto: el adaptador de Node de Astro devuelve
 * `http://localhost` **sin puerto** en `Astro.url`, así que fiarse de lo que el
 * framework dice que es su propia dirección falla. El `Host` lo pone quien
 * pide, y siempre es correcto.
 */
export async function medir(host, pedir = fetch) {
  const origen = `http://${host}`;
  const hidratada = await (await pedir(`${origen}/`)).text();
  const inerte = await (await pedir(`${origen}/inerte`)).text();
  const veces = contarApariciones(hidratada, AGUJA);
  return {
    el_dato_viaja_veces: veces,
    el_dato_viaja_mas_de_una_vez: veces > 1,
    el_dato_viaja_veces_en_la_inerte: contarApariciones(inerte, AGUJA),
    bytes_del_html: Buffer.byteLength(hidratada, "utf8"),
    bytes_de_guiones_en_linea: bytesDeGuionesEnLinea(hidratada),
    bytes_de_la_pantalla_inerte: Buffer.byteLength(inerte, "utf8"),
    pasos: PASOS,
    se_paga_dos_veces: true,
    como_se_mide:
      "el propio servidor pide sus dos pantallas por HTTP y cuenta: no hay ninguna cifra escrita a mano",
  };
}
