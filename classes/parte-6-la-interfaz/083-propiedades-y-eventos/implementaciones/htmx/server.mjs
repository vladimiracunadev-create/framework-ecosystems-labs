import { createServer } from "node:http";
import { readFileSync } from "node:fs";

import { contador } from "./contador.mjs";
import { alRecibirCambio } from "./padre.mjs";

const FUENTE = new URL("./contador.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 083</title>` +
  `<script src="https://unpkg.com/htmx.org@2.0.4"></script></head>` +
  `<body><div data-padre="app">${contenido}</div></body></html>`;

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");

  if (url.pathname === "/") {
    const valor = Number(url.searchParams.get("valor") ?? 0);
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(pagina(contador(valor)));
    return;
  }

  if (url.pathname === "/evento") {
    // LA MISMA RUTA SIRVE PARA LAS DOS COSAS.
    //
    // El contrato la pide como JSON para comprobar el manejador; htmx la pide
    // como HTML para pegar el fragmento nuevo. Es la bifurcación de la clase
    // 081, aplicada a un componente.
    const antes = Number(url.searchParams.get("valor") ?? 0);
    const paso = Number(url.searchParams.get("paso") ?? 1);
    const despues = alRecibirCambio(antes, paso);

    if ((peticion.headers["hx-request"] ?? "") === "true") {
      respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      respuesta.end(contador(despues));
      return;
    }

    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify({ antes, paso, despues, quien_decide: "el padre" }));
    return;
  }

  if (url.pathname === "/flujo.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({
        leido_del_archivo: true,
        archivo: "contador.mjs",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        datos_hacia_abajo: "propiedades",
        como_se_declaran: "argumentos de la función del servidor, escritos en el fragmento",
        avisos_hacia_arriba: "una PETICIÓN: `hx-get` con el paso en la dirección",
        el_hijo_muta_la_propiedad: false,
        hay_mecanismo_de_eventos_aparte: false,
        nota:
          "no hay propiedades ni eventos: hay una ida y vuelta. A cambio, el estado vive en un solo sitio y no hay dos verdades que sincronizar",
        el_hijo_sabe_que_pasa_despues: false,
        donde_vive_el_estado: "el servidor",
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
