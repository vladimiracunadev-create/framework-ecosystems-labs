import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";

import { alRecibirCambio } from "./Padre.mjs";

const FUENTE = new URL("./Contador.svelte", import.meta.url);
const fuente = readFileSync(FUENTE, "utf8");

mkdirSync(new URL("./compilados/", import.meta.url), { recursive: true });
const { js } = compile(fuente, { generate: "server", name: "Contador" });
const destino = new URL("./compilados/Contador.js", import.meta.url);
writeFileSync(destino, js.code);
const Contador = (await import(destino)).default;

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 083</title></head><body>${contenido}</body></html>`;

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");

  if (url.pathname === "/") {
    const valor = Number(url.searchParams.get("valor") ?? 0);
    // El padre pasa las dos cosas: el dato y el canal de aviso.
    const props = { valor, alCambiar: (paso) => alRecibirCambio(valor, paso) };
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(pagina(`<div data-padre="app">${render(Contador, { props }).body}</div>`));
    return;
  }

  if (url.pathname === "/evento") {
    const antes = Number(url.searchParams.get("valor") ?? 0);
    const paso = Number(url.searchParams.get("paso") ?? 1);
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({ antes, paso, despues: alRecibirCambio(antes, paso), quien_decide: "el padre" }),
    );
    return;
  }

  if (url.pathname === "/flujo.json") {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({
        leido_del_archivo: true,
        archivo: "Contador.svelte",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        datos_hacia_abajo: "propiedades",
        como_se_declaran: "`$props()`, desestructurado",
        avisos_hacia_arriba: "una función que baja como propiedad, igual que en React",
        el_hijo_muta_la_propiedad: false,
        hay_mecanismo_de_eventos_aparte: false,
        nota:
          "hasta Svelte 4 había un canal aparte, `createEventDispatcher`; la versión 5 lo quitó y dejó un solo mecanismo. Es uno de sus cambios más discutidos",
        el_hijo_sabe_que_pasa_despues: false,
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
