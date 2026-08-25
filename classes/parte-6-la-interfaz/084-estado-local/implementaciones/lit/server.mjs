import "@lit-labs/ssr/lib/install-global-dom-shim.js";

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { html } from "lit";
import { render } from "@lit-labs/ssr";
import { collectResultSync } from "@lit-labs/ssr/lib/render-result.js";

import "./Contador.mjs";
import { siguiente } from "./reglas.mjs";

const FUENTE = new URL("./Contador.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 084</title></head><body>${contenido}</body></html>`;

const dibujar = (plantilla) => collectResultSync(render(plantilla));

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const salida = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(cuerpo);
  };
  const json = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify(cuerpo));
  };

  if (url.pathname === "/") {
    const a = Number(url.searchParams.get("a") ?? 0);
    const b = Number(url.searchParams.get("b") ?? 5);
    salida(
      pagina(
        dibujar(
          html`<div data-padre="app"><mi-contador .id=${"a"} .valor=${a}></mi-contador><mi-contador
              .id=${"b"}
              .valor=${b}
            ></mi-contador></div>`,
        ),
      ),
    );
    return;
  }

  if (url.pathname === "/sin-propiedades") {
    salida(pagina(dibujar(html`<mi-contador></mi-contador>`)));
    return;
  }

  if (url.pathname === "/transicion") {
    const antes = Number(url.searchParams.get("desde") ?? 0);
    const paso = Number(url.searchParams.get("paso") ?? 1);
    json({ antes, paso, despues: siguiente(antes, paso), regla: "no baja de cero" });
    return;
  }

  if (url.pathname === "/estado.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    json({
      leido_del_archivo: true,
      archivo: "Contador.mjs",
      lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_declara: "un campo de la clase declarado con `state: true`",
      el_estado_es_una_propiedad: false,
      cada_instancia_tiene_el_suyo: true,
      como_se_identifica_la_instancia: "es un objeto del DOM con identidad propia",
      quien_dispara_el_redibujado: "el propio elemento, al escribir en el campo",
      nota:
        "`state: true` quita el puente con el atributo de HTML: una propiedad normal se puede poner desde fuera, una de estado no. Y la instancia es un objeto de verdad, alcanzable con querySelector",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
