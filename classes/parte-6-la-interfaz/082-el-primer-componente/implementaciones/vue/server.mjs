import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";

import { Saludo } from "./Saludo.mjs";

/**
 * VUE EN EL SERVIDOR.
 *
 * `createSSRApp` construye una aplicación pensada para renderizarse una vez y
 * mandarse como texto. Es un paso más que en React —ahí basta con llamar a la
 * función del componente— porque en Vue el componente vive dentro de una
 * aplicación, con su contexto y su ciclo.
 *
 * Ese «vive dentro de» es el rasgo del framework frente a la biblioteca, y es
 * exactamente lo que la clase 001 definió.
 */

const FUENTE = new URL("./Saludo.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 082</title></head><body>${contenido}</body></html>`;

const render = (nodo) => renderToString(createSSRApp({ render: () => nodo }));

createServer(async (peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const html = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(cuerpo);
  };

  if (url.pathname === "/") {
    html(pagina(await render(h(Saludo))));
    return;
  }

  if (url.pathname === "/componente") {
    // El texto entra por PROPIEDADES, y Vue lo escapa al interpolarlo. Es el
    // comportamiento por omisión: para meter marcado de verdad hay que pedirlo
    // aparte con `v-html`, que es la clase 073.
    const texto = url.searchParams.get("texto") ?? undefined;
    html(pagina(await render(h(Saludo, texto === undefined ? {} : { texto }))));
    return;
  }

  if (url.pathname === "/dos") {
    const a = url.searchParams.get("a") ?? "uno";
    const b = url.searchParams.get("b") ?? "dos";
    html(
      pagina(
        await render(h("div", null, [h(Saludo, { texto: a }), h(Saludo, { texto: b })])),
      ),
    );
    return;
  }

  if (url.pathname === "/componente.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({
        leido_del_archivo: true,
        archivo: "Saludo.mjs",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        es_un: "objeto con propiedades declaradas y una función de render",
        se_compila: false,
        nota_de_compilacion:
          "en un proyecto real se escribiría en un archivo .vue con <template>, y eso sí necesita compilador",
        renderiza_en: "servidor y navegador",
        escapa_por_omision: true,
        como_recibe_datos: "propiedades declaradas en `props`, validadas por tipo",
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
