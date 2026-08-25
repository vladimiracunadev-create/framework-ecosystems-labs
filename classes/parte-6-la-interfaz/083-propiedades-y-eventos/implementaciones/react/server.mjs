import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Padre, alRecibirCambio } from "./Padre.mjs";

const FUENTE = new URL("./Contador.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 083</title></head><body>${contenido}</body></html>`;

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");

  if (url.pathname === "/") {
    const valor = Number(url.searchParams.get("valor") ?? 0);
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(pagina(renderToStaticMarkup(h(Padre, { valor }))));
    return;
  }

  if (url.pathname === "/evento") {
    /**
     * EL AVISO, EJECUTADO DE VERDAD.
     *
     * No se simula el clic —eso necesita un navegador y es la clase 128—: se
     * llama al MANEJADOR REAL del padre, el que está en `Padre.mjs`, con el
     * valor actual y el paso que el hijo emitiría.
     *
     * Lo que se comprueba es la mitad que se diseña mal: quién decide el estado
     * nuevo. Y la respuesta, en las ocho tecnologías, es el padre.
     */
    const antes = Number(url.searchParams.get("valor") ?? 0);
    const paso = Number(url.searchParams.get("paso") ?? 1);
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({
        antes,
        paso,
        despues: alRecibirCambio(antes, paso),
        quien_decide: "el padre",
      }),
    );
    return;
  }

  if (url.pathname === "/flujo.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({
        leido_del_archivo: true,
        archivo: "Contador.mjs",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        datos_hacia_abajo: "propiedades",
        avisos_hacia_arriba: "una función que baja como una propiedad más",
        el_hijo_muta_la_propiedad: false,
        hay_mecanismo_de_eventos_aparte: false,
        nota:
          "en React no existe un canal de eventos: `alCambiar` es una propiedad como `valor`, solo que resulta ser invocable",
        el_hijo_sabe_que_pasa_despues: false,
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
