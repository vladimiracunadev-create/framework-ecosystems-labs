import { createServer } from "node:http";

import express from "express";
import { WebSocket, WebSocketServer } from "ws";

/**
 * EL ESTADO DE CONEXIÓN ES LOCAL, Y ESO SE ROMPE CON LA SEGUNDA INSTANCIA.
 *
 * Las clases 107 y 108 guardaron la lista de conexiones abiertas en una variable
 * del proceso. Con un servidor funciona perfectamente. Con dos —que es lo que
 * hay en cuanto se pone un balanceador delante o se despliega sin cortar— la
 * mitad de la gente deja de enterarse de la mitad de las cosas.
 *
 * Y falla de la peor manera posible: **no da ningún error**. Los dos servidores
 * están sanos, las conexiones están abiertas, los mensajes se entregan… a quien
 * está conectado al mismo sitio. En pruebas, con una instancia, no se reproduce
 * nunca.
 *
 * ── CÓMO SE MONTAN AQUÍ LAS DOS INSTANCIAS, Y QUÉ TIENE DE ARTIFICIAL ─────────
 *
 * Este archivo levanta DOS servidores, en dos puertos, con **dos listas de
 * conexiones separadas**. Comparten proceso, y en producción serían dos
 * procesos o dos máquinas: eso es lo único que aquí está simplificado, y no
 * afecta a lo que la clase mide, porque lo que separa a las dos instancias —el
 * estado en memoria de cada una— está separado de verdad.
 *
 * Todo lo demás es real, incluido el reparto: cuando la instancia A avisa a la
 * B, lo hace por HTTP, no tocando su variable.
 */

const PUERTO_A = Number(process.env.PORT ?? 3000);
const PUERTO_B = PUERTO_A + 1;

/** Monta una instancia: su servidor HTTP, su canal y SU PROPIA lista. */
function montarInstancia(nombre, puerto, pares) {
  const app = express();
  const servidor = createServer(app);
  const canal = new WebSocketServer({ server: servidor, path: "/ws" });

  const entregarAquí = (texto) => {
    for (const conexion of canal.clients) {
      if (conexion.readyState === WebSocket.OPEN) {
        conexion.send(JSON.stringify({ texto, entregado_por: nombre }));
      }
    }
  };

  // La ruta que usa el reparto entre instancias. Es una ruta normal, y por eso
  // se ve lo que el reparto es de verdad: **una petición más**.
  app.post("/interno", express.json(), (peticion, respuesta) => {
    entregarAquí(peticion.body.texto);
    respuesta.json({ entregado_por: nombre });
  });

  app.post("/publicar", express.json(), async (peticion, respuesta) => {
    const { texto, bus } = peticion.body;
    entregarAquí(texto);
    // EL REPARTO. Con `bus`, se avisa a las demás instancias; sin él, no.
    //
    // Este reparto por HTTP a cada par es la versión más simple que funciona, y
    // tiene dos límites que hay que saber: crece al cuadrado con el número de
    // instancias, y si un par está caído su gente se pierde el mensaje sin que
    // nadie se entere. Un intermediario de mensajes —Redis, NATS, RabbitMQ—
    // resuelve las dos cosas, y por eso todos los frameworks acaban recomendando
    // uno.
    if (bus) {
      for (const par of pares) {
        await fetch(`${par}/interno`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ texto }),
        });
      }
    }
    respuesta.json({ publicado_en: nombre, con_bus: Boolean(bus) });
  });

  app.get("/", (peticion, respuesta) => {
    respuesta.type("html").send(
      `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Dos instancias</title></head>
<body><h1>Dos instancias</h1>
<p data-instancia="${nombre}" data-canal="ws://127.0.0.1:${puerto}/ws">esta instancia</p>
<p data-pares="${pares.join(",")}">las demas</p>
</body></html>`,
    );
  });

  servidor.listen(puerto, "127.0.0.1");
  return { app, canal };
}

const instanciaB = montarInstancia("B", PUERTO_B, [`http://127.0.0.1:${PUERTO_A}`]);
const instanciaA = montarInstancia("A", PUERTO_A, [`http://127.0.0.1:${PUERTO_B}`]);

const esperar = (ms) => new Promise((seguir) => setTimeout(seguir, ms));

function conectar(url) {
  return new Promise((resolver) => {
    const cliente = new WebSocket(url);
    cliente.recibidos = [];
    cliente.on("message", (datos) => cliente.recibidos.push(JSON.parse(datos.toString())));
    cliente.once("open", () => resolver(cliente));
    cliente.once("error", () => resolver(null));
  });
}

async function publicar(texto, bus) {
  await fetch(`http://127.0.0.1:${PUERTO_A}/publicar`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ texto, bus }),
  });
  await esperar(150);
}

/**
 * LA DEMOSTRACIÓN: EL MISMO MENSAJE, DOS VECES.
 *
 * Alguien conectado a la instancia B. El mensaje se publica siempre en la A.
 * Sin reparto no llega; con reparto, sí. Es el mismo código, la misma conexión y
 * el mismo mensaje: lo único que cambia es si las instancias se hablan.
 */
instanciaA.app.get("/instancias.json", async (peticion, respuesta) => {
  const enB = await conectar(`ws://127.0.0.1:${PUERTO_B}/ws`);

  await publicar("hola sin bus", false);
  const sinBus = enB.recibidos.length;

  await publicar("hola a todos", true);
  const conBus = enB.recibidos.length;
  const ultimo = enB.recibidos[enB.recibidos.length - 1] ?? {};
  enB.terminate();

  respuesta.json({
    framework: "express",
    instancias: 2,
    el_estado_de_conexion_es_local: true,
    sin_bus_recibio_el_otro: sinBus > 0,
    con_bus_recibio_el_otro: conBus > sinBus,
    mismo_mensaje: ultimo.texto ?? "",
    entregado_por: ultimo.entregado_por ?? "",
    como_se_difunde: "una peticion HTTP de la instancia que publica a cada una de las demas",
    donde_esta_la_lista: "en canal.clients de cada proceso: una variable, no un almacen compartido",
    que_haria_falta_en_produccion:
      "un intermediario de mensajes: el reparto directo crece al cuadrado y pierde lo de un par caido",
  });
});
