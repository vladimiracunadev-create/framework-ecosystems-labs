import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";

import { Padre, alRecibirCambio } from "./Padre.mjs";

const FUENTE = new URL("./Contador.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 083</title></head><body>${contenido}</body></html>`;

createServer(async (peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");

  if (url.pathname === "/") {
    const valor = Number(url.searchParams.get("valor") ?? 0);
    const nodo = h(Padre, { valor });
    const html = await renderToString(createSSRApp({ render: () => nodo }));
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(pagina(html));
    return;
  }

  if (url.pathname === "/evento") {
    // El manejador REAL del padre, llamado con el valor actual y el paso que el
    // hijo emitiría. El clic pertenece al navegador; la decisión, al padre.
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
        avisos_hacia_arriba: "`$emit` sobre un evento DECLARADO en `emits`",
        el_hijo_muta_la_propiedad: false,
        hay_mecanismo_de_eventos_aparte: true,
        eventos_declarados: ["cambiar"],
        nota:
          "`emits` es un contrato de salida: se lee sin abrir el cuerpo del componente, y Vue lo usa para distinguir un evento propio de uno nativo que se propaga",
        el_hijo_sabe_que_pasa_despues: false,
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
