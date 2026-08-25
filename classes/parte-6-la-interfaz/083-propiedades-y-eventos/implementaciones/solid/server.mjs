import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { renderToString, ssr } from "solid-js/web";

import { Contador } from "./Contador.mjs";
import { alRecibirCambio } from "./Padre.mjs";

const FUENTE = new URL("./Contador.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 083</title></head><body>${contenido}</body></html>`;

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");

  if (url.pathname === "/") {
    const valor = Number(url.searchParams.get("valor") ?? 0);
    const html = renderToString(() =>
      ssr(
        ['<div data-padre="app">', "</div>"],
        Contador({ valor, alCambiar: (paso) => alRecibirCambio(valor, paso) }),
      ),
    );
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(pagina(html));
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
    const fuente = readFileSync(FUENTE, "utf8");
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({
        leido_del_archivo: true,
        archivo: "Contador.mjs",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        datos_hacia_abajo: "propiedades",
        como_se_declaran: "el objeto `props`, que se LEE — desestructurarlo rompe la reactividad",
        avisos_hacia_arriba: "una función que baja como propiedad, igual que en React",
        el_hijo_muta_la_propiedad: false,
        hay_mecanismo_de_eventos_aparte: false,
        nota:
          "es la trampa número uno de quien llega desde React: `function Contador({ valor })` deja de reaccionar, porque el componente solo se ejecuta una vez",
        el_hijo_sabe_que_pasa_despues: false,
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
