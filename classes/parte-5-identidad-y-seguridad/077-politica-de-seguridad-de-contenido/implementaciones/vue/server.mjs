import { createServer } from "node:http";
import crypto from "node:crypto";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";

// Continuación de la 073: el escapado falló —alguien usó `v-html` con
// contenido de un usuario— y este script está en la página. La política de
// seguridad de contenido es la red que hay debajo.
const INYECTADO = "<script>robar()</script>";

function componente(nonce) {
  return createSSRApp({
    render: () =>
      h("html", null, [
        // El script legítimo lleva el nonce de ESTA respuesta.
        h("script", { nonce, innerHTML: "window.saludo=1" }),
        // El XSS que entró por la puerta explícita.
        h("div", { innerHTML: INYECTADO }),
      ]),
  });
}

// Un nonce por PETICIÓN. Un nonce fijo en la configuración no es un nonce:
// el atacante lo lee en el HTML de ayer y lo escribe en su script.
function politica(nonce) {
  return [
    "default-src 'self'",
    `script-src 'nonce-${nonce}'`,
    // Las puertas traseras conocidas de una política de nonce: `<base>`
    // reescribe a dónde apuntan las rutas relativas y `<object>` ejecuta sin
    // pasar por `script-src`.
    "base-uri 'none'",
    "object-src 'none'",
  ].join("; ");
}

createServer(async (peticion, respuesta) => {
  if (peticion.url === "/") {
    const nonce = crypto.randomBytes(16).toString("base64url");
    respuesta.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "content-security-policy": politica(nonce),
    });
    respuesta.end(await renderToString(componente(nonce)));
    return;
  }
  if (peticion.url === "/sin-politica") {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(await renderToString(componente("sin-uso")));
    return;
  }
  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000));
