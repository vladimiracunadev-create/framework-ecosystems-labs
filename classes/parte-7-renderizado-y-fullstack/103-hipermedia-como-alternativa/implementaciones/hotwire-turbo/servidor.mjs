import { createServer } from "node:http";
import { readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";

/**
 * HIPERMEDIA CON TURBO, SOBRE EL MISMO SERVIDOR DE NODE SIN FRAMEWORK.
 *
 * Turbo viene del mundo de Rails y se nota en su forma de pensar: el servidor no
 * devuelve HTML suelto, devuelve **instrucciones con HTML dentro**. Un
 * `<turbo-stream action="append" target="lista">` dice qué hacer y dónde, y el
 * marcado va en un `<template>` dentro.
 *
 * Esa es la diferencia de fondo con htmx, y no es de sintaxis: **cambia quién
 * decide dónde va el fragmento**. En htmx lo decide el marcado del cliente, con
 * `hx-target`. Aquí lo decide el servidor, en la respuesta. Con una pantalla da
 * igual; con una escritura que tiene que tocar tres sitios a la vez —la lista, el
 * contador y el aviso—, Turbo manda tres instrucciones en una respuesta y htmx
 * necesita que el cliente las haya previsto.
 */

const TAREAS = ["comprar pan", "regar las plantas", "llamar al fontanero"];

const BIBLIOTECA = path.join(
  process.cwd(),
  "node_modules",
  "@hotwired",
  "turbo",
  "dist",
  "turbo.es2017-umd.js",
);
const CODIGO_DE_LA_BIBLIOTECA = readFileSync(BIBLIOTECA);

const escapar = (texto) =>
  String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const comoLista = (tareas) => tareas.map((t) => `<li>${escapar(t)}</li>`).join("");

function documento() {
  return `<!DOCTYPE html>
<html lang="es">
  <head><meta charset="utf-8" /><title>Tareas — Turbo</title>
    <script src="/biblioteca.js"></script>
  </head>
  <body>
    <h1>Tareas</h1>
    <ul id="lista" data-lista="tareas">${comoLista(TAREAS)}</ul>
    <!--
      NO HAY ATRIBUTOS QUE PONER.

      Turbo intercepta TODOS los formularios y TODOS los enlaces de la pagina en
      cuanto se carga. No hay nada que declarar en el marcado: el formulario es
      un formulario normal, y lo que decide el comportamiento es lo que el
      servidor conteste.

      Es la postura opuesta a la de htmx y tiene la misma consecuencia en las dos
      direcciones: aqui no se puede olvidar un atributo, y tampoco se puede
      excluir un formulario sin decirlo explicitamente.
    -->
    <form method="post" action="/tareas">
      <input type="text" name="texto" />
      <button type="submit">Anadir</button>
    </form>
  </body>
</html>`;
}

async function cuerpoDe(peticion) {
  const trozos = [];
  for await (const trozo of peticion) trozos.push(trozo);
  return Buffer.concat(trozos).toString("utf8");
}

const servidor = createServer(async (peticion, respuesta) => {
  const url = new URL(peticion.url, `http://${peticion.headers.host}`);

  if (peticion.method === "GET" && url.pathname === "/biblioteca.js") {
    respuesta.writeHead(200, { "content-type": "text/javascript; charset=utf-8" });
    return respuesta.end(CODIGO_DE_LA_BIBLIOTECA);
  }

  if (peticion.method === "GET" && url.pathname === "/hipermedia.json") {
    const bytes = statSync(BIBLIOTECA).size;
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    return respuesta.end(
      JSON.stringify({
        framework: "hotwire-turbo",
        biblioteca: "@hotwired/turbo",
        bytes_de_la_biblioteca: bytes,
        bytes_comprimidos: gzipSync(CODIGO_DE_LA_BIBLIOTECA).length,
        el_servidor_devuelve_html: true,
        estado_duplicado_en_el_cliente: false,
        funciona_sin_javascript: true,
        una_ida_y_vuelta_por_interaccion: true,
        cabecera_que_lo_identifica: "Accept: text/vnd.turbo-stream.html",
        quien_decide_donde_va_el_fragmento:
          "el servidor, en la propia respuesta: cada turbo-stream lleva su accion y su destino",
        que_devuelve_el_servidor: "instrucciones con HTML dentro: <turbo-stream action target>",
        como_se_programa: "sin declarar nada: Turbo intercepta todos los formularios y enlaces",
      }),
    );
  }

  if (peticion.method === "POST" && url.pathname === "/tareas") {
    const datos = new URLSearchParams(await cuerpoDe(peticion));
    const texto = (datos.get("texto") ?? "").trim();
    if (texto) TAREAS.push(texto);

    // LA MISMA RUTA, DOS RESPUESTAS — igual que en htmx, con otra cabecera y
    // otro formato.
    //
    // Turbo anuncia lo que sabe leer en `Accept`, que es donde el estandar dice
    // que se anuncia. htmx se inventa una cabecera propia. Las dos funcionan; la
    // de Turbo es la que un intermediario o una cache entienden sin que nadie
    // se lo explique.
    const acepta = peticion.headers.accept ?? "";
    if (acepta.includes("text/vnd.turbo-stream.html")) {
      respuesta.writeHead(200, { "content-type": "text/vnd.turbo-stream.html; charset=utf-8" });
      return respuesta.end(
        texto
          ? `<turbo-stream action="append" target="lista"><template><li>${escapar(texto)}</li></template></turbo-stream>`
          : "",
      );
    }
    respuesta.writeHead(303, { location: "/tareas" });
    return respuesta.end();
  }

  if (peticion.method === "GET" && (url.pathname === "/" || url.pathname === "/tareas")) {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    return respuesta.end(documento());
  }

  respuesta.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  respuesta.end("no existe");
});

servidor.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
