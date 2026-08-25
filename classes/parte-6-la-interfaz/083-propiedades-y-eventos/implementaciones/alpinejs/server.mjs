import { createServer } from "node:http";
import { readFileSync } from "node:fs";

import { contador } from "./contador.mjs";
import { alRecibirCambio } from "./padre.mjs";

const FUENTE = new URL("./contador.mjs", import.meta.url);

// El padre escucha el evento que burbujea y decide. `$event.detail` trae el
// paso; el padre suma. La misma división que en las otras siete, escrita en un
// atributo en lugar de en un archivo.
const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 083</title>` +
  `<script defer src="https://unpkg.com/alpinejs@3.14.9/dist/cdn.min.js"></script></head>` +
  `<body><div data-padre="app" x-data="{ valor: 0 }" x-on:cambiar="valor = valor + $event.detail">` +
  `${contenido}</div></body></html>`;

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");

  if (url.pathname === "/") {
    const valor = Number(url.searchParams.get("valor") ?? 0);
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(pagina(contador(valor)));
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
        archivo: "contador.mjs",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        datos_hacia_abajo: "propiedades",
        como_se_declaran: "el objeto de `x-data`, escrito en el atributo",
        avisos_hacia_arriba: "`$dispatch`, que lanza un CustomEvent que burbujea",
        el_hijo_muta_la_propiedad: false,
        hay_mecanismo_de_eventos_aparte: true,
        eventos_declarados: ["cambiar"],
        nota:
          "el mecanismo es el mismo que en Lit —un evento del DOM— y lo que cambia es dónde se declara: allí en una clase, aquí en un atributo",
        el_hijo_sabe_que_pasa_despues: false,
        aviso_del_metodo:
          "el contrato ve el marcado antes de que Alpine lo despierte; el burbujeo ocurre en el navegador",
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
