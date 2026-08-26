import { createServer } from "node:http";

import express from "express";
import { WebSocket, WebSocketServer } from "ws";

/**
 * RECONEXIÓN Y MENSAJES PERDIDOS.
 *
 * La clase 107 dejó una conexión abierta y no dijo qué pasa cuando se cae. Y se
 * cae: un móvil que cambia de antena, un portátil que se suspende, un
 * intermediario que corta lo que lleva un minuto callado, un despliegue.
 *
 * Hay dos problemas y se confunden constantemente:
 *
 *   1. **Volver a conectar.** Es el fácil, y se resuelve con espera creciente:
 *      100, 200, 400, 800… Si todo el mundo reintenta cada segundo, el servidor
 *      que se acaba de caer se vuelve a caer al levantarse.
 *   2. **No perderse nada.** Es el difícil, y no lo resuelve reconectar: mientras
 *      no había conexión, el servidor siguió teniendo cosas que decir. Hace falta
 *      que los mensajes tengan número y que el cliente diga por cuál iba.
 *
 * Lo segundo es exactamente lo que la clase 106 traía de regalo con
 * `Last-Event-ID`. Aquí hay que escribirlo.
 */

const app = express();
const servidorHttp = createServer(app);
const canal = new WebSocketServer({ server: servidorHttp, path: "/ws" });

/**
 * EL HISTORIAL, QUE ES LO QUE HACE POSIBLE NO PERDER NADA.
 *
 * Sin él, reconectar sirve para volver a estar en línea y no para recuperar lo
 * que pasó mientras tanto. Aquí es una lista en memoria; en un sistema real es
 * una tabla o un registro de eventos, y su tamaño es una decisión —cuánto hacia
 * atrás se puede reanudar— que hay que tomar a propósito.
 */
const HISTORIAL = [];
let siguienteId = 1;

function emitir(texto) {
  const mensaje = { id: siguienteId, texto };
  siguienteId += 1;
  HISTORIAL.push(mensaje);
  for (const conexion of canal.clients) {
    if (conexion.readyState === WebSocket.OPEN) {
      conexion.send(JSON.stringify(mensaje));
    }
  }
  return mensaje;
}

canal.on("connection", (conexion, peticion) => {
  // LA REANUDACIÓN. El cliente dice por cuál iba y el servidor le manda lo que
  // se perdió, en orden, antes de nada más.
  const desde = Number(new URL(peticion.url, "http://x").searchParams.get("desde") ?? 0);
  for (const mensaje of HISTORIAL.filter((m) => m.id > desde)) {
    conexion.send(JSON.stringify(mensaje));
  }
});

app.get("/emitir", (peticion, respuesta) => {
  const cuantos = Number(peticion.query.n ?? 1);
  const emitidos = [];
  for (let i = 0; i < cuantos; i += 1) emitidos.push(emitir(`mensaje ${siguienteId}`));
  respuesta.json({ emitidos });
});

app.get("/", (peticion, respuesta) => {
  respuesta.type("html").send(
    `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Reconexion</title></head>
<body><h1>Canal con historial</h1>
<p data-canal="ws://${peticion.headers.host}/ws?desde=0">el canal, con el punto por donde se reanuda</p>
</body></html>`,
  );
});

/**
 * LA ESPERA CRECIENTE, ESCRITA PARA QUE SE VEA.
 *
 * Cada intento espera el doble que el anterior. Los tres primeros valores son
 * los que este medidor va a usar de verdad contra una dirección donde no escucha
 * nadie, para que las esperas que se publican sean reales y no una tabla escrita
 * a mano.
 *
 * Falta una cosa que un cliente serio sí hace y aquí no: **ruido**. Si mil
 * clientes se cayeron a la vez, con esta tabla los mil reintentan a la vez, y a
 * los 100 milisegundos exactos. Sumar un azar de hasta el propio intervalo es lo
 * que evita esa avalancha, y se llama fluctuación.
 */
const ESPERAS_MS = [100, 200, 400];

function esperar(ms) {
  return new Promise((seguir) => setTimeout(seguir, ms));
}

