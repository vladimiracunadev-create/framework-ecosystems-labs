import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { RUTAS, emparejar, resolver } from "./enrutador.mjs";

const FUENTE = new URL("./enrutador.mjs", import.meta.url);

/**
 * LAS PANTALLAS. Un componente por entrada de la tabla.
 *
 * En React Router esto se escribiría como `<Route path="/tareas/:id"
 * element={<Detalle />} />` y el parámetro se leería con `useParams()`. La
 * mecánica es la misma: la tabla dice qué componente, el emparejador dice con
 * qué datos.
 */
function Pantalla({ pantalla, parametros }) {
  const atributos = { "data-pantalla": pantalla };
  if (parametros.id) atributos["data-id"] = parametros.id;
  return h("div", atributos, pantalla);
}

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
        biblioteca_habitual: "React Router, o el enrutador de un metaframework",
        viene_en_el_nucleo: false,
        como_se_lee_un_parametro: "useParams()",
        el_orden_lo_decide: "la tabla, tal y como está escrita",
        nota:
          "React no trae enrutador: es una biblioteca de interfaz. Elegir uno —y cuál— es una decisión más del proyecto, y por eso hay varios compitiendo",
      }),
    );
    return;
  }

  // CUALQUIER OTRA DIRECCIÓN PASA POR EL ENRUTADOR.
  //
  // En un cliente, esto lo hace el navegador sin pedir nada al servidor. Aquí lo
  // hace el servidor con la misma tabla — y esa simetría es la que permite que
  // una aplicación renderice en los dos sitios.
  const destino = resolver(url.pathname);
  respuesta.writeHead(destino.encontrada ? 200 : 404, {
    "content-type": "text/html; charset=utf-8",
  });
  respuesta.end(pagina(renderToStaticMarkup(h(Pantalla, destino))));
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
