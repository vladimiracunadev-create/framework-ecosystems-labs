import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { renderToString } from "solid-js/web";

import { auditar } from "./auditor.mjs";
import { ControlAccesible, ControlInaccesible } from "./Control.mjs";

const FUENTE = new URL("./Control.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 091</title></head><body>${contenido}</body></html>`;

const dibujar = (version, abierto) =>
  renderToString(() =>
    version === "accesible" ? ControlAccesible({ abierto }) : ControlInaccesible({ abierto }),
  );

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const abierto = url.searchParams.get("abierto") === "si";

  if (url.pathname === "/accesible" || url.pathname === "/inaccesible") {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(pagina(dibujar(url.pathname.slice(1), abierto)));
    return;
  }

  if (url.pathname === "/auditar") {
    const version = url.searchParams.get("version") ?? "accesible";
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify({ version, ...auditar(dibujar(version, abierto)) }));
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
          "al actualizar no reemplaza elementos, así que el foco no se pierde solo",
        ],
        que_sigue_siendo_tuyo: [
          "elegir <button> en lugar de <div>",
          "asociar la etiqueta con el campo",
          "exponer el estado con aria-*",
          "el orden del foco al abrir y cerrar",
        ],
        ventaja_del_modelo:
          "como cambia atributos en lugar de reemplazar nodos, el elemento enfocado sigue enfocado: en un modelo de árbol virtual, reemplazar el elemento con foco lo saca del foco, y ese fallo es sutil y frecuente",
        herramienta_recomendada: "eslint-plugin-solid, con reglas heredadas de jsx-a11y",
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
