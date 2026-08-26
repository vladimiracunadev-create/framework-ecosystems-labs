import { createServer } from "node:http";
import net from "node:net";

import express from "express";
import { Server } from "socket.io";
import { io as cliente } from "socket.io-client";

/**
 * SOCKET.IO NO ES UN WEBSOCKET: ES UNA CAPA ENCIMA, Y ESA ES LA COMPARACIÓN.
 *
 * Está en el elenco de esta clase precisamente por eso. Usa WebSocket cuando
 * puede y se cae a HTTP largo cuando no, tiene su propio formato de mensaje
 * encima del de WebSocket, y añade tres cosas que `ws` no da y que casi todo el
 * mundo acaba escribiendo a mano:
 *
 *   - **eventos con nombre**, en lugar de un canal de texto donde uno se inventa
 *     el formato;
 *   - **salas**, que es la difusión a un subconjunto sin llevar la lista uno
 *     mismo;
 *   - **reconexión con espera creciente**, que es la clase 108 entera.
 *
 * El precio es igual de concreto: el cliente tiene que ser Socket.IO. Un
 * `new WebSocket(...)` del navegador no habla con esto, y ningún cliente de otro
 * lenguaje tampoco salvo que exista un puerto de la biblioteca. Se cambia
 * interoperabilidad por comodidad, y conviene saberlo antes y no después.
 */

const app = express();
const servidorHttp = createServer(app);

const canal = new Server(servidorHttp, {
  // Sin esta línea, Socket.IO empieza por HTTP largo y sube a WebSocket después.
  // Se fuerza el WebSocket para que la comparación con las otras tres
  // implementaciones sea de la misma cosa — y para que el apretón de manos de
  // más abajo tenga algo que comprobar.
  transports: ["websocket"],
});

canal.on("connection", (conexion) => {
  // EVENTOS CON NOMBRE. En `ws` esto sería un `if` sobre el texto que llega;
  // aquí el nombre es parte del protocolo, y es la diferencia que más se nota al
  // escribir una aplicación de verdad.
  conexion.on("mensaje", (texto) => {
    conexion.emit("eco", `eco: ${texto}`);
    // `broadcast` es «a todos menos a quien lo mandó». Sin él habría que llevar
    // la lista de conexiones a mano, que es exactamente lo que hace la
    // implementación de Express.
    conexion.broadcast.emit("difusion", `difusion: ${texto}`);
  });
});

app.get("/", (peticion, respuesta) => {
  respuesta.type("html").send(
    `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Socket.IO</title></head>
<body><h1>Canal</h1><p data-canal="ws://${peticion.headers.host}/socket.io/">el canal de esta pagina</p>
<script src="/socket.io/socket.io.js"></script>
</body></html>`,
  );
});

/**
 * EL APRETÓN DE MANOS, HECHO A MANO Y CONTRA SÍ MISMO.
 *
 * La ruta no es `/ws`: Socket.IO monta la suya y le pone parámetros de consulta
 * —la versión del protocolo y el transporte—. El apretón de abajo es el mismo
 * de WebSocket, con la misma cuenta del `Sec-WebSocket-Accept`, porque **por
 * debajo sigue siendo WebSocket**.
 *
 * Que la ruta cambie es el primer síntoma de lo que se ha comprado: esto ya no
 * es «un WebSocket en tal sitio», es «un Socket.IO».
 */
function apretonDeManos(anfitrion, ruta) {
  const [maquina, puerto] = anfitrion.split(":");
  return new Promise((resolver) => {
    const enchufe = net.connect(Number(puerto ?? 80), maquina, () => {
      enchufe.write(
        `GET ${ruta} HTTP/1.1\r\n` +
          `Host: ${anfitrion}\r\n` +
          "Upgrade: websocket\r\n" +
          "Connection: Upgrade\r\n" +
          "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n" +
          "Sec-WebSocket-Version: 13\r\n\r\n",
      );
    });
    let recibido = "";
    enchufe.on("data", (trozo) => {
      recibido += trozo.toString("latin1");
      if (recibido.includes("\r\n\r\n")) {
        enchufe.destroy();
        const cabeceras = recibido.split("\r\n\r\n")[0].split("\r\n");
        const estado = cabeceras[0].split(" ")[1];
        const aceptado = cabeceras
          .map((l) => l.split(": "))
          .find(([n]) => n.toLowerCase() === "sec-websocket-accept");
        resolver({ estado, aceptado: aceptado ? aceptado[1] : "" });
      }
    });
    enchufe.on("error", () => resolver({ estado: "error", aceptado: "" }));
  });
}

function esperar(conexion, evento) {
  return new Promise((resolver) => {
    const temporizador = setTimeout(() => resolver("(nada)"), 2000);
    conexion.once(evento, (dato) => {
      clearTimeout(temporizador);
      resolver(dato);
    });
  });
}

app.get("/ws.json", async (peticion, respuesta) => {
  const anfitrion = peticion.headers.host;
  const apreton = await apretonDeManos(anfitrion, "/socket.io/?EIO=4&transport=websocket");

  const opciones = { transports: ["websocket"] };
  const primero = cliente(`http://${anfitrion}`, opciones);
  const segundo = cliente(`http://${anfitrion}`, opciones);
  await Promise.all([esperar(primero, "connect"), esperar(segundo, "connect")]);

  const eco = esperar(primero, "eco");
  const difusion = esperar(segundo, "difusion");
  primero.emit("mensaje", "hola");
  const recibido = await eco;
  const recibidoPorElOtro = await difusion;
  primero.close();
  segundo.close();

  respuesta.json({
    framework: "socketio",
    ruta_del_canal: "/socket.io/?EIO=4&transport=websocket",
    apreton_de_manos: apreton.estado,
    accept_recibido: apreton.aceptado,
    accept_es_correcto: apreton.aceptado === "s3pPLMBiTxaQ9kYGzzhZRbK+xOo=",
    enviado: "hola",
    recibido,
    segundo_cliente_recibio: recibidoPorElOtro,
    mensajes_en_ambos_sentidos: true,
    sobre_la_misma_conexion: true,
    quien_guarda_las_conexiones: "la biblioteca, con salas y difusion incorporadas",
    como_se_monta: "Socket.IO monta su propia ruta con parametros de consulta: ya no es un WebSocket a secas",
    lo_que_se_pierde_al_dejar_http:
      "lo mismo que WebSocket, y ademas la interoperabilidad: el cliente tiene que ser Socket.IO",
  });
});

servidorHttp.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
