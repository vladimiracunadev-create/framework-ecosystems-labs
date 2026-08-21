import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import crypto from "node:crypto";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";

// Continuación de la 073: el escapado falló —alguien usó `{@html}` con
// contenido de un usuario— y este script está en la página. La política de
// seguridad de contenido es la red que hay debajo.
const INYECTADO = "<script>robar()</script>";

mkdirSync(new URL("./compilados/", import.meta.url), { recursive: true });
const fuente = readFileSync(new URL("./Pagina.svelte", import.meta.url), "utf8");
const { js } = compile(fuente, { generate: "server", name: "Pagina" });
const destino = new URL("./compilados/Pagina.js", import.meta.url);
writeFileSync(destino, js.code);
const Pagina = (await import(destino)).default;

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
    respuesta.end(render(Pagina, { props: { nonce, inyectado: INYECTADO } }).body);
    return;
  }
  if (peticion.url === "/sin-politica") {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(render(Pagina, { props: { nonce: "sin-uso", inyectado: INYECTADO } }).body);
    return;
  }
  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000));
