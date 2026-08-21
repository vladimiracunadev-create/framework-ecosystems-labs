// lit-html en el servidor, con el paquete oficial @lit-labs/ssr. La
// plantilla etiquetada html`` escapa las interpolaciones por omisión; la
// puerta explícita es la directiva unsafeHTML — el nombre avisa.
import { createServer } from "node:http";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { render } from "@lit-labs/ssr";
import { collectResultSync } from "@lit-labs/ssr/lib/render-result.js";

const TEXTO = "<script>alerta(1)</script>";

const rutas = {
  "/seguro": () => collectResultSync(render(html`<p>${TEXTO}</p>`)),
  "/inseguro": () => collectResultSync(render(html`<div>${unsafeHTML(TEXTO)}</div>`)),
};

createServer((peticion, respuesta) => {
  const ruta = rutas[peticion.url];
  if (!ruta) {
    respuesta.writeHead(404).end();
    return;
  }
  respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  respuesta.end(ruta());
}).listen(Number(process.env.PORT ?? 3000));
