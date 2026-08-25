import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Contador, siguiente } from "./Contador.mjs";

const FUENTE = new URL("./Contador.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 084</title></head><body>${contenido}</body></html>`;

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
    // DOS INSTANCIAS. Cada una arranca donde le dijeron y a partir de ahí va por
    // su cuenta: ninguna sabe de la otra y el padre no guarda ninguno de los dos
    // valores.
    const a = Number(url.searchParams.get("a") ?? 0);
    const b = Number(url.searchParams.get("b") ?? 5);
    html(
      pagina(
        renderToStaticMarkup(
          h(
            "div",
            { "data-padre": "app" },
            h(Contador, { id: "a", inicial: a }),
            h(Contador, { id: "b", inicial: b }),
          ),
        ),
      ),
    );
    return;
  }

  if (url.pathname === "/sin-propiedades") {
    // Sin recibir nada. El componente sigue teniendo estado, porque el estado no
    // viene de fuera.
    html(pagina(renderToStaticMarkup(h(Contador, {}))));
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
      archivo: "Contador.mjs",
      lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_declara: "useState(inicial)",
      el_estado_es_una_propiedad: false,
      cada_instancia_tiene_el_suyo: true,
      como_se_identifica_la_instancia: "por su posición en el árbol, no por un nombre",
      quien_dispara_el_redibujado: "React, al llamar a la función que devuelve useState",
      nota:
        "`inicial` es una propiedad y el estado NO: lo que se recibe es el valor de partida. Cambiar `inicial` después del primer render no hace nada, y eso confunde a todo el mundo alguna vez",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
