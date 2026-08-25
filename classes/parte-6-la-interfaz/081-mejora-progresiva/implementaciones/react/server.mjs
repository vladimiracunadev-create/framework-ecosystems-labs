// React renderizado en el servidor, con el formulario COMO FORMULARIO:
// method y action puestos, para que funcione antes de que cargue una sola
// línea de JavaScript. Es la idea que React formalizó con las Server
// Actions de los meta-frameworks: el `<form action>` como caso base y la
// hidratación como mejora. Aquí, sin meta-framework, la mitad medible es la
// del servidor: el mismo endpoint responde JSON al fetch del cliente
// hidratado y redirección al envío clásico.
import { createServer } from "node:http";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const tareas = [];

function Pagina() {
  return h("html", null,
    h("body", null,
      // El caso base: un formulario de verdad. La mejora (onSubmit con
      // fetch) la añadiría la hidratación ENCIMA de estos mismos atributos.
      h("form", { method: "post", action: "/tareas" },
        h("input", { name: "titulo", defaultValue: "" }),
        h("button", { type: "submit" }, "Crear"),
      ),
      h("ul", null,
        tareas.map((t) => h("li", { key: t.id, "data-id": t.id }, t.titulo)),
      ),
    ),
  );
}

createServer((peticion, respuesta) => {
  if (peticion.method === "GET" && peticion.url === "/") {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end("<!DOCTYPE html>" + renderToStaticMarkup(h(Pagina)));
    return;
  }
  if (peticion.method === "POST" && peticion.url === "/tareas") {
    let cuerpo = "";
    peticion.on("data", (d) => (cuerpo += d));
    peticion.on("end", () => {
      const titulo = new URLSearchParams(cuerpo).get("titulo") ?? "";
      const tarea = { id: String(tareas.length + 1), titulo };
      tareas.push(tarea);
      // La bifurcación: el cliente hidratado pide JSON; el formulario
      // clásico recibe el 303 de la clase 080.
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
