// El apaño de DOM tiene que instalarse ANTES de importar nada de Lit: define
// `HTMLElement`, `customElements` y compañía, que en Node no existen. Un
// elemento personalizado es del navegador, así que renderizarlo en el servidor
// exige fingir que hay uno.
//
// Es el precio de que el componente sea una etiqueta HTML de verdad, y explica
// por qué el renderizado en servidor llegó a los componentes web mucho después
// que a React o a Vue.
import "@lit-labs/ssr/lib/install-global-dom-shim.js";

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { html } from "lit";
import { render } from "@lit-labs/ssr";
import { collectResultSync } from "@lit-labs/ssr/lib/render-result.js";

import "./Saludo.mjs";

const FUENTE = new URL("./Saludo.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 082</title></head><body>${contenido}</body></html>`;

const dibujar = (plantilla) => collectResultSync(render(plantilla));

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const salida = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(cuerpo);
  };

  if (url.pathname === "/") {
    salida(pagina(dibujar(html`<mi-saludo></mi-saludo>`)));
    return;
  }

  if (url.pathname === "/componente") {
    // `.texto=` con punto asigna la PROPIEDAD; sin punto asignaría el atributo.
    // Los dos funcionan aquí porque el valor es texto, y la diferencia importa
    // en cuanto se pasa un objeto: un atributo de HTML solo sabe de cadenas.
    const texto = url.searchParams.get("texto") ?? undefined;
    salida(pagina(dibujar(html`<mi-saludo .texto=${texto}></mi-saludo>`)));
    return;
  }

  if (url.pathname === "/dos") {
    const a = url.searchParams.get("a") ?? "uno";
    const b = url.searchParams.get("b") ?? "dos";
    salida(
      pagina(
        dibujar(
          html`<div><mi-saludo .texto=${a}></mi-saludo><mi-saludo .texto=${b}></mi-saludo></div>`,
        ),
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
        es_un: "elemento personalizado del navegador, registrado como <mi-saludo>",
        se_compila: false,
        nota_de_compilacion:
          "las plantillas son literales etiquetados de JavaScript: se analizan una vez en tiempo de ejecución y se reutilizan",
        renderiza_en: "navegador de forma nativa; en servidor solo con un apaño de DOM",
        escapa_por_omision: true,
        etiqueta: "mi-saludo",
        funciona_sin_el_framework:
          "la etiqueta existe en cualquier página que cargue el archivo, sin nada alrededor",
        como_recibe_datos: "atributos de HTML declarados en `static properties`, o propiedades con `.`",
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
