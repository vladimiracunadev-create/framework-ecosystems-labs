import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";

import { auditar } from "./auditor.mjs";
import { ControlAccesible, ControlInaccesible } from "./Control.mjs";

const FUENTE = new URL("./Control.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 091</title></head><body>${contenido}</body></html>`;

const dibujar = (version, abierto) =>
  renderToString(
    createSSRApp({
      render: () =>
        h(version === "accesible" ? ControlAccesible : ControlInaccesible, { abierto }),
    }),
  );

createServer(async (peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const abierto = url.searchParams.get("abierto") === "si";

  if (url.pathname === "/accesible" || url.pathname === "/inaccesible") {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(pagina(await dibujar(url.pathname.slice(1), abierto)));
    return;
  }

  if (url.pathname === "/auditar") {
    const version = url.searchParams.get("version") ?? "accesible";
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify({ version, ...auditar(await dibujar(version, abierto)) }));
    return;
  }

  if (url.pathname === "/accesibilidad.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({
        leido_del_archivo: true,
        archivo: "Control.mjs",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        el_framework_no_te_hace_accesible: true,
        que_pone_el_framework: [
          "los atributos se escriben como en HTML: `for` es `for`, `class` es `class`",
        ],
        que_sigue_siendo_tuyo: [
          "elegir <button> en lugar de <div>",
          "asociar la etiqueta con el campo",
          "exponer el estado con aria-*",
          "elegir entre v-if y v-show sabiendo qué ve un lector",
        ],
        trampa_del_ecosistema:
          "`v-if` quita el elemento del árbol y `v-show` solo lo oculta con CSS: para un lector de pantalla no es lo mismo, salvo que lleve `hidden` o `aria-hidden`",
        herramienta_recomendada: "eslint-plugin-vuejs-accessibility, de la comunidad",
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
