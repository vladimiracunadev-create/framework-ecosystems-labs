import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { CampoControlado, CampoNoControlado } from "./Campo.mjs";
import { LIMITE, siguiente } from "./reglas.mjs";

const FUENTE = new URL("./Campo.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 086</title></head><body>${contenido}</body></html>`;

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
    const texto = url.searchParams.get("texto") ?? "";
    html(pagina(renderToStaticMarkup(h(CampoControlado, { texto }))));
    return;
  }

  if (url.pathname === "/no-controlado") {
    const texto = url.searchParams.get("texto") ?? "";
    html(pagina(renderToStaticMarkup(h(CampoNoControlado, { texto }))));
    return;
  }

  if (url.pathname === "/cambio") {
    const antes = url.searchParams.get("desde") ?? "";
    const tecla = url.searchParams.get("tecla") ?? "";
    json({
      antes,
      tecla,
      despues: siguiente(antes, tecla),
      regla: "diez caracteres como mucho",
      limite: LIMITE,
    });
    return;
  }

  if (url.pathname === "/formulario.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    json({
      leido_del_archivo: true,
      archivo: "Campo.mjs",
      lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_ata: "`value` atado al estado y `onChange` que lo actualiza",
      el_estado_manda_sobre_el_campo: true,
      hay_atajo_de_dos_direcciones: false,
      que_pasa_si_falta_el_manejador: "el campo no cambia al escribir: el clásico «mi input no me deja teclear»",
      no_controlado: "`defaultValue`, y el valor se lee del DOM con una referencia",
      nota:
        "React no tiene atajo bidireccional: las dos direcciones se escriben siempre. Es más verboso y deja ver que en cada tecla pasa algo",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
