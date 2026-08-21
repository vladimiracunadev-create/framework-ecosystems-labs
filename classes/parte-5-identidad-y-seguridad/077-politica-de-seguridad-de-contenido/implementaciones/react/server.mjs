import { createServer } from "node:http";
import crypto from "node:crypto";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// LA HISTORIA DE LA CLASE, continuación de la 073: el escapado falló.
// Alguien usó la puerta explícita —`dangerouslySetInnerHTML`— con contenido
// de un usuario, y este script está ahora en la página. La política de
// seguridad de contenido es la red que hay debajo: el script está en el
// marcado y el navegador se niega a ejecutarlo.
const INYECTADO = "<script>robar()</script>";

function pagina(nonce) {
  return renderToStaticMarkup(
    h("html", null,
      h("body", null,
        // El script legítimo lleva el nonce de ESTA respuesta. Si no
        // coincidiera con el de la cabecera, la política bloquearía al bueno
        // — el fallo más común al desplegar CSP por primera vez.
        h("script", { nonce, dangerouslySetInnerHTML: { __html: "window.saludo=1" } }),
        // El XSS que entró por la puerta explícita.
        h("div", { dangerouslySetInnerHTML: { __html: INYECTADO } }),
      ),
    ),
  );
}

// Un nonce por PETICIÓN, del generador criptográfico. Un nonce fijo en la
// configuración no es un nonce: el atacante lo lee en el HTML de ayer y lo
// escribe en su script.
function politica(nonce) {
  return [
    "default-src 'self'",
    `script-src 'nonce-${nonce}'`,
    // Las dos puertas traseras conocidas de una política de nonce:
    // `<base>` reescribe a dónde apuntan las rutas relativas, y un `<object>`
    // ejecuta contenido sin pasar por `script-src`.
    "base-uri 'none'",
    "object-src 'none'",
  ].join("; ");
}

createServer((peticion, respuesta) => {
  if (peticion.url === "/") {
    const nonce = crypto.randomBytes(16).toString("base64url");
    respuesta.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "content-security-policy": politica(nonce),
    });
    respuesta.end(pagina(nonce));
    return;
  }
  if (peticion.url === "/sin-politica") {
    // La misma página, sin red debajo: aquí el script inyectado se ejecuta.
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(pagina("sin-uso"));
    return;
  }
  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000));
