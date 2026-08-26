import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";

import { frutas, REPETIDAS } from "./datos.mjs";

function compilar(nombre) {
  const origen = new URL(`./${nombre}.svelte`, import.meta.url);
  const fuente = readFileSync(origen, "utf8");
  const { js } = compile(fuente, { generate: "server", name: nombre });
  const destino = new URL(`./${nombre}.compilada.mjs`, import.meta.url);
  writeFileSync(destino, js.code);
  return { fuente, destino, generado: js.code };
}

const conClave = compilar("Lista");
const sinClave = compilar("ListaSinClave");
const Lista = (await import(conClave.destino)).default;
const ListaSinClave = (await import(sinClave.destino)).default;

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 085</title></head><body>${contenido}</body></html>`;

function renderizarCapturando(componente, props) {
  const avisos = [];
  const originalError = console.error;
  const originalWarn = console.warn;
  console.error = (...args) => avisos.push(args.map(String).join(" "));
  console.warn = (...args) => avisos.push(args.map(String).join(" "));
  try {
    return { html: render(componente, { props }).body, avisos };
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
    html(pagina(render(Lista, { props: { elementos } }).body));
    return;
  }

  if (url.pathname === "/claves-repetidas") {
    const { avisos } = renderizarCapturando(Lista, { elementos: REPETIDAS });
    json({
      respondida: true,
      claves: REPETIDAS.map((f) => f.id),
      el_framework_avisa: avisos.length > 0,
      avisos,
      que_pasa_si_no_se_arregla:
        "en el navegador, Svelte lanza un error en tiempo de ejecución al encontrar dos claves iguales: es el único de los cuatro que lo convierte en excepción",
    });
    return;
  }

  if (url.pathname === "/sin-clave") {
    const { avisos } = renderizarCapturando(ListaSinClave, { elementos: frutas() });
    json({
      respondida: true,
      se_puede_omitir: true,
      el_framework_avisa: avisos.length > 0,
      avisos,
      // La diferencia no está en el HTML: está en el código generado. Contarlo
      // es la única forma de enseñar que el compilador produce DOS bucles
      // distintos según haya clave o no.
      lineas_generadas_con_clave: conClave.generado.split(/\r?\n/).filter((l) => l.trim()).length,
      lineas_generadas_sin_clave: sinClave.generado.split(/\r?\n/).filter((l) => l.trim()).length,
      nota:
        "el HTML es idéntico; lo que cambia es el código que el compilador genera para actualizar la lista",
    });
    return;
  }

  if (url.pathname === "/lista.json") {
    json({
      leido_del_archivo: true,
      archivo: "Lista.svelte",
      lineas: conClave.fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_escribe: "`{#each elementos as fruta (fruta.id)}`: la clave es parte de la sintaxis del bucle",
      la_clave_es_obligatoria: false,
      la_clave_debe_ser_estable: true,
      la_clave_llega_al_html: false,
      nota:
        "es la forma más visible de las ocho: no es un atributo entre otros, es parte de la estructura del bucle",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
