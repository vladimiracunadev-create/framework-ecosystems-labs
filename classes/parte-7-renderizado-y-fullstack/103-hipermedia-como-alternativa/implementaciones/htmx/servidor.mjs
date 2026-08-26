import { createServer } from "node:http";
import { readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";

/**
 * HIPERMEDIA CON HTMX, SOBRE UN SERVIDOR DE NODE SIN FRAMEWORK.
 *
 * Que no haya framework de servidor es parte del argumento: en este modelo el
 * servidor no tiene que saber nada especial. Devuelve HTML. Lo que cambia
 * respecto a la parte 6 entera es **cuánto** HTML devuelve: un documento la
 * primera vez, un trozo las siguientes.
 *
 * Y de ahí sale lo que esta clase quiere enseñar: no hay estado de la interfaz
 * en el navegador. No hay una lista de tareas en memoria del cliente que haya
 * que mantener sincronizada con la del servidor, porque solo hay una lista y
 * está en el servidor. El problema de la clase 089 —estado del servidor en el
 * cliente— aquí no existe. No se resuelve mejor: no llega a plantearse.
 */

const TAREAS = ["comprar pan", "regar las plantas", "llamar al fontanero"];

const BIBLIOTECA = path.join(process.cwd(), "node_modules", "htmx.org", "dist", "htmx.min.js");
const CODIGO_DE_LA_BIBLIOTECA = readFileSync(BIBLIOTECA);

const escapar = (texto) =>
  String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const comoLista = (tareas) => tareas.map((t) => `<li>${escapar(t)}</li>`).join("");

function documento() {
  return `<!DOCTYPE html>
<html lang="es">
  <head><meta charset="utf-8" /><title>Tareas — htmx</title>
    <script src="/biblioteca.js"></script>
  </head>
  <body>
    <h1>Tareas</h1>
    <ul id="lista" data-lista="tareas">${comoLista(TAREAS)}</ul>
    <!--
      LOS ATRIBUTOS SON EL PROGRAMA.

      \`hx-post\` dice a dónde; \`hx-target\` dice dónde poner lo que vuelva;
      \`hx-swap\` dice cómo. Tres atributos y ni una línea de JavaScript propio.

      Fíjate en que sigue siendo un \`<form method="post">\` de verdad: si htmx no
      llega a cargarse, el navegador lo envía él solo y el servidor responde con
      una redirección. Es la mejora progresiva de la clase 081, y aquí no cuesta
      nada porque el camino sin JavaScript es el que ya estaba.
    -->
    <form method="post" action="/tareas" hx-post="/tareas" hx-target="#lista" hx-swap="beforeend">
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
        framework: "htmx",
        biblioteca: "htmx.org",
        bytes_de_la_biblioteca: bytes,
        bytes_comprimidos: gzipSync(CODIGO_DE_LA_BIBLIOTECA).length,
        el_servidor_devuelve_html: true,
        estado_duplicado_en_el_cliente: false,
        funciona_sin_javascript: true,
        una_ida_y_vuelta_por_interaccion: true,
        cabecera_que_lo_identifica: "HX-Request",
        quien_decide_donde_va_el_fragmento:
          "el cliente, con hx-target y hx-swap en el elemento que dispara la peticion",
        que_devuelve_el_servidor: "HTML desnudo: los elementos nuevos y nada mas",
        como_se_programa: "atributos en el marcado, sin escribir JavaScript",
      }),
    );
  }

  if (peticion.method === "POST" && url.pathname === "/tareas") {
    const datos = new URLSearchParams(await cuerpoDe(peticion));
    const texto = (datos.get("texto") ?? "").trim();
    if (texto) TAREAS.push(texto);

    // LA MISMA RUTA, DOS RESPUESTAS.
    //
    // Si quien pide es htmx —lo dice con una cabecera— se le manda el trozo que
    // le falta. Si es un navegador sin JavaScript, se le manda a la pagina otra
    // vez con el patron de la clase 080.
    //
    // No son dos implementaciones: es la misma escritura con dos formas de
    // contestar, y esa es la propuesta entera de la hipermedia.
    if (peticion.headers["hx-request"] === "true") {
      respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      return respuesta.end(texto ? `<li>${escapar(texto)}</li>` : "");
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
