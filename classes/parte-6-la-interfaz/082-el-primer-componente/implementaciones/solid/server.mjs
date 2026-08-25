import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { renderToString, ssr } from "solid-js/web";

import { Saludo } from "./Saludo.mjs";

/**
 * SOLID EN EL SERVIDOR.
 *
 * `renderToString` ejecuta el componente dentro del ámbito reactivo de Solid y
 * devuelve el texto. En el servidor la reactividad no se usa —nada va a
 * cambiar— pero el ámbito hace falta igual, porque el componente lee sus
 * propiedades como funciones.
 *
 * Ese detalle es Solid entero: las propiedades no son valores, son accesos. Por
 * eso `props.texto` se lee dentro de una función y no se desestructura al
 * entrar.
 */

const FUENTE = new URL("./Saludo.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 082</title></head><body>${contenido}</body></html>`;

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const html = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(cuerpo);
  };

  if (url.pathname === "/") {
    html(pagina(renderToString(() => Saludo({}))));
    return;
  }

  if (url.pathname === "/componente") {
    const texto = url.searchParams.get("texto");
    html(pagina(renderToString(() => Saludo(texto === null ? {} : { texto }))));
    return;
  }

  if (url.pathname === "/dos") {
    const a = url.searchParams.get("a") ?? "uno";
    const b = url.searchParams.get("b") ?? "dos";
    html(
      pagina(
        renderToString(() =>
          ssr(["<div>", "", "</div>"], Saludo({ texto: a }), Saludo({ texto: b })),
        ),
      ),
    );
    return;
  }

  if (url.pathname === "/componente.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({
        leido_del_archivo: true,
        archivo: "Saludo.mjs",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        es_un: "función que se ejecuta una sola vez y devuelve marcado",
        se_compila: true,
        nota_de_compilacion:
          "en un proyecto real se escribiría en JSX y el compilador produciría estas mismas plantillas con huecos; aquí están escritas a mano para que se vean",
        renderiza_en: "servidor y navegador",
        escapa_por_omision: true,
        nota_de_escapado:
          "el escapado es una llamada explícita —`escape(...)`— en el código que el compilador genera, no una decisión del tiempo de ejecución",
        como_recibe_datos: "un objeto de propiedades que se LEE como funciones, no se desestructura",
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
