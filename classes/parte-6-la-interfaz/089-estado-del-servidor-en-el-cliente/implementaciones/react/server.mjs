import { createServer } from "node:http";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { leer } from "./cache.mjs";
import { responder } from "./servidor-comun.mjs";

/**
 * CÓMO LO CONSUME UN COMPONENTE DE REACT.
 *
 * En un proyecto real esto sería `useQuery(["usuarios"], traerUsuarios)` de
 * TanStack Query: la clave, la función que trae el dato, y el gancho devuelve
 * `{ data, isLoading, isStale }`.
 *
 * Aquí el componente llama a `leer` directamente porque en el servidor no hay
 * suscripciones. Lo que se ve igual es lo importante: **el componente no guarda
 * el dato**. Lo pide por clave y la caché decide si va a la fuente.
 */
function Panel({ clave }) {
  const { dato, origen } = leer(clave);
  return h("div", { "data-panel": clave, "data-origen": origen }, dato);
}

const FICHA = {
  biblioteca_habitual: "TanStack Query (antes React Query), o SWR",
  como_se_consume: "useQuery(clave, traerDato) devuelve { data, isLoading, isStale }",
  por_que_no_useState:
    "guardar la respuesta en useState convierte un dato ajeno en estado propio: hay que sincronizarlo a mano, y no hay quien avise de que envejeció",
  nota:
    "TanStack Query nació precisamente de contar cuánto código se repetía para esto en cada proyecto de React: cargando, error, reintentos, caché y revalidación",
};

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");

  if (url.pathname === "/") {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(
      `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 089</title></head><body>${renderToStaticMarkup(
        h(Panel, { clave: url.searchParams.get("clave") ?? "usuarios" }),
      )}</body></html>`,
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
