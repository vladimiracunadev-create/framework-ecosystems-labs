import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { cuenta, debeRepetirse, reiniciar } from "./contadores.mjs";
import { Reloj } from "./Reloj.mjs";

const FUENTE = new URL("./Reloj.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 087</title></head><body>${contenido}</body></html>`;

const lista = (texto) => (texto === null ? null : texto.split(",").filter(Boolean));

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const html = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(cuerpo);
  };
  const json = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify(cuerpo));
  };

  if (url.pathname === "/") {
    html(pagina(renderToStaticMarkup(h(Reloj, {}))));
    return;
  }

  if (url.pathname === "/ciclo") {
    // Se renderiza AQUÍ, con los contadores a cero, para que lo que se cuenta
    // sea el ciclo de este render y no el de otra petición.
    reiniciar();
    renderToStaticMarkup(h(Reloj, {}));
    json({
      renders_ejecutados: cuenta.render,
      efectos_ejecutados: cuenta.efecto,
      limpiezas_ejecutadas: cuenta.limpieza,
      el_efecto_corre_en_el_servidor: cuenta.efecto > 0,
      que_si_corre: ["el cuerpo del componente"],
      que_no_corre: ["useEffect", "la función de limpieza"],
      consecuencia:
        "si los datos se cargan en un efecto, el HTML del servidor sale sin ellos y el usuario ve el estado inicial hasta que arranca el JavaScript",
    });
    return;
  }

  if (url.pathname === "/debe-repetirse") {
    const antes = lista(url.searchParams.get("antes"));
    const despues = lista(url.searchParams.get("despues")) ?? [];
    json({
      antes,
      despues,
      se_repite: debeRepetirse(antes, despues),
      comparacion: "superficial",
      con_que_se_compara: "Object.is, elemento a elemento",
    });
    return;
  }

  if (url.pathname === "/efecto.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    json({
      leido_del_archivo: true,
      archivo: "Reloj.mjs",
      lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_declara: "useEffect(() => { ... }, [dependencias])",
      tiene_limpieza: true,
      como_se_limpia: "devolviendo una función desde el efecto",
      cuando_se_limpia: "al desmontar, y antes de cada repetición",
      hay_lista_de_dependencias: true,
      que_pasa_sin_lista: "el efecto se repite después de CADA render",
      nota:
        "React ejecuta el efecto dos veces seguidas en desarrollo con el modo estricto, a propósito: es la forma de descubrir que falta la limpieza",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
