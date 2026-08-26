import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { renderToString } from "solid-js/web";

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
    html(pagina(renderToString(() => PorPropiedades({ usuario }))));
    return;
  }

  if (url.pathname === "/por-almacen") {
    escribir(usuario);
    html(pagina(renderToString(() => PorAlmacen())));
    return;
  }

  if (url.pathname === "/dos-ramas") {
    escribir(usuario);
    html(pagina(renderToString(() => DosRamas())));
    return;
  }

  if (url.pathname === "/escribir") {
    escribir(usuario);
    const antes = leer();
    escribir(url.searchParams.get("nuevo") ?? antes);
    const despues = leer();
    const marcado = renderToString(() => DosRamas());
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
      firmas_que_aceptan_el_dato: (fuente.match(/usuario: props\.usuario/g) ?? []).length,
      como_se_comparte_sin_propiedades: "`createContext`, o un almacén con `createStore`",
      que_se_pierde_al_usar_almacen:
        "el componente deja de ser una función de sus propiedades: depende de algo de fuera, y probarlo exige prepararlo",
      nota:
        "reenviar propiedades no cuesta nada aquí, porque son accesos perezosos: el valor no se lee hasta abajo. El coste es de acoplamiento, no de rendimiento",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
