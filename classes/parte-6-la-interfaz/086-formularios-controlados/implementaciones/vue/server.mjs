import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";

import { CampoControlado, CampoNoControlado } from "./Campo.mjs";
import { LIMITE, siguiente } from "./reglas.mjs";

const FUENTE = new URL("./Campo.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 086</title></head><body>${contenido}</body></html>`;

const render = (nodo) => renderToString(createSSRApp({ render: () => nodo }));

createServer(async (peticion, respuesta) => {
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
    html(pagina(await render(h(CampoControlado, { texto: url.searchParams.get("texto") ?? "" }))));
    return;
  }

  if (url.pathname === "/no-controlado") {
    html(pagina(await render(h(CampoNoControlado, { texto: url.searchParams.get("texto") ?? "" }))));
    return;
  }

  if (url.pathname === "/cambio") {
    const antes = url.searchParams.get("desde") ?? "";
    const tecla = url.searchParams.get("tecla") ?? "";
    json({ antes, tecla, despues: siguiente(antes, tecla), regla: "diez caracteres como mucho", limite: LIMITE });
    return;
  }

  if (url.pathname === "/formulario.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    json({
      leido_del_archivo: true,
      archivo: "Campo.mjs",
      lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_ata: "`v-model` en la plantilla; `value` + `onInput` en una función de render",
      el_estado_manda_sobre_el_campo: true,
      hay_atajo_de_dos_direcciones: true,
      atajo: "v-model",
      modificadores: ["v-model.trim", "v-model.number", "v-model.lazy"],
      que_pasa_si_falta_el_manejador: "con `v-model` no puede faltar: el atajo escribe las dos mitades",
      no_controlado: "poner `value` sin manejador: el campo arranca con ese texto y luego va por su cuenta",
      nota:
        "`v-model` no añade magia: se convierte exactamente en lo que React escribe a mano. Lo que quita son teclas — y el sitio donde meter la normalización, que hay que recuperar con modificadores o abriendo el atajo",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
