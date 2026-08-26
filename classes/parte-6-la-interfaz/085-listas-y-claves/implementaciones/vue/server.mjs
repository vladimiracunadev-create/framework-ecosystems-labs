import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";

import { frutas, REPETIDAS } from "./datos.mjs";
import { Lista, ListaSinClave } from "./Lista.mjs";

const FUENTE = new URL("./Lista.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 085</title></head><body>${contenido}</body></html>`;

const render = (nodo) => renderToString(createSSRApp({ render: () => nodo }));

/** Interceptar la consola para capturar lo que el framework dice al renderizar. */
async function renderizarCapturando(nodo) {
  const avisos = [];
  const originalError = console.error;
  const originalWarn = console.warn;
  console.error = (...args) => avisos.push(args.map(String).join(" "));
  console.warn = (...args) => avisos.push(args.map(String).join(" "));
  try {
    const html = await render(nodo);
    return { html, avisos };
  } finally {
    console.error = originalError;
    console.warn = originalWarn;
  }
}

createServer(async (peticion, respuesta) => {
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
    html(pagina(await render(h(Lista, { elementos }))));
    return;
  }

  if (url.pathname === "/claves-repetidas") {
    const { avisos } = await renderizarCapturando(h(Lista, { elementos: REPETIDAS }));
    json({
      respondida: true,
      claves: REPETIDAS.map((f) => f.id),
      el_framework_avisa: avisos.length > 0,
      avisos,
      que_pasa_si_no_se_arregla:
        "el algoritmo de comparación empareja mal: al reordenar, el estado y el DOM de un elemento acaban en el otro",
    });
    return;
  }

  if (url.pathname === "/sin-clave") {
    const { avisos } = await renderizarCapturando(h(ListaSinClave, { elementos: frutas() }));
    json({
      respondida: true,
      se_puede_omitir: true,
      el_framework_avisa: avisos.length > 0,
      avisos,
      nota:
        "el framework lo permite; quien lo prohíbe es el verificador de estilo recomendado, que marca `v-for` sin `key` como error",
    });
    return;
  }

  if (url.pathname === "/lista.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    json({
      leido_del_archivo: true,
      archivo: "Lista.mjs",
      lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_escribe: "`v-for` con `:key` en la plantilla; el campo `key` del nodo en una función de render",
      la_clave_es_obligatoria: false,
      la_clave_debe_ser_estable: true,
      la_clave_llega_al_html: false,
      quien_lo_exige: "el verificador de estilo, no el framework",
      nota:
        "`key` es un atributo especial: Vue lo consume y no lo escribe en el HTML, igual que React",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
