import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";

import { Contador, siguiente } from "./Contador.mjs";

const FUENTE = new URL("./Contador.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 084</title></head><body>${contenido}</body></html>`;

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
    const a = Number(url.searchParams.get("a") ?? 0);
    const b = Number(url.searchParams.get("b") ?? 5);
    html(
      pagina(
        await render(
          h("div", { "data-padre": "app" }, [
            h(Contador, { id: "a", inicial: a }),
            h(Contador, { id: "b", inicial: b }),
          ]),
        ),
      ),
    );
    return;
  }

  if (url.pathname === "/sin-propiedades") {
    html(pagina(await render(h(Contador))));
    return;
  }

  if (url.pathname === "/transicion") {
    const antes = Number(url.searchParams.get("desde") ?? 0);
    const paso = Number(url.searchParams.get("paso") ?? 1);
    json({ antes, paso, despues: siguiente(antes, paso), regla: "no baja de cero" });
    return;
  }

  if (url.pathname === "/estado.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    json({
      leido_del_archivo: true,
      archivo: "Contador.mjs",
      lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_declara: "ref(inicial), dentro de setup()",
      el_estado_es_una_propiedad: false,
      cada_instancia_tiene_el_suyo: true,
      como_se_identifica_la_instancia: "cada instancia ejecuta su propio setup()",
      quien_dispara_el_redibujado: "el sistema de reactividad, al escribir en `.value`",
      nota:
        "`setup()` se ejecuta UNA VEZ por instancia y solo se repite el render, así que las variables no se recrean y no hacen falta envoltorios de memoria como `useMemo`",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
