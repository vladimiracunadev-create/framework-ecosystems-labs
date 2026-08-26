import { LLAVE_QUE_NO_DEBE_VIAJAR } from "./secretos.js";

/**
 * LA COMPROBACIÓN, IDÉNTICA EN LAS DOS IMPLEMENTACIONES.
 *
 * La promesa de un componente de servidor es que **su código no llega al
 * navegador**. Eso no se comprueba leyendo documentación: se comprueba
 * descargando lo que el navegador descargaría y buscando dentro.
 *
 * Así que esto hace tres cosas:
 *
 *   1. Pide la página.
 *   2. Saca de ella todas las rutas de JavaScript que menciona —etiquetas
 *      `<script src>`, `modulepreload`, importaciones dentro de guiones en
 *      línea— porque cada framework las declara de una forma distinta.
 *   3. Descarga cada una y busca la llave y la huella de `node:fs`.
 *
 * Si la llave apareciera, la promesa estaría rota. El contrato exige que no
 * aparezca en ninguno.
 */

/** Toda ruta absoluta a un `.js` que el documento mencione, sin repetir. Vale
 *  para los dos frameworks porque no depende de cómo declaren sus guiones. */
export function guionesQueMenciona(html) {
  const rutas = new Set();
  const patron = /["'(](\/[^"'()\s]+\.js)["')]/g;
  let encontrado;
  while ((encontrado = patron.exec(html)) !== null) {
    rutas.add(encontrado[1]);
  }
  return [...rutas];
}

export async function comprobar(host, pedir = fetch) {
  const origen = `http://${host}`;
  const pagina = await (await pedir(`${origen}/`)).text();
  const rutas = guionesQueMenciona(pagina);

  let conLaLlave = 0;
  let conNodeFs = 0;
  let bytesDescargados = 0;
  for (const ruta of rutas) {
    const cuerpo = await (await pedir(`${origen}${ruta}`)).text();
    bytesDescargados += Buffer.byteLength(cuerpo, "utf8");
    if (cuerpo.includes(LLAVE_QUE_NO_DEBE_VIAJAR)) conLaLlave += 1;
    if (cuerpo.includes("node:fs")) conNodeFs += 1;
  }

  return {
    guiones_descargados: rutas.length,
    bytes_descargados: bytesDescargados,
    guiones_con_la_llave: conLaLlave,
    guiones_con_node_fs: conNodeFs,
    la_llave_no_viaja: conLaLlave === 0,
    el_resultado_si_llega: pagina.includes("data-desde=\"el-disco\""),
    como_se_mide:
      "se descarga uno por uno todo el JavaScript que el documento menciona y se busca la llave dentro",
    lo_que_no_cubre:
      "solo se sigue un nivel: lo que esos archivos importen a su vez no se descarga",
  };
}
