import { createServer } from "node:http";
import crypto from "node:crypto";
import { pagina } from "./App.compilada.mjs";

const INYECTADO = "<script>robar()</script>";

// Un nonce por PETICIÓN. Un nonce fijo no es un nonce: el atacante lo lee en
// el HTML de ayer y lo escribe en su script.
function politica(nonce) {
  return [
    "default-src 'self'",
    `script-src 'nonce-${nonce}'`,
    // Las puertas traseras conocidas: `<base>` reescribe las rutas relativas
    // y `<object>` ejecuta sin pasar por `script-src`.
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
    respuesta.end(pagina(nonce, INYECTADO));
    return;
  }
  if (peticion.url === "/sin-politica") {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(pagina("sin-uso", INYECTADO));
    return;
  }
  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000));
