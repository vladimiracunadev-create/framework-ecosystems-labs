// Svelte es un COMPILADOR: aquí se compilan los dos componentes con su
// compilador real (generate: "server") y se renderizan con svelte/server.
// El escapado que se mide es el que Svelte escribe en el código compilado.
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";

const TEXTO = "<script>alerta(1)</script>";

mkdirSync(new URL("./compilados/", import.meta.url), { recursive: true });
async function compilar(nombre) {
  const fuente = readFileSync(new URL(`./${nombre}.svelte`, import.meta.url), "utf8");
  const { js } = compile(fuente, { generate: "server", name: nombre });
  const destino = new URL(`./compilados/${nombre}.js`, import.meta.url);
  writeFileSync(destino, js.code);
  return (await import(destino)).default;
}

const Seguro = await compilar("Seguro");
const Inseguro = await compilar("Inseguro");

const rutas = {
  "/seguro": () => render(Seguro, { props: { texto: TEXTO } }).body,
  "/inseguro": () => render(Inseguro, { props: { texto: TEXTO } }).body,
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
