import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";

// Svelte compilado con generate: "server", como en las clases 073 y 077.
mkdirSync(new URL("./compilados/", import.meta.url), { recursive: true });
const fuente = readFileSync(new URL("./Pagina.svelte", import.meta.url), "utf8");
const { js } = compile(fuente, { generate: "server", name: "Pagina" });
const destino = new URL("./compilados/Pagina.js", import.meta.url);
writeFileSync(destino, js.code);
const Pagina = (await import(destino)).default;

const tareas = [];

createServer((peticion, respuesta) => {
  if (peticion.method === "GET" && peticion.url === "/") {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(`<!DOCTYPE html><html><body>${render(Pagina, { props: { tareas } }).body}</body></html>`);
    return;
  }
  if (peticion.method === "POST" && peticion.url === "/tareas") {
    let cuerpo = "";
    peticion.on("data", (d) => (cuerpo += d));
    peticion.on("end", () => {
      const titulo = new URLSearchParams(cuerpo).get("titulo") ?? "";
      const tarea = { id: String(tareas.length + 1), titulo };
      tareas.push(tarea);
      // La bifurcación: el cliente mejorado pide JSON; el formulario clásico
      // recibe el 303 de la clase 080.
      if ((peticion.headers.accept ?? "").includes("application/json")) {
        respuesta.writeHead(200, { "content-type": "application/json" });
        respuesta.end(JSON.stringify(tarea));
      } else {
        respuesta.writeHead(303, { location: "/" });
        respuesta.end();
      }
    });
    return;
  }
  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000));
