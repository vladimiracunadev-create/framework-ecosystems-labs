import { RETARDO_MS } from "./fuente.js";

/**
 * MEDIR UN FLUJO OBLIGA A LEER LA RESPUESTA A TROZOS.
 *
 * Y ahí está el motivo de que esta clase necesite su propio medidor en lugar de
 * usar el contrato tal cual: `await respuesta.text()` espera a que la respuesta
 * termine. Con eso, una respuesta que llegó en dos tandas y una que llegó de
 * golpe son indistinguibles — que es exactamente lo que esta clase quiere
 * distinguir.
 *
 * Así que se lee el cuerpo con un lector, trozo a trozo, y se anota el momento
 * en que aparece cada marca. Es lo mismo que hace un navegador, y es la única
 * forma de ver el flujo desde fuera.
 */

/**
 * Tres marcas, y la tercera es la que descubrió algo.
 *
 * `lista` busca el DATO —el texto de la primera tarea— porque el dato llega en
 * los tres frameworks, aunque no de la misma forma. `listaEnHtml` busca el
 * marcado, y ahí es donde se separan: hay quien manda el HTML ya construido y
 * quien manda solo el dato para que el navegador lo pinte. Los dos son flujo;
 * solo uno funciona sin JavaScript.
 */
export const MARCAS = {
  cabecera: 'data-parte="cabecera"',
  lista: "comprar pan",
  listaEnHtml: 'data-parte="lista"',
};

/**
 * UN AGENTE DE USUARIO DE NAVEGADOR, Y NO ES UN CAPRICHO.
 *
 * Remix decide si envía la respuesta en flujo o entera mirando esta cabecera:
 * a un rastreador le manda el documento completo, porque un buscador que lea
 * media página indexa media página. Sin cabecera, `isbot` da por hecho que quien
 * pide no es un navegador, y el flujo se apaga.
 *
 * Se descubre midiendo: con esta cabecera la cabecera llega a los treinta
 * milisegundos, sin ella a los trescientos sesenta. Es una decisión sensata del
 * framework y un aviso para cualquiera que mida rendimiento con una herramienta
 * de línea de órdenes: **puede que no estés midiendo lo que ve un navegador**.
 */
const COMO_UN_NAVEGADOR = {
  "user-agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

async function cuandoLlegaCadaParte(url, pedir) {
  const inicio = Date.now();
  const respuesta = await pedir(url, { headers: COMO_UN_NAVEGADOR });
  const lector = respuesta.body.getReader();
  const decodificador = new TextDecoder();
  const cuando = {};
  let texto = "";

  for (;;) {
    const { done, value } = await lector.read();
    if (value) texto += decodificador.decode(value, { stream: true });
    for (const [nombre, aguja] of Object.entries(MARCAS)) {
      if (cuando[nombre] === undefined && texto.includes(aguja)) {
        cuando[nombre] = Date.now() - inicio;
      }
    }
    if (done) break;
  }
  return { cuando, total: Date.now() - inicio };
}

export async function medir(host, pedir = fetch) {
  const origen = `http://${host}`;
  // Calentamiento: la primera petición se lleva el coste de compilar y abrir
  // módulos, y ese coste no tiene nada que ver con el flujo.
  for (const ruta of ["/flujo", "/sin-flujo"]) {
    await pedir(`${origen}${ruta}`, { headers: COMO_UN_NAVEGADOR }).then((r) => r.text());
  }

  const conFlujo = await cuandoLlegaCadaParte(`${origen}/flujo`, pedir);
  const deGolpe = await cuandoLlegaCadaParte(`${origen}/sin-flujo`, pedir);

  const separacion = conFlujo.cuando.lista - conFlujo.cuando.cabecera;
  const separacionDeGolpe = deGolpe.cuando.lista - deGolpe.cuando.cabecera;

  return {
    retardo_de_la_lista_ms: RETARDO_MS,
    ms_hasta_la_cabecera: conFlujo.cuando.cabecera,
    ms_hasta_la_lista: conFlujo.cuando.lista,
    // Dos tercios del retardo: margen de sobra para que ni una máquina lenta ni
    // un trozo de red que se junte confundan un flujo real con uno inventado.
    la_cabecera_llega_antes: separacion >= RETARDO_MS * 0.66,
    separacion_ms: separacion,
    la_lista_llega_como_html: conFlujo.cuando.listaEnHtml !== undefined,
    sin_flujo_ms_hasta_la_cabecera: deGolpe.cuando.cabecera,
    sin_flujo_ms_hasta_la_lista: deGolpe.cuando.lista,
    sin_flujo_la_cabecera_llega_antes: separacionDeGolpe >= RETARDO_MS * 0.66,
    como_se_mide:
      "se lee el cuerpo de la respuesta a trozos y se anota cuándo aparece cada marca, igual que haría un navegador",
    lo_que_no_significa:
      "estos milisegundos son de esta máquina; lo comparable es la separación entre las dos partes",
  };
}
