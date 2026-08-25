import { createServer } from "node:http";
import { readFileSync } from "node:fs";

import { saludo } from "./saludo.mjs";

/**
 * ALPINE.JS: EL ÚNICO DE LOS OCHO QUE NO RENDERIZA EN EL SERVIDOR.
 *
 * No es una limitación de esta implementación: es el modelo. Alpine no tiene
 * renderizador — se engancha a marcado que ya existe y le añade comportamiento.
 * Su lema es literalmente ese: jQuery para la era moderna, pero declarativo.
 *
 * Así que lo que este servidor manda es HTML con `x-data` y `x-text`. En el
 * navegador, Alpine lee esos atributos y toma el control del elemento; sin
 * JavaScript, el marcado ya trae el texto puesto y la página se ve igual.
 */

const FUENTE = new URL("./saludo.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 082</title>` +
  `<script defer src="https://unpkg.com/alpinejs@3.14.9/dist/cdn.min.js"></script></head>` +
  `<body>${contenido}</body></html>`;

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const html = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(cuerpo);
  };

  if (url.pathname === "/") {
    html(pagina(saludo()));
    return;
  }

  if (url.pathname === "/componente") {
    html(pagina(saludo(url.searchParams.get("texto") ?? undefined)));
    return;
  }

  if (url.pathname === "/dos") {
    // DOS `x-data` HERMANOS SON DOS COMPONENTES.
    //
    // Cada uno tiene su propio ámbito, y ninguno ve el estado del otro. Es la
    // instanciación de Alpine: no hay `new`, hay un atributo repetido.
    const a = url.searchParams.get("a") ?? "uno";
    const b = url.searchParams.get("b") ?? "dos";
    html(pagina(`<div>${saludo(a)}${saludo(b)}</div>`));
    return;
  }

  if (url.pathname === "/componente.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({
        leido_del_archivo: true,
        archivo: "saludo.mjs",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        es_un: "trozo de marcado con `x-data`: el componente es el elemento",
        se_compila: false,
        nota_de_compilacion: "no hay compilador ni empaquetador: es una etiqueta <script> en la página",
        renderiza_en: "solo navegador",
        escapa_por_omision: false,
        nota_de_escapado:
          "el texto va a DOS contextos —un atributo y el contenido— y cada uno se escapa distinto. Quien escribe la plantilla decide, y ahí es donde se cuela la clase 073",
        como_recibe_datos: "el objeto de `x-data`, escrito en el atributo",
        que_ve_el_contrato:
          "el marcado antes de que Alpine lo despierte; el texto está puesto por mejora progresiva",
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
