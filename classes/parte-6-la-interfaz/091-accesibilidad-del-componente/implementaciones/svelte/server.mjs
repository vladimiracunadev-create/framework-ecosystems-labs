import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";

import { auditar } from "./auditor.mjs";

/**
 * COMPILAR CAPTURANDO LOS AVISOS.
 *
 * Aquí está lo que ninguna de las otras tres implementaciones puede enseñar: el
 * compilador de Svelte **devuelve una lista de avisos**, y entre ellos están los
 * de accesibilidad. No hay que instalar un verificador ni configurar nada.
 *
 * Se guardan y se publican en `/accesibilidad.json`, así que la clase no afirma
 * que Svelte avise: lo demuestra con lo que el compilador devolvió.
 */
function compilar(nombre) {
  const fuente = readFileSync(new URL(`./${nombre}.svelte`, import.meta.url), "utf8");
  const { js, warnings } = compile(fuente, { generate: "server", name: nombre });
  const destino = new URL(`./${nombre}.compilada.mjs`, import.meta.url);
  writeFileSync(destino, js.code);
  return { fuente, destino, avisos: (warnings ?? []).map((a) => a.code ?? String(a)) };
}

const accesible = compilar("ControlAccesible");
const inaccesible = compilar("ControlInaccesible");
const ControlAccesible = (await import(accesible.destino)).default;
const ControlInaccesible = (await import(inaccesible.destino)).default;

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 091</title></head><body>${contenido}</body></html>`;

const dibujar = (version, abierto) =>
  render(version === "accesible" ? ControlAccesible : ControlInaccesible, {
    props: { abierto },
  }).body;

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const abierto = url.searchParams.get("abierto") === "si";

  if (url.pathname === "/accesible" || url.pathname === "/inaccesible") {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(pagina(dibujar(url.pathname.slice(1), abierto)));
    return;
  }

  if (url.pathname === "/auditar") {
    const version = url.searchParams.get("version") ?? "accesible";
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify({ version, ...auditar(dibujar(version, abierto)) }));
    return;
  }

  if (url.pathname === "/accesibilidad.json") {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({
        leido_del_archivo: true,
        archivo: "ControlAccesible.svelte",
        lineas: accesible.fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        el_framework_no_te_hace_accesible: true,
        el_compilador_avisa: true,
        avisos_al_compilar_la_accesible: accesible.avisos,
        avisos_al_compilar_la_inaccesible: inaccesible.avisos,
        que_pone_el_framework: [
          "avisos de accesibilidad EN EL COMPILADOR, sin instalar nada",
          "los atributos se escriben como en HTML",
        ],
        que_sigue_siendo_tuyo: [
          "elegir <button> en lugar de <div>",
          "asociar la etiqueta con el campo",
          "exponer el estado con aria-*",
          "el orden del foco al abrir y cerrar",
        ],
        limite_de_los_avisos:
          "cubren lo que se puede deducir del marcado estático; el contraste y el orden del foco siguen fuera",
        herramienta_recomendada: "los avisos del compilador, y axe-core en las pruebas",
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
