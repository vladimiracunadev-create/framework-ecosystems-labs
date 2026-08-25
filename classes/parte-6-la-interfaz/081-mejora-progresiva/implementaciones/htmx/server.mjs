// htmx ES mejora progresiva con nombre de biblioteca: el formulario base
// funciona solo, y los atributos hx-* le añaden el comportamiento. La parte
// medible sin navegador es la MITAD SERVIDOR del patrón: el mismo endpoint
// responde página completa al envío clásico y FRAGMENTO cuando la petición
// llega con la cabecera HX-Request — que es como htmx se identifica.
import { createServer } from "node:http";

const tareas = [];

function escapar(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function elemento(tarea) {
  return `<li data-id="${escapar(tarea.id)}">${escapar(tarea.titulo)}</li>`;
}

function pagina() {
  // El formulario funciona SIN los atributos hx-*: method y action son el
  // caso base. hx-post y hx-target son la mejora — si htmx no carga, el
  // navegador ni se entera de que están.
  return `<!DOCTYPE html>
<html><body>
<script src="/htmx.js"></script>
<form method="post" action="/tareas" hx-post="/tareas" hx-target="#lista" hx-swap="beforeend">
  <input name="titulo" value="">
  <button type="submit">Crear</button>
</form>
<ul id="lista">
${tareas.map(elemento).join("\n")}
</ul>
</body></html>`;
}

createServer((peticion, respuesta) => {
  if (peticion.method === "GET" && peticion.url === "/") {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(pagina());
    return;
  }
  if (peticion.method === "POST" && peticion.url === "/tareas") {
    let cuerpo = "";
    peticion.on("data", (d) => (cuerpo += d));
    peticion.on("end", () => {
      const titulo = new URLSearchParams(cuerpo).get("titulo") ?? "";
      const tarea = { id: String(tareas.length + 1), titulo };
      tareas.push(tarea);
      // La bifurcación del patrón. Con HX-Request, htmx quiere el fragmento
      // que va a insertar en #lista; sin ella, es un navegador de verdad
      // enviando un formulario de verdad, y le toca el 303 de la clase 080.
      if (peticion.headers["hx-request"] === "true") {
        respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        respuesta.end(elemento(tarea));
      } else {
        respuesta.writeHead(303, { location: "/" });
        respuesta.end();
      }
    });
    return;
  }
  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000));
