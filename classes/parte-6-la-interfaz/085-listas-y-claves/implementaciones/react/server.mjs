import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { frutas, REPETIDAS } from "./datos.mjs";
import { Lista, ListaSinClave } from "./Lista.mjs";

const FUENTE = new URL("./Lista.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 085</title></head><body>${contenido}</body></html>`;

/**
 * CAPTURAR LO QUE EL FRAMEWORK DICE MIENTRAS RENDERIZA.
 *
 * Los avisos de clave no son excepciones: se escriben en la consola y se
 * pierden. Interceptarla durante el render es la única forma de comprobar por
 * contrato si el framework protesta — y esa protesta es lo que separa un fallo
 * que se detecta en desarrollo de uno que llega a producción.
 */
function renderizarCapturando(elemento) {
  const avisos = [];
  const originalError = console.error;
  const originalWarn = console.warn;
  console.error = (...args) => avisos.push(args.map(String).join(" "));
  console.warn = (...args) => avisos.push(args.map(String).join(" "));
  try {
    const html = renderToStaticMarkup(elemento);
    return { html, avisos };
  } finally {
    console.error = originalError;
    console.warn = originalWarn;
  }
}

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const html = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(cuerpo);
  };
  const json = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify(cuerpo));
  };

  if (url.pathname === "/") {
    const elementos = frutas({
      invertido: url.searchParams.get("orden") === "invertido",
      vacia: url.searchParams.get("vacia") === "si",
    });
    html(pagina(renderToStaticMarkup(h(Lista, { elementos }))));
    return;
  }

  if (url.pathname === "/claves-repetidas") {
    const { avisos } = renderizarCapturando(h(Lista, { elementos: REPETIDAS }));
    json({
      respondida: true,
      claves: REPETIDAS.map((f) => f.id),
      el_framework_avisa: avisos.length > 0,
      avisos,
      que_pasa_si_no_se_arregla:
        "React trata a los dos como el mismo elemento: el segundo desaparece del árbol reconciliado y su estado local se lo queda el primero",
    });
    return;
  }

  if (url.pathname === "/sin-clave") {
    const { avisos } = renderizarCapturando(h(ListaSinClave, { elementos: frutas() }));
    json({
      respondida: true,
      se_puede_omitir: true,
      el_framework_avisa: avisos.length > 0,
      avisos,
      nota:
        "se puede escribir y funciona; el aviso solo aparece en la consola, así que en un servidor sin nadie mirando pasa desapercibido",
    });
    return;
  }

  if (url.pathname === "/lista.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    json({
      leido_del_archivo: true,
      archivo: "Lista.mjs",
      lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_escribe: "elementos.map(...) con `key` en cada elemento",
      la_clave_es_obligatoria: false,
      la_clave_debe_ser_estable: true,
      la_clave_llega_al_html: false,
      nota:
        "`key` no aparece en el HTML: es una instrucción para el algoritmo de reconciliación, no un atributo. Por eso no se encuentra al inspeccionar el DOM",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