/**
 * Intenta conectar y se rinde enseguida. Se usa contra un puerto donde no
 * escucha nadie: los fallos son de verdad y las esperas también.
 *
 * El detalle que costó una tarde: **el recolector de mensajes se engancha antes
 * de que la conexión se abra**, no después. Al reanudar, el servidor manda el
 * historial en cuanto acepta la conexión, y si el cliente espera al evento de
 * apertura para ponerse a escuchar, esos primeros mensajes ya han pasado. Es un
 * fallo real de los clientes escritos deprisa y aquí se vio en el acto: la
 * reanudación devolvía una lista vacía.
 */
function intentarConectar(url) {
  return new Promise((resolver) => {
    const cliente = new WebSocket(url);
    cliente.recibidos = [];
    cliente.on("message", (datos) => {
      cliente.recibidos.push(String(JSON.parse(datos.toString()).id));
    });
    const rendirse = setTimeout(() => {
      cliente.terminate();
      resolver(null);
    }, 300);
    cliente.once("open", () => {
      clearTimeout(rendirse);
      resolver(cliente);
    });
    cliente.once("error", () => {
      clearTimeout(rendirse);
      resolver(null);
    });
  });
}

/** Espera a que el cliente haya juntado tantos mensajes, o se rinde. */
async function recogerMensajes(cliente, cuantos, milisegundos = 1500) {
  const limite = Date.now() + milisegundos;
  while (cliente.recibidos.length < cuantos && Date.now() < limite) {
    await esperar(20);
  }
  return cliente.recibidos.slice();
}

app.get("/reconexion.json", async (peticion, respuesta) => {
  const anfitrion = peticion.headers.host;
  HISTORIAL.length = 0;
  siguienteId = 1;

  // 1. Alguien conectado, tres mensajes, todos recibidos.
  const primero = await intentarConectar(`ws://${anfitrion}/ws?desde=0`);
  emitir("mensaje 1");
  emitir("mensaje 2");
  emitir("mensaje 3");
  const recibidosAntes = await recogerMensajes(primero, 3);

  // 2. EL CORTE. Se cierra la conexión y el mundo sigue.
  primero.terminate();
  await esperar(50);
  emitir("mensaje 4");
  emitir("mensaje 5");

  // 3. LA ESPERA CRECIENTE, contra una dirección donde no escucha nadie, para
  //    que los fallos y los tiempos sean reales.
  const esperasReales = [];
  for (const espera of ESPERAS_MS) {
    const inicio = Date.now();
    await esperar(espera);
    esperasReales.push(Date.now() - inicio);
    // El intento en sí, contra una dirección donde no escucha nadie. Su duración
    // NO se suma a la espera medida: lo que se publica es cuánto se esperó antes
    // de reintentar, que es lo que define la política.
    await intentarConectar("ws://127.0.0.1:1/ws");
  }

  // 4. LA REANUDACIÓN. El cliente dice por dónde iba: el 3.
  const segundo = await intentarConectar(`ws://${anfitrion}/ws?desde=3`);
  const recibidosDespues = await recogerMensajes(segundo, 2);
  segundo.terminate();

  const todos = [...recibidosAntes, ...recibidosDespues];
  respuesta.json({
    framework: "express",
    recibidos_antes_del_corte: recibidosAntes,
    emitidos_durante_el_corte: 2,
    recibidos_al_reconectar: recibidosDespues,
    ni_perdidos_ni_duplicados: todos.join(",") === "1,2,3,4,5",
    ninguno_repetido: new Set(todos).size === todos.length,
    esperas_declaradas_ms: ESPERAS_MS,
    esperas_reales_ms: esperasReales,
    la_espera_crece: ESPERAS_MS.every((v, i) => i === 0 || v > ESPERAS_MS[i - 1]),
    intentos_fallidos: ESPERAS_MS.length,
    quien_reconecta: "quien escribe el cliente: la biblioteca ws no reconecta sola",
    como_se_reanuda: "un parametro ?desde= en la URL del canal y un historial en el servidor",
    lo_que_falta_para_produccion:
      "fluctuacion: sumar un azar a cada espera para que mil clientes caidos no reintenten a la vez",
  });
});

servidorHttp.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
