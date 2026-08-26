import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { auditar } from "./auditor.mjs";
import { ControlAccesible, ControlInaccesible } from "./Control.mjs";

const FUENTE = new URL("./Control.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 091</title></head><body>${contenido}</body></html>`;

const dibujar = (version, abierto) =>
  renderToStaticMarkup(
    h(version === "accesible" ? ControlAccesible : ControlInaccesible, { abierto }),
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
    // Se audita EL MARCADO QUE SALE, no el código que lo produce. Es la única
    // forma honesta: lo que llega al navegador es lo que importa.
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
          "avisa si escribes `class` en lugar de `className`",
          "hay un verificador de estilo dedicado: eslint-plugin-jsx-a11y",
        ],
        que_sigue_siendo_tuyo: [
          "elegir <button> en lugar de <div>",
          "asociar la etiqueta con el campo",
          "exponer el estado con aria-*",
          "el orden del foco al abrir y cerrar",
        ],
        trampa_del_ecosistema:
          "`htmlFor` en lugar de `for`, porque `for` es palabra reservada. Es de las pocas veces que React renombra un atributo del HTML, y por eso se olvida",
        herramienta_recomendada: "eslint-plugin-jsx-a11y en el editor, axe-core en las pruebas",
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
