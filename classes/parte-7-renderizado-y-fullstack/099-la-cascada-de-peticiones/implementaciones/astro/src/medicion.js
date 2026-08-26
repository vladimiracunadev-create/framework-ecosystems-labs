import { PETICIONES, RETARDO_MS } from "./fuente.js";

/**
 * EL CRONÓMETRO, IDÉNTICO EN LAS CINCO IMPLEMENTACIONES.
 *
 * Mide desde fuera: pide la página por HTTP y cuenta lo que tarda en llegar
 * entera. Incluye lo que el framework tarde en sus cosas, y así tiene que ser —
 * lo que se compara es la misma pantalla contra sí misma, no un framework contra
 * otro.
 *
 * Antes de medir hace una petición de calentamiento a cada ruta. Sin ella, la
 * primera se lleva el coste de abrir módulos y de que el motor compile, y ese
 * coste no tiene nada que ver con la cascada.
 *
 * Y una advertencia que vale para cualquier número de esta clase: **estos
 * milisegundos son de esta máquina y de esta ejecución**. Lo que significa algo
 * es la relación entre ellos, no su valor. La clase 007 explica por qué publicar
 * lo segundo sin lo primero no dice nada.
 */

async function cronometrar(url, pedir) {
  const inicio = Date.now();
  await (await pedir(url)).text();
  return Date.now() - inicio;
}

export async function medir(host, pedir = fetch) {
  const origen = `http://${host}`;
  const rutas = ["/cascada", "/paralelo", "/anidada/detalle"];
  for (const ruta of rutas) await pedir(`${origen}${ruta}`).then((r) => r.text());

  const cascada = await cronometrar(`${origen}/cascada`, pedir);
  const paralelo = await cronometrar(`${origen}/paralelo`, pedir);
  const anidada = await cronometrar(`${origen}/anidada/detalle`, pedir);

  return {
    peticiones: PETICIONES,
    retardo_de_cada_una_ms: RETARDO_MS,
    cascada_ms: cascada,
    paralelo_ms: paralelo,
    la_cascada_tarda_mas: cascada > paralelo,
    al_menos_el_doble: cascada >= paralelo * 2,
    anidada_ms: anidada,
    // Dos cargas anidadas de sesenta milisegundos: si van a la vez, la respuesta
    // sale por debajo de noventa; si van en cadena, por encima de ciento veinte.
    // No hay zona gris posible con esos números.
    las_cargas_anidadas_van_en_paralelo: anidada < RETARDO_MS * 1.5,
    como_se_mide:
      "el propio servidor pide sus tres pantallas por HTTP y cronometra, tras una petición de calentamiento a cada una",
    lo_que_no_significa:
      "estos milisegundos son de esta máquina; lo comparable es la relación entre ellos",
  };
}
