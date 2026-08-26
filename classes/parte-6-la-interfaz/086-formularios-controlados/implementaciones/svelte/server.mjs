import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";

import { LIMITE, siguiente } from "./reglas.mjs";

function compilar(nombre) {
  const origen = new URL(`./${nombre}.svelte`, import.meta.url);
  const fuente = readFileSync(origen, "utf8");
  const { js } = compile(fuente, { generate: "server", name: nombre });
  const destino = new URL(`./${nombre}.compilada.mjs`, import.meta.url);
  writeFileSync(destino, js.code);
  return { fuente, destino };
}

const controlado = compilar("Campo");
const noControlado = compilar("CampoNoControlado");
const Campo = (await import(controlado.destino)).default;
const CampoNoControlado = (await import(noControlado.destino)).default;

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 086</title></head><body>${contenido}</body></html>`;

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
    html(pagina(render(Campo, { props: { texto: url.searchParams.get("texto") ?? "" } }).body));
    return;
  }

  if (url.pathname === "/no-controlado") {
    html(
      pagina(render(CampoNoControlado, { props: { texto: url.searchParams.get("texto") ?? "" } }).body),
    );
    return;
  }

  if (url.pathname === "/cambio") {
    const antes = url.searchParams.get("desde") ?? "";
    const tecla = url.searchParams.get("tecla") ?? "";
    json({ antes, tecla, despues: siguiente(antes, tecla), regla: "diez caracteres como mucho", limite: LIMITE });
    return;
  }

  if (url.pathname === "/formulario.json") {
    json({
      leido_del_archivo: true,
      archivo: "Campo.svelte",
      lineas: controlado.fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_ata: "`bind:value` como atajo; `value` + `oninput` cuando hace falta normalizar",
      el_estado_manda_sobre_el_campo: true,
      hay_atajo_de_dos_direcciones: true,
      atajo: "bind:value",
      que_pasa_si_falta_el_manejador: "el campo se comporta como no controlado: guarda lo suyo",
      no_controlado: "poner `value` sin `bind:` ni manejador",
      nota:
        "con `$bindable()`, una PROPIEDAD puede ser de dos direcciones y el padre se ata con `bind:`. Ninguno de los otros tres deja que la propiedad misma sea bidireccional",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
