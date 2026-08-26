import { createServer } from "node:http";

import express from "express";
import { Server } from "socket.io";
import { io as cliente } from "socket.io-client";

/**
 * SOCKET.IO ESTÁ EN ESTA CLASE PORQUE ES EL ÚNICO DEL ELENCO QUE TIENE UNA
 * RESPUESTA DE FÁBRICA, Y CONVIENE VERLA EN SU SITIO.
 *
 * Se llama adaptador. Se le pone uno —el de Redis es el habitual— y a partir de
 * ahí `io.emit` llega a todos los conectados a todas las instancias, sin cambiar
 * una línea del código de la aplicación. Es exactamente el reparto que las otras
 * tres implementaciones escriben a mano, resuelto por debajo.
 *
 * No se usa aquí por un motivo declarado: **haría falta un Redis**, y este
 * laboratorio no monta infraestructura para una clase. Lo que se hace en su
 * lugar es el reparto explícito, que es lo que el adaptador hace por dentro, y
 * así se ve. Lo que hay que llevarse no es la técnica: es que **la pregunta
 * existe y tiene una respuesta con nombre**, y que ignorarla es el fallo de esta
 * clase.
 *
 * ── LAS DOS INSTANCIAS ────────────────────────────────────────────────────────
 *
 * Dos servidores, dos puertos, dos registros de conexiones separados. Comparten
 * proceso, y en producción serían dos máquinas: es lo único simplificado, y no
 * afecta a lo que se mide porque lo que las separa —su estado— está separado de
 * verdad.
 */

const PUERTO_A = Number(process.env.PORT ?? 3000);
const PUERTO_B = PUERTO_A + 1;

function montarInstancia(nombre, puerto, pares) {
  const app = express();
  const servidor = createServer(app);
  const canal = new Server(servidor, { transports: ["websocket"] });

  const entregarAquí = (texto) => canal.emit("mensaje", { texto, entregado_por: nombre });

  app.post("/interno", express.json(), (peticion, respuesta) => {
    entregarAquí(peticion.body.texto);
    respuesta.json({ entregado_por: nombre });
  });

  app.post("/publicar", express.json(), async (peticion, respuesta) => {
    const { texto, bus } = peticion.body;
    entregarAquí(texto);
    // Con un adaptador puesto, esta llamada NO existiría: `io.emit` de arriba ya
    // habría llegado a las dos instancias. Verla escrita es ver lo que el
    // adaptador hace.
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
<p data-instancia="${nombre}" data-canal="ws://127.0.0.1:${puerto}/socket.io/">esta instancia</p>
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
    const conexion = cliente(url, { transports: ["websocket"], reconnection: false });
    conexion.recibidos = [];
    conexion.on("mensaje", (m) => conexion.recibidos.push(m));
    conexion.once("connect", () => resolver(conexion));
    setTimeout(() => resolver(conexion), 1500);
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

instanciaA.app.get("/instancias.json", async (peticion, respuesta) => {
  const enB = await conectar(`http://127.0.0.1:${PUERTO_B}`);

  await publicar("hola sin bus", false);
  const sinBus = enB.recibidos.length;

  await publicar("hola a todos", true);
  const conBus = enB.recibidos.length;
  const ultimo = enB.recibidos[enB.recibidos.length - 1] ?? {};
  enB.close();

  respuesta.json({
    framework: "socketio",
    instancias: 2,
    el_estado_de_conexion_es_local: true,
    sin_bus_recibio_el_otro: sinBus > 0,
    con_bus_recibio_el_otro: conBus > sinBus,
    mismo_mensaje: ultimo.texto ?? "",
    entregado_por: ultimo.entregado_por ?? "",
    como_se_difunde: "aqui a mano; de fabrica se resuelve con un adaptador, y el de Redis es el habitual",
    donde_esta_la_lista: "en el registro de conexiones de cada proceso, salvo que un adaptador lo saque fuera",
    que_haria_falta_en_produccion:
      "poner el adaptador: es una linea de configuracion y una pieza de infraestructura",
  });
});
