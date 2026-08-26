import express from "express";

/**
 * EVENTOS ENVIADOS POR EL SERVIDOR: HTTP NORMAL, EN UNA SOLA DIRECCIÓN.
 *
 * La clase 105 preguntaba cada cierto tiempo. Aquí se deja de preguntar: la
 * petición se queda abierta y el servidor escribe cuando tiene algo. No hay
 * protocolo nuevo, ni negociación, ni biblioteca en el cliente: es una respuesta
 * HTTP que no termina, con un formato de texto de cuatro reglas.
 *
 * Y trae de serie lo que en la clase 108 costará escribir a mano con WebSocket:
 * **el navegador reconecta solo, y dice por dónde iba**. Si cada evento lleva un
 * `id:`, al reconectar manda `Last-Event-ID` con el último que recibió, y el
 * servidor puede continuar desde ahí. Eso está en el estándar, no en una
 * biblioteca.
 *
 * Lo que no puede hacer: mandar nada hacia el servidor. Para eso está la 107.
 */

const app = express();

/** Los eventos que hay que entregar. En un sistema real vendrían de una cola o
 *  de un canal de la base de datos; lo que importa aquí es que cada uno tiene un
 *  número de orden, y que ese número es lo que permite reanudar. */
const PEDIDOS = [
  { id: 1, cliente: "Ada", importe: 32 },
  { id: 2, cliente: "Grace", importe: 18 },
  { id: 3, cliente: "Alan", importe: 47 },
];

/**
 * EL FORMATO, QUE SON CUATRO REGLAS Y NINGUNA MÁS.
 *
 * Cada evento es un bloque de líneas `campo: valor` terminado en **una línea en
 * blanco**. Esa línea en blanco es lo que lo separa del siguiente, y olvidarla es
 * el error número uno: el navegador se queda esperando y no entrega nada.
 *
 * `id:` permite reanudar, `event:` da un nombre al que suscribirse, `data:` es el
 * contenido, y `retry:` le dice al navegador cuánto esperar antes de reconectar.
 */
function comoEvento(pedido) {
  return `id: ${pedido.id}\nevent: pedido\ndata: ${JSON.stringify(pedido)}\n\n`;
}

app.get("/eventos", (peticion, respuesta) => {
  // Las tres cabeceras que hacen que esto funcione de verdad:
  //
  //   - el tipo, que es lo que activa el modo de flujo en el navegador;
  //   - `no-cache`, porque un flujo cacheado no es un flujo;
  //   - `Connection: keep-alive`, para que ningún intermediario lo corte.
  //
  // Falta una cuarta que no se ve aquí y que hace falta detrás de un proxy
  // inverso: `X-Accel-Buffering: no`. Sin ella, nginx guarda la respuesta en un
  // buffer y no entrega nada hasta que se llena. Es el fallo clásico de esta
  // tecnologia y solo aparece en produccion.
  respuesta.set({
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  // Cuánto debe esperar el navegador antes de reconectar si esto se corta. Se
  // manda una vez y vale para toda la sesión.
  respuesta.write("retry: 2000\n\n");

  // LA REANUDACIÓN, QUE ES LA MITAD DE LA CLASE.
  //
  // El navegador manda `Last-Event-ID` solo, sin que nadie lo programe, con el
  // identificador del último evento que recibió. Lo único que hay que hacer es
  // hacerle caso.
  const ultimo = Number(peticion.headers["last-event-id"] ?? 0);
  for (const pedido of PEDIDOS.filter((p) => p.id > ultimo)) {
    respuesta.write(comoEvento(pedido));
  }

  // Este flujo se cierra a propósito cuando se acaban los eventos, para que el
  // contrato pueda leerlo entero. Un flujo real se queda abierto y manda un
  // comentario —`: latido\n\n`— cada treinta segundos para que ningún
  // intermediario lo dé por muerto.
  respuesta.end();
});

app.get("/sse.json", async (peticion, respuesta) => {
  const origen = `http://${peticion.headers.host}`;
  const flujo = await fetch(`${origen}/eventos`);
  const texto = await flujo.text();
  const eventos = (texto.match(/^event: /gm) ?? []).length;

  respuesta.json({
    framework: "express",
    tipo_de_contenido: flujo.headers.get("content-type"),
    eventos_recibidos: eventos,
    bytes_del_flujo: Buffer.byteLength(texto, "utf8"),
    es_unidireccional: true,
    reconecta_solo_el_navegador: true,
    cabecera_de_reanudacion: "Last-Event-ID",
    como_se_declara: "escribiendo el texto a mano en la respuesta, con res.write",
    que_cuesta: "una conexion abierta por cliente, y un proceso que no puede cerrarla",
    el_fallo_clasico: "un proxy inverso que guarda la respuesta en un buffer y no entrega nada",
  });
});

app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
