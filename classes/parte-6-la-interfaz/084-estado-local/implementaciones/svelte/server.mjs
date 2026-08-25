import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";

import { siguiente } from "./reglas.mjs";

const FUENTE = new URL("./Contador.svelte", import.meta.url);
const fuente = readFileSync(FUENTE, "utf8");

// El compilado se escribe AL LADO del original, no en un subdirectorio.
//
// El componente importa `./reglas.mjs`, y esa ruta es relativa al archivo: desde
// `compilados/` no resolvería. Es el mismo motivo por el que las herramientas de
// construcción reescriben las importaciones al mover archivos — aquí se evita el
// problema dejándolo donde estaba.
const { js } = compile(fuente, { generate: "server", name: "Contador" });
const destino = new URL("./Contador.compilada.mjs", import.meta.url);
writeFileSync(destino, js.code);
const Contador = (await import(destino)).default;

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 084</title></head><body>${contenido}</body></html>`;

const dibujar = (props) => render(Contador, { props }).body;

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
    const a = Number(url.searchParams.get("a") ?? 0);
    const b = Number(url.searchParams.get("b") ?? 5);
    html(
      pagina(
        `<div data-padre="app">${dibujar({ id: "a", inicial: a })}${dibujar({ id: "b", inicial: b })}</div>`,
      ),
    );
    return;
  }

  if (url.pathname === "/sin-propiedades") {
    html(pagina(dibujar({})));
    return;
  }

  if (url.pathname === "/transicion") {
    const antes = Number(url.searchParams.get("desde") ?? 0);
    const paso = Number(url.searchParams.get("paso") ?? 1);
    json({ antes, paso, despues: siguiente(antes, paso), regla: "no baja de cero" });
    return;
  }

  if (url.pathname === "/estado.json") {
    json({
      leido_del_archivo: true,
      archivo: "Contador.svelte",
      lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_declara: "$state(inicial)",
      el_estado_es_una_propiedad: false,
      cada_instancia_tiene_el_suyo: true,
      como_se_identifica_la_instancia: "cada instancia ejecuta su propio bloque <script>",
      quien_dispara_el_redibujado: "el código que el compilador generó al asignar a la variable",
      nota:
        "es el único de los ocho donde el estado se lee y se escribe como una variable normal: sin `.value`, sin función de asignación. Lo paga el compilador",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
