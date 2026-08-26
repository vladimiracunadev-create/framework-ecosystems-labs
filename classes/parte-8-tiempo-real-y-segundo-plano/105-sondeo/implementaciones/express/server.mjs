import express from "express";

/**
 * SONDEO: PREGUNTAR CADA CIERTO TIEMPO, QUE ES LA RESPUESTA MÁS ANTIGUA Y LA
 * QUE MÁS SE SIGUE USANDO.
 *
 * Antes de las tres clases siguientes —eventos del servidor, WebSocket, y lo que
 * cuesta mantenerlos vivos— conviene medir esta, porque casi siempre es
 * suficiente y siempre es la más barata de operar: no hay conexiones abiertas,
 * no hay estado por cliente, y un balanceador cualquiera la reparte sin saber
 * nada.
 *
 * Lo que esta clase enseña no es el bucle de preguntar: es que **preguntar bien
 * es preguntar con condición**. Un sondeo que se trae el cuerpo entero cada vez
 * gasta lo mismo cambie algo o no; uno que manda `If-None-Match` recibe un 304
 * sin cuerpo cuando no hay novedad.
 *
 * Y lo que NO arregla, que hay que decirlo: la ida y vuelta ocurre igual. Se
 * ahorra el cuerpo, no la petición.
 */

const app = express();

/** El estado que se sondea. La versión sube en cada cambio y es lo que hace de
 *  marca de validación. */
let version = 1;
let valor = "tres pedidos";

/** El identificador de la versión actual, en el formato que pide HTTP: entre
 *  comillas. Sin las comillas, algunos intermediarios lo descartan. */
const marca = () => `"v${version}"`;

app.get("/estado", (peticion, respuesta) => {
  const actual = marca();

  // LA CONDICIÓN, QUE ES TODA LA CLASE.
  //
  // Si quien pregunta ya tiene esta versión, se le dice que no hay nada nuevo y
  // se acabó: 304, sin cuerpo. Es la misma mecánica de la clase 048 con las
  // cachés, usada aquí para un fin distinto — no para evitar una consulta, sino
  // para abaratar una pregunta que se va a repetir cien veces.
  if (peticion.headers["if-none-match"] === actual) {
    respuesta.set("ETag", actual);
    return respuesta.status(304).end();
  }

  respuesta.set("ETag", actual);
  // `no-cache` no significa «no guardes»: significa «guárdalo, pero pregunta
  // antes de usarlo». Es exactamente lo que un sondeo necesita.
  respuesta.set("Cache-Control", "no-cache");
  respuesta.json({ version, valor });
});

app.post("/cambiar", (peticion, respuesta) => {
  version += 1;
  valor = `${version + 2} pedidos`;
  respuesta.json({ version, valor });
});

/**
 * UNA SESIÓN DE SONDEO, MEDIDA POR EL PROPIO SERVIDOR.
 *
 * Seis preguntas: cinco sin novedad y una con ella. Es la proporción real de
 * cualquier sondeo —casi todas las preguntas sobran— y es la razón de que el
 * condicional importe tanto.
 */
app.get("/sondeo.json", async (peticion, respuesta) => {
  const origen = `http://${peticion.headers.host}`;
  const intervalo = 50;

  const primera = await fetch(`${origen}/estado`);
  const etiqueta = primera.headers.get("etag");

  let sinCambios = 0;
  let bytesSinCambios = 0;
  for (let i = 0; i < 5; i += 1) {
    await new Promise((seguir) => setTimeout(seguir, intervalo));
    const r = await fetch(`${origen}/estado`, { headers: { "if-none-match": etiqueta } });
    if (r.status === 304) {
      sinCambios += 1;
      bytesSinCambios += Buffer.byteLength(await r.text(), "utf8");
    }
  }

  await fetch(`${origen}/cambiar`, { method: "POST" });
  const conNovedad = await fetch(`${origen}/estado`, { headers: { "if-none-match": etiqueta } });
  const cuerpo = await conNovedad.text();

  respuesta.json({
    framework: "express",
    intervalo_ms: intervalo,
    sondeos: 6,
    sin_cambios: sinCambios,
    con_cambios: conNovedad.status === 200 ? 1 : 0,
    peticiones_desperdiciadas: sinCambios,
    bytes_de_cuerpo_sin_cambios: bytesSinCambios,
    bytes_de_cuerpo_con_cambios: Buffer.byteLength(cuerpo, "utf8"),
    el_dato_llega_con_un_retraso_de_hasta_ms: intervalo,
    como_se_declara_el_etag: "a mano, con respuesta.set(\"ETag\", …) y un if sobre if-none-match",
    que_no_arregla_el_condicional:
      "la ida y vuelta ocurre igual: se ahorra el cuerpo, no la peticion ni la latencia",
    cuando_conviene:
      "cuando el retraso aceptable se mide en segundos y no en milisegundos, que es casi siempre",
  });
});

app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
