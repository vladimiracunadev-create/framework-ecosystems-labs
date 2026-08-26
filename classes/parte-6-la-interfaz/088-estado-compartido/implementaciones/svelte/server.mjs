import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";

import { escribir, leer } from "./almacen.mjs";

/**
 * COMPILAR EL ÁRBOL ENTERO.
 *
 * Cada `.svelte` se compila por separado y las importaciones entre ellos hay que
 * reescribirlas: el original importa `./Rama.svelte` y el compilado necesita
 * `./Rama.compilada.mjs`. Es exactamente lo que hace la herramienta de
 * construcción de un proyecto real, y aquí está a la vista.
 */
const COMPONENTES = [
  "PorPropiedades",
  "RamaPorPropiedades",
  "MedioPorPropiedades",
  "NietoPorPropiedades",
  "PorAlmacen",
  "RamaPorAlmacen",
  "MedioPorAlmacen",
  "NietoPorAlmacen",
];

const fuentes = new Map();
for (const nombre of COMPONENTES) {
  const fuente = readFileSync(new URL(`./${nombre}.svelte`, import.meta.url), "utf8");
  fuentes.set(nombre, fuente);
  const { js } = compile(fuente, { generate: "server", name: nombre });
  const codigo = js.code.replaceAll(/from "\.\/([A-Za-z]+)\.svelte"/g, 'from "./$1.compilada.mjs"');
  writeFileSync(new URL(`./${nombre}.compilada.mjs`, import.meta.url), codigo);
}

const PorPropiedades = (await import(new URL("./PorPropiedades.compilada.mjs", import.meta.url))).default;
const PorAlmacen = (await import(new URL("./PorAlmacen.compilada.mjs", import.meta.url))).default;

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 088</title></head><body>${contenido}</body></html>`;

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const usuario = url.searchParams.get("usuario") ?? "sin usuario";
  const html = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(cuerpo);
  };
  const json = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify(cuerpo));
  };

  if (url.pathname === "/por-propiedades") {
    html(pagina(render(PorPropiedades, { props: { usuario } }).body));
    return;
  }

  if (url.pathname === "/por-almacen") {
    escribir(usuario);
    html(pagina(render(PorAlmacen, { props: {} }).body));
    return;
  }

  if (url.pathname === "/dos-ramas") {
    escribir(usuario);
    html(pagina(render(PorAlmacen, { props: { dos: true } }).body));
    return;
  }

  if (url.pathname === "/escribir") {
    escribir(usuario);
    const antes = leer();
    escribir(url.searchParams.get("nuevo") ?? antes);
    const despues = leer();
    const marcado = render(PorAlmacen, { props: { dos: true } }).body;
    json({
      antes,
      despues,
      ramas_que_lo_ven: (marcado.match(/data-rama=/g) ?? []).length,
      quien_escribe: "quien tenga acceso al almacén, desde cualquier punto del árbol",
      cuidado:
        "esa misma facilidad es el riesgo: si cualquiera puede escribir, «¿quién cambió esto?» vuelve a no tener respuesta",
    });
    return;
  }

  if (url.pathname === "/coste.json") {
    // El coste se cuenta sobre los archivos: cuántos `.svelte` declaran
    // `usuario` en sus propiedades sin ser el que lo usa.
    const declaran = COMPONENTES.filter(
      (n) => n.endsWith("PorPropiedades") && fuentes.get(n).includes("let { usuario } = $props()"),
    );
    json({
      leido_del_archivo: true,
      archivo: "PorPropiedades.svelte y los tres de debajo",
      lineas: fuentes.get("PorPropiedades").split(/\r?\n/).filter((l) => l.trim()).length,
      niveles_que_atraviesa: 3,
      niveles_que_no_usan_el_dato: 2,
      firmas_que_aceptan_el_dato: declaran.length,
      archivos_que_lo_declaran: declaran,
      como_se_comparte_sin_propiedades:
        "`setContext`/`getContext`, o un almacén: `writable` viene en la biblioteca estándar",
      que_se_pierde_al_usar_almacen:
        "el componente deja de ser una función de sus propiedades: depende de algo de fuera, y probarlo exige prepararlo",
      nota:
        "es el único de los cuatro con almacenes en la biblioteca estándar: compartir estado no exige traer nada de fuera",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
