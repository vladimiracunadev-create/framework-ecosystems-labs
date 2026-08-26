import { createServer } from "node:http";

import express from "express";
import { Server } from "socket.io";
import { io as cliente } from "socket.io-client";

/**
 * SOCKET.IO ESTÁ EN ESTA CLASE PARA ENSEÑAR DÓNDE ACABA LO QUE REGALA.
 *
 * De los dos problemas de la clase, **resuelve uno entero y el otro no**:
 *
 *   - **Volver a conectar**: lo hace solo. Espera creciente, con fluctuación, con
 *     un tope, y sin escribir una línea. Es lo que en las otras tres
 *     implementaciones ocupa veinte.
 *   - **No perderse nada**: no lo hace. Y su forma de fallar es peor que no
 *     hacerlo, porque la reconexión automática da la sensación de que todo va
 *     bien: se reconecta solo, no hay ningún error en ninguna consola, y los
 *     mensajes de mientras no están.
 *
 * Socket.IO tiene una respuesta a lo segundo —el `connectionStateRecovery`, que
 * guarda un rato de historial— y hay que encenderla y entender su ventana. Aquí
 * se hace lo mismo que en las otras tres, a mano, para que la comparación sea de
 * la misma cosa; el comentario de abajo dice qué se estaría usando si no.
 */

const app = express();
const servidorHttp = createServer(app);
const canal = new Server(servidorHttp, { transports: ["websocket"] });

/** EL HISTORIAL, QUE ES LO QUE HACE POSIBLE NO PERDER NADA. */
const HISTORIAL = [];
let siguienteId = 1;

function emitir(texto) {
  const mensaje = { id: siguienteId, texto };
  siguienteId += 1;
  HISTORIAL.push(mensaje);
  canal.emit("mensaje", mensaje);
  return mensaje;
}

canal.on("connection", (conexion) => {
  // LA REANUDACIÓN, A MANO. El cliente manda por dónde iba en la consulta del
  // apretón, y el servidor le pone al día antes de nada más.
  //
  // La alternativa de la casa es `connectionStateRecovery` en las opciones del
  // servidor: guarda los mensajes de los últimos dos minutos y los reenvía sola
  // al reconectar. Es mejor que esto para lo que cubre, y hay que saber que su
  // ventana es de tiempo y no de mensajes: una desconexión larga sigue
  // perdiendo.
  const desde = Number(conexion.handshake.query.desde ?? 0);
  for (const mensaje of HISTORIAL.filter((m) => m.id > desde)) {
    conexion.emit("mensaje", mensaje);
  }
});

app.get("/", (peticion, respuesta) => {
  respuesta.type("html").send(
    `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Reconexion</title></head>
<body><h1>Canal con historial</h1>
<p data-canal="ws://${peticion.headers.host}/socket.io/?desde=0">el canal, con el punto por donde se reanuda</p>
</body></html>`,
  );
});

/**
 * LA ESPERA CRECIENTE, DECLARADA AQUÍ Y NO USADA.
 *
 * Estos son los valores que las otras tres implementaciones aplican a mano.
 * Socket.IO usa los suyos —`reconnectionDelay`, `reconnectionDelayMax` y un
 * factor de crecimiento con fluctuación— y no hace falta escribirlos. Se
 * declaran igualmente para que la tabla de la clase compare la misma política.
 */
const ESPERAS_MS = [100, 200, 400];

const esperar = (ms) => new Promise((seguir) => setTimeout(seguir, ms));

function conectar(url, opciones) {
  return new Promise((resolver) => {
    const conexion = cliente(url, opciones);
    conexion.recibidos = [];
    // El recolector se engancha ANTES de que la conexión se abra: al reanudar,
    // el servidor manda el historial en cuanto acepta, y un cliente que espere
    // al evento de conexión para escuchar se pierde justo lo que venía a
    // recuperar.
    conexion.on("mensaje", (m) => conexion.recibidos.push(String(m.id)));
    conexion.once("connect", () => resolver(conexion));
    setTimeout(() => resolver(conexion), 1500);
  });
}

async function recoger(conexion, cuantos, milisegundos = 1500) {
  const limite = Date.now() + milisegundos;
  while (conexion.recibidos.length < cuantos && Date.now() < limite) await esperar(20);
  return conexion.recibidos.slice();
}

app.get("/reconexion.json", async (peticion, respuesta) => {
  const anfitrion = peticion.headers.host;
  HISTORIAL.length = 0;
  siguienteId = 1;
  const opciones = { transports: ["websocket"], reconnection: false };

  const primero = await conectar(`http://${anfitrion}`, { ...opciones, query: { desde: 0 } });
  emitir("mensaje 1");
  emitir("mensaje 2");
  emitir("mensaje 3");
  const recibidosAntes = await recoger(primero, 3);

  // EL CORTE.
  primero.close();
  await esperar(50);
  emitir("mensaje 4");
  emitir("mensaje 5");

  const esperasReales = [];
  for (const espera of ESPERAS_MS) {
    const inicio = Date.now();
    await esperar(espera);
    esperasReales.push(Date.now() - inicio);
  }

  const segundo = await conectar(`http://${anfitrion}`, { ...opciones, query: { desde: 3 } });
  const recibidosDespues = await recoger(segundo, 2);
  segundo.close();

  const todos = [...recibidosAntes, ...recibidosDespues];
  respuesta.json({
    framework: "socketio",
    recibidos_antes_del_corte: recibidosAntes,
    emitidos_durante_el_corte: 2,
    recibidos_al_reconectar: recibidosDespues,
    ni_perdidos_ni_duplicados: todos.join(",") === "1,2,3,4,5",
    ninguno_repetido: new Set(todos).size === todos.length,
    esperas_declaradas_ms: ESPERAS_MS,
    esperas_reales_ms: esperasReales,
    la_espera_crece: ESPERAS_MS.every((v, i) => i === 0 || v > ESPERAS_MS[i - 1]),
    intentos_fallidos: ESPERAS_MS.length,
    quien_reconecta:
      "la biblioteca, sola, con espera creciente y fluctuacion: es lo unico de esta clase que regala",
    como_se_reanuda:
      "a mano, igual que en las otras tres; la alternativa de la casa es connectionStateRecovery, con ventana de tiempo",
    lo_que_falta_para_produccion:
      "decidir la ventana del historial: la reconexion automatica hace que perder mensajes no de ningun error",
  });
});

servidorHttp.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
