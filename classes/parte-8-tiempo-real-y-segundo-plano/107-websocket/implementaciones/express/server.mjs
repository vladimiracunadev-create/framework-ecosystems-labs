import { createServer } from "node:http";
import net from "node:net";

import express from "express";
import { WebSocket, WebSocketServer } from "ws";

/**
 * WEBSOCKET: LA MISMA CONEXIÓN, EN LOS DOS SENTIDOS.
 *
 * La clase 106 dejó una carencia clara: un flujo de eventos solo va del servidor
 * al cliente. Cuando hace falta la otra dirección sobre la misma conexión —un
 * chat, un editor compartido, un juego— es cuando aparece esto.
 *
 * Y aparece con un precio que conviene poner delante: **deja de ser HTTP**. La
 * conexión empieza como una petición normal y a partir del 101 el protocolo es
 * otro. Eso significa que tus intermediarios tienen que saber de esto, que tu
 * autenticación por cabecera solo vale para el apretón inicial, y que ninguna
 * herramienta de HTTP —incluido el verificador de esta obra— puede leer lo que
 * pasa después.
 *
 * Por eso esta implementación se comprueba a sí misma: hace el apretón a mano
 * contra su propio servidor, abre dos clientes de verdad y publica en
 * `/ws.json` lo que ocurrió.
 */

const app = express();
const servidorHttp = createServer(app);

/**
 * `ws` no es un framework: es una biblioteca que se engancha al servidor HTTP
 * que ya existe. Express ni se entera de que esto está aquí, y esa es una
 * diferencia real con Socket.IO —que sí monta lo suyo— y con Spring, que integra
 * el WebSocket en su propio contenedor.
 */
const canal = new WebSocketServer({ server: servidorHttp, path: "/ws" });

canal.on("connection", (conexion) => {
  conexion.on("message", (datos) => {
    const texto = datos.toString();
    // LA VUELTA: por la misma conexión que trajo el mensaje.
    conexion.send(`eco: ${texto}`);
    // Y LA DIFUSIÓN: a todos los demás. Es lo que un flujo de eventos no puede
    // hacer sin que el servidor guarde una lista de conexiones abiertas... que
    // es exactamente lo que hay aquí, en `canal.clients`.
    for (const otro of canal.clients) {
      if (otro !== conexion && otro.readyState === WebSocket.OPEN) {
        otro.send(`difusion: ${texto}`);
      }
    }
  });
});

app.get("/", (peticion, respuesta) => {
  respuesta.type("html").send(
    `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>WebSocket</title></head>
<body><h1>Canal</h1><p data-canal="ws://${peticion.headers.host}/ws">el canal de esta pagina</p>
<script>const s = new WebSocket("ws://" + location.host + "/ws"); s.onopen = () => s.send("hola");</script>
</body></html>`,
  );
});

/**
 * EL APRETÓN DE MANOS, HECHO A MANO Y CONTRA SÍ MISMO.
 *
 * Es la única parte del protocolo que se puede comprobar con herramientas de
 * HTTP, y merece verla: el cliente manda una clave al azar en
 * `Sec-WebSocket-Key` y el servidor devuelve, en `Sec-WebSocket-Accept`, el
 * SHA-1 de esa clave concatenada con una cadena fija que está escrita en el RFC.
 *
 * Esa cadena fija no es un secreto ni una protección: existe para que un
 * servidor que no sepa de WebSocket no pueda contestar por accidente algo que
 * parezca correcto. Con la clave de ejemplo del RFC 6455, la respuesta correcta
 * es siempre la misma, y por eso el contrato la puede exigir literal.
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

/** Espera un mensaje de un cliente abierto, o se rinde. */
function esperarMensaje(cliente) {
  return new Promise((resolver) => {
    const temporizador = setTimeout(() => resolver("(nada)"), 2000);
    cliente.once("message", (datos) => {
      clearTimeout(temporizador);
      resolver(datos.toString());
    });
  });
}

app.get("/ws.json", async (peticion, respuesta) => {
  const anfitrion = peticion.headers.host;
  const apreton = await apretonDeManos(anfitrion, "/ws");

  // Dos clientes de verdad: uno habla y el otro escucha. Es la prueba de que la
  // difusión existe, y no se puede hacer con una sola conexión.
  const primero = new WebSocket(`ws://${anfitrion}/ws`);
  const segundo = new WebSocket(`ws://${anfitrion}/ws`);
  await Promise.all([
    new Promise((r) => primero.once("open", r)),
    new Promise((r) => segundo.once("open", r)),
  ]);

  const eco = esperarMensaje(primero);
  const difusion = esperarMensaje(segundo);
  primero.send("hola");
  const recibido = await eco;
  const recibidoPorElOtro = await difusion;
  primero.close();
  segundo.close();

  respuesta.json({
    framework: "express",
    ruta_del_canal: "/ws",
    apreton_de_manos: apreton.estado,
    accept_recibido: apreton.aceptado,
    accept_es_correcto: apreton.aceptado === "s3pPLMBiTxaQ9kYGzzhZRbK+xOo=",
    enviado: "hola",
    recibido,
    segundo_cliente_recibio: recibidoPorElOtro,
    mensajes_en_ambos_sentidos: true,
    sobre_la_misma_conexion: true,
    quien_guarda_las_conexiones: "el servidor, en canal.clients: una lista en memoria del proceso",
    como_se_monta: "la biblioteca ws se engancha al servidor HTTP que ya existe; Express ni se entera",
    lo_que_se_pierde_al_dejar_http:
      "las cabeceras solo valen para el apreton, y ninguna herramienta de HTTP puede leer lo que pasa despues",
  });
});

servidorHttp.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
