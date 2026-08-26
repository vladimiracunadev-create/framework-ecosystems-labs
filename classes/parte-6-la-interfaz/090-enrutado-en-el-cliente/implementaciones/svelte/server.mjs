import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";

import { RUTAS, emparejar, resolver } from "./enrutador.mjs";

const FUENTE = new URL("./enrutador.mjs", import.meta.url);
const fuentePantalla = readFileSync(new URL("./Pantalla.svelte", import.meta.url), "utf8");
const { js } = compile(fuentePantalla, { generate: "server", name: "Pantalla" });
const destinoCompilado = new URL("./Pantalla.compilada.mjs", import.meta.url);
writeFileSync(destinoCompilado, js.code);
const Pantalla = (await import(destinoCompilado)).default;

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 090</title></head><body>${contenido}</body></html>`;

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");

  if (url.pathname === "/emparejar") {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify(
        emparejar(url.searchParams.get("patron") ?? "/", url.searchParams.get("ruta") ?? "/"),
      ),
    );
    return;
  }

  if (url.pathname === "/rutas.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({
        leido_del_archivo: true,
        archivo: "enrutador.mjs",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        rutas: RUTAS.map((r) => r.patron),
        la_direccion_es_estado: true,
        biblioteca_habitual: "SvelteKit, donde las rutas son DIRECTORIOS",
        viene_en_el_nucleo: false,
        como_se_lee_un_parametro: "llega en `data` desde `load`, o en `page.params`",
        el_orden_lo_decide: "SvelteKit, por especificidad del nombre del directorio",
        no_hay_tabla: true,
        nota:
          "es el único de los cuatro donde la tabla no se escribe: `src/routes/tareas/[id]/+page.svelte` ES la ruta. Convención sobre configuración llevada al enrutado",
      }),
    );
    return;
  }

  const destino = resolver(url.pathname);
  respuesta.writeHead(destino.encontrada ? 200 : 404, {
    "content-type": "text/html; charset=utf-8",
  });
  respuesta.end(pagina(render(Pantalla, { props: destino }).body));
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
