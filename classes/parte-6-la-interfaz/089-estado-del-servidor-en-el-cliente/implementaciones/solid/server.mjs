import { createServer } from "node:http";
import { renderToString, ssr, escape } from "solid-js/web";

import { leer } from "./cache.mjs";
import { responder } from "./servidor-comun.mjs";

/**
 * CÓMO LO CONSUME UN COMPONENTE DE SOLID.
 *
 * Solid es el único de los cuatro con una primitiva para esto **en el núcleo**:
 * `createResource`. No es una caché completa —no tiene claves ni invalidación
 * global— pero sí resuelve la parte que todo el mundo escribe mal: cargando,
 * error, y que la petición se cancele si la fuente cambia antes de terminar.
 *
 * Para lo demás está `@tanstack/solid-query`, que es la misma biblioteca de
 * React adaptada. Y ahí hay una lección de la parte 0: **las ideas viajan entre
 * ecosistemas mucho más que el código**.
 */
function Panel(props) {
  const { dato, origen } = leer(props.clave);
  return ssr(
    ['<div data-panel="', '" data-origen="', '">', "</div>"],
    escape(props.clave),
    escape(origen),
    escape(dato),
  );
}

const FICHA = {
  biblioteca_habitual: "createResource en el núcleo, o @tanstack/solid-query para lo demás",
  como_se_consume: "const [datos] = createResource(fuente, traerDato); se lee `datos()`",
  por_que_no_useState: "una señal guarda estado propio y no sabe que el dato de fuera envejeció",
  nota:
    "es el único de los cuatro con una primitiva de datos remotos en el núcleo; cubre cargando, error y cancelación, no claves ni invalidación global",
};

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");

  if (url.pathname === "/") {
    const marcado = renderToString(() =>
      Panel({ clave: url.searchParams.get("clave") ?? "usuarios" }),
    );
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
