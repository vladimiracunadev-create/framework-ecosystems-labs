// Alpine sobre un formulario que ya funciona. El marcado base es el de la
// clase 080; los atributos x-data y @submit.prevent son la capa de mejora,
// que hace el envío con fetch y añade el elemento sin recargar. Si Alpine no
// carga, los atributos son texto inerte y el formulario sigue enviando solo.
//
// Lo medible sin navegador es la mitad servidor: el fetch de Alpine pide
// `Accept: application/json`, y el mismo endpoint responde JSON a la mejora
// y redirección al envío clásico.
import { createServer } from "node:http";

const tareas = [];

function escapar(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pagina() {
  return `<!DOCTYPE html>
<html><body>
<script src="/alpine.js" defer></script>
<div x-data="{ tareas: [] }">
  <form method="post" action="/tareas"
        @submit.prevent="fetch('/tareas', { method: 'POST', headers: { accept: 'application/json' }, body: new FormData($el) }).then(r => r.json()).then(t => tareas.push(t))">
    <input name="titulo" value="">
    <button type="submit">Crear</button>
  </form>
  <ul>
${tareas.map((t) => `    <li data-id="${escapar(t.id)}">${escapar(t.titulo)}</li>`).join("\n")}
    <template x-for="t in tareas"><li x-text="t.titulo"></li></template>
  </ul>
</div>
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
      // La bifurcación: el fetch de la mejora pide JSON; el formulario
      // clásico no pide nada y recibe el 303 de la clase 080.
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
