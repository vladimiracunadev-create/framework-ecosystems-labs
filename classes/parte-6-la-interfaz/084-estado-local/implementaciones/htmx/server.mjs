import { createServer } from "node:http";
import { readFileSync } from "node:fs";

import { contador } from "./contador.mjs";
import { siguiente } from "./reglas.mjs";

const FUENTE = new URL("./contador.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 084</title>` +
  `<script src="https://unpkg.com/htmx.org@2.0.4"></script></head>` +
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

  if (url.pathname === "/paso") {
    // El fragmento nuevo se sustituye a sí mismo con `hx-swap="outerHTML"`, y
    // solo el que se pulsó: el otro contador ni se entera. Es la independencia
    // entre instancias, conseguida por el objetivo de la petición.
    const antes = Number(url.searchParams.get("valor") ?? 0);
    const paso = Number(url.searchParams.get("paso") ?? 1);
    html(contador(url.searchParams.get("id") ?? "sola", siguiente(antes, paso)));
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
      como_se_declara: "no se declara: el valor viaja en la dirección de la petición",
      el_estado_es_una_propiedad: false,
      cada_instancia_tiene_el_suyo: true,
      como_se_identifica_la_instancia: "por el objetivo de la petición: `hx-target` apunta a una sola",
      quien_dispara_el_redibujado: "el servidor, devolviendo el fragmento nuevo",
      nota:
        "no hay estado local, y es una postura: una sola fuente de verdad. En los otros siete hay dos copias del dato y mantenerlas de acuerdo es media aplicación",
      donde_vive_el_estado: "el servidor",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
