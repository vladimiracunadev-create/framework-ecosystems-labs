/**
 * LA MEDICIÓN, IDÉNTICA EN LAS TRES IMPLEMENTACIONES.
 *
 * Mismo archivo byte a byte en Astro, Next.js y Nuxt. La pregunta que contesta
 * es una sola: **¿cuánto cuesta que dos zonas de esta página funcionen?**
 *
 * Para saberlo hacen falta dos páginas y no una. `/` lleva el artículo y las dos
 * islas; `/sin-islas` lleva el mismo artículo y nada más. La diferencia entre las
 * dos es el precio de las islas, y ese número no se puede sacar mirando una sola
 * página.
 *
 * Y hay una tercera cifra que separa a los tres frameworks más que ninguna otra:
 * cuántas veces aparece el texto del artículo DENTRO de un guion. Si aparece
 * cero, el artículo no viajó al navegador de ninguna forma. Si aparece, viajó
 * —aunque su código no lo hiciera—.
 */

/** Cuenta apariciones de texto literal. */
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

/** Los `<script src=…>`: código que el navegador va a ir a buscar aparte. */
export function guionesExternos(html) {
  return (html.match(/<script[^>]*\ssrc=/g) ?? []).length;
}

/** Los `<script>` sin `src`: código y estado que viajan dentro del documento. */
export function bytesDeGuionesEnLinea(html) {
  let total = 0;
  const guion = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g;
  let encontrado;
  while ((encontrado = guion.exec(html)) !== null) {
    total += Buffer.byteLength(encontrado[1], "utf8");
  }
  return total;
}

/** Cuántas veces aparece una aguja dentro de los guiones en línea, no en el
 *  marcado. Es la diferencia entre «este texto se ve» y «este texto viaja». */
export function vecesDentroDeGuiones(html, aguja) {
  let veces = 0;
  const guion = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g;
  let encontrado;
  while ((encontrado = guion.exec(html)) !== null) {
    veces += contarApariciones(encontrado[1], aguja);
  }
  return veces;
}

/** Una frase del artículo, lo bastante rara como para no aparecer por azar. */
export const SENAL = "el barco de Teseo";

export async function medir(host, pedir = fetch) {
  const conIslas = await (await pedir(`http://${host}/`)).text();
  const sinIslas = await (await pedir(`http://${host}/sin-islas`)).text();
  const bytesConIslas = Buffer.byteLength(conIslas, "utf8");
  const bytesSinIslas = Buffer.byteLength(sinIslas, "utf8");
  return {
    bytes_del_html: bytesConIslas,
    bytes_sin_islas: bytesSinIslas,
    las_islas_cuestan: bytesConIslas > bytesSinIslas,
    lo_que_cuestan_dos_islas: bytesConIslas - bytesSinIslas,
    guiones_externos: guionesExternos(conIslas),
    guiones_externos_sin_islas: guionesExternos(sinIslas),
    bytes_de_guiones_en_linea: bytesDeGuionesEnLinea(conIslas),
    bytes_de_guiones_en_linea_sin_islas: bytesDeGuionesEnLinea(sinIslas),
    el_articulo_aparece_dentro_de_un_guion: vecesDentroDeGuiones(conIslas, SENAL),
    como_se_mide:
      "el propio servidor pide sus dos páginas por HTTP y compara: con islas y sin ellas",
  };
}
