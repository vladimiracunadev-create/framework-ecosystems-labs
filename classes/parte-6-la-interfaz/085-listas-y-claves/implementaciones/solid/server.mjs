import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { renderToString } from "solid-js/web";

import { frutas, REPETIDAS } from "./datos.mjs";
import { Lista } from "./Lista.mjs";

const FUENTE = new URL("./Lista.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 085</title></head><body>${contenido}</body></html>`;

function renderizarCapturando(fabrica) {
  const avisos = [];
  const originalError = console.error;
  const originalWarn = console.warn;
  console.error = (...args) => avisos.push(args.map(String).join(" "));
  console.warn = (...args) => avisos.push(args.map(String).join(" "));
  try {
    return { html: renderToString(fabrica), avisos };
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
    html(pagina(renderToString(() => Lista({ elementos }))));
    return;
  }

  if (url.pathname === "/claves-repetidas") {
    const { avisos } = renderizarCapturando(() => Lista({ elementos: REPETIDAS }));
    json({
      respondida: true,
      claves: REPETIDAS.map((f) => f.id),
      el_framework_avisa: avisos.length > 0,
      avisos,
      // No hay nada que avisar: la identidad es la referencia del objeto, y dos
      // objetos distintos son distintos aunque su `id` coincida.
      hay_claves_que_repetir: false,
      que_pasa_si_no_se_arregla:
        "nada: `<For>` no mira el campo `id`, mira si el objeto es el mismo objeto. Dos elementos con el mismo id son dos elementos distintos",
    });
    return;
  }

  if (url.pathname === "/sin-clave") {
    json({
      respondida: true,
      se_puede_omitir: true,
      el_framework_avisa: false,
      hay_claves: false,
      nota:
        "no hay clave que omitir: `<For>` identifica por referencia. El error posible no es escribir mal la clave, es recrear los objetos en cada render",
    });
    return;
  }

  if (url.pathname === "/lista.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    json({
      leido_del_archivo: true,
      archivo: "Lista.mjs",
      lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_escribe: "`<For each={elementos}>`, sin clave: identifica por referencia",
      la_clave_es_obligatoria: false,
      la_clave_debe_ser_estable: true,
      la_clave_llega_al_html: false,
      hay_claves: false,
      nota:
        "existe `<Index>` para el caso contrario, cuando lo que importa es la posición. Elegir entre `<For>` e `<Index>` es la decisión que en las otras siete se toma escribiendo o no una clave",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
