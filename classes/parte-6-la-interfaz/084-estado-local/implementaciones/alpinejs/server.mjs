import { createServer } from "node:http";
import { readFileSync } from "node:fs";

import { contador } from "./contador.mjs";
import { siguiente } from "./reglas.mjs";

const FUENTE = new URL("./contador.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 084</title>` +
  `<script defer src="https://unpkg.com/alpinejs@3.14.9/dist/cdn.min.js"></script></head>` +
  `<body><div data-padre="app">${contenido}</div></body></html>`;

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
    html(pagina(contador("a", a) + contador("b", b)));
    return;
  }

  if (url.pathname === "/sin-propiedades") {
    html(pagina(contador()));
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
      archivo: "contador.mjs",
      lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_declara: "el objeto de `x-data`, escrito en el atributo",
      el_estado_es_una_propiedad: false,
      cada_instancia_tiene_el_suyo: true,
      como_se_identifica_la_instancia: "el ámbito de `x-data` es el elemento y sus descendientes",
      quien_dispara_el_redibujado: "Alpine, que envuelve el objeto en un proxy reactivo",
      nota:
        "no hay primitiva que aprender: el estado es un objeto de JavaScript. Lo que se paga es que las expresiones del atributo no pueden importar nada, así que las reglas acaban escritas dos veces",
      la_regla_esta_duplicada: true,
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
