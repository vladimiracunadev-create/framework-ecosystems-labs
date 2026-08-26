import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { COSTE, Pantalla as PorPropiedades } from "./PorPropiedades.mjs";
import { DosRamas, Pantalla as PorAlmacen } from "./PorAlmacen.mjs";
import { escribir, leer } from "./almacen.mjs";

const FUENTE = new URL("./PorPropiedades.mjs", import.meta.url);

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
    html(pagina(renderToStaticMarkup(h(PorPropiedades, { usuario }))));
    return;
  }

  if (url.pathname === "/por-almacen") {
    escribir(usuario);
    html(pagina(renderToStaticMarkup(h(PorAlmacen))));
    return;
  }

  if (url.pathname === "/dos-ramas") {
    escribir(usuario);
    html(pagina(renderToStaticMarkup(h(DosRamas))));
    return;
  }

  if (url.pathname === "/escribir") {
    // Escribir una vez y que las DOS ramas lo vean es la propiedad que justifica
    // el almacén. Con propiedades habría que subir el estado al ancestro común y
    // volver a bajarlo por los dos lados.
    escribir(usuario);
    const antes = leer();
    escribir(url.searchParams.get("nuevo") ?? antes);
    const despues = leer();
    const marcado = renderToStaticMarkup(h(DosRamas));
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
    const fuente = readFileSync(FUENTE, "utf8");
    json({
      leido_del_archivo: true,
      archivo: "PorPropiedades.mjs",
      lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      ...COSTE,
      // Se cuenta sobre el texto: cuántas firmas aceptan `usuario`. Si alguien
      // añade un nivel intermedio, este número sube solo.
      firmas_que_aceptan_el_dato: (fuente.match(/\(\{ usuario \}\)/g) ?? []).length,
      como_se_comparte_sin_propiedades: "useContext, o un gancho de la biblioteca de estado",
      que_se_pierde_al_usar_almacen:
        "el componente deja de ser una función de sus propiedades: depende de algo de fuera, y probarlo exige prepararlo",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
