import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { renderToString, ssr } from "solid-js/web";

import { Contador } from "./Contador.mjs";
import { siguiente } from "./reglas.mjs";

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
    const a = Number(url.searchParams.get("a") ?? 0);
    const b = Number(url.searchParams.get("b") ?? 5);
    html(
      pagina(
        renderToString(() =>
          ssr(
            ['<div data-padre="app">', "", "</div>"],
            Contador({ id: "a", inicial: a }),
            Contador({ id: "b", inicial: b }),
          ),
        ),
      ),
    );
    return;
  }

  if (url.pathname === "/sin-propiedades") {
    html(pagina(renderToString(() => Contador({}))));
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
      como_se_declara: "createSignal(inicial), que devuelve un par leer/escribir",
      el_estado_es_una_propiedad: false,
      cada_instancia_tiene_el_suyo: true,
      como_se_identifica_la_instancia: "cada llamada a la función crea sus propias señales",
      quien_dispara_el_redibujado: "solo los sitios donde la señal se LEYÓ, no el componente entero",
      nota:
        "`valor` es una función y hay que llamarla: leerla es lo que suscribe. Por eso el componente se ejecuta una sola vez y al cambiar solo se redibujan los huecos",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
