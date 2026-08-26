import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";

import { responder } from "./servidor-comun.mjs";

const fuente = readFileSync(new URL("./Panel.svelte", import.meta.url), "utf8");
const { js } = compile(fuente, { generate: "server", name: "Panel" });
const destino = new URL("./Panel.compilada.mjs", import.meta.url);
writeFileSync(destino, js.code);
const Panel = (await import(destino)).default;

const FICHA = {
  biblioteca_habitual: "@tanstack/svelte-query, o el `load` de SvelteKit",
  como_se_consume: "createQuery({ queryKey, queryFn }), o devolver el dato desde `load`",
  por_que_no_useState: "un `$state` guarda estado propio y no sabe que el dato de fuera envejeció",
  nota:
    "SvelteKit resuelve buena parte de esto sin biblioteca: si el dato se carga en el servidor antes de renderizar, no hay estado del servidor viviendo en el cliente que gestionar",
};

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");

  if (url.pathname === "/") {
    const marcado = render(Panel, {
      props: { clave: url.searchParams.get("clave") ?? "usuarios" },
    }).body;
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(
      `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 089</title></head><body>${marcado}</body></html>`,
    );
    return;
  }

  const resultado = responder(url, FICHA);
  if (resultado) {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify(resultado.json));
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
