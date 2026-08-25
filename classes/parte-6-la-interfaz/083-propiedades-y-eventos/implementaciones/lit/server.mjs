import "@lit-labs/ssr/lib/install-global-dom-shim.js";

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { html } from "lit";
import { render } from "@lit-labs/ssr";
import { collectResultSync } from "@lit-labs/ssr/lib/render-result.js";

import "./Contador.mjs";
import { alRecibirCambio } from "./Padre.mjs";

const FUENTE = new URL("./Contador.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 083</title></head><body>${contenido}</body></html>`;

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");

  if (url.pathname === "/") {
    const valor = Number(url.searchParams.get("valor") ?? 0);
    const marcado = collectResultSync(
      render(html`<div data-padre="app"><mi-contador .valor=${valor}></mi-contador></div>`),
    );
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(pagina(marcado));
    return;
  }

  if (url.pathname === "/evento") {
    const antes = Number(url.searchParams.get("valor") ?? 0);
    const paso = Number(url.searchParams.get("paso") ?? 1);
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({ antes, paso, despues: alRecibirCambio(antes, paso), quien_decide: "el padre" }),
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
        como_se_declaran: "`static properties`, con puente a atributos de HTML",
        avisos_hacia_arriba: "`CustomEvent` del DOM, despachado por el propio elemento",
        el_hijo_muta_la_propiedad: false,
        hay_mecanismo_de_eventos_aparte: true,
        eventos_declarados: ["cambiar"],
        nota:
          "el canal de subida no lo inventa el framework: `CustomEvent` es del estándar. Burbujea si se lo pides, y necesita `composed: true` para salir del DOM en la sombra",
        el_hijo_sabe_que_pasa_despues: false,
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
