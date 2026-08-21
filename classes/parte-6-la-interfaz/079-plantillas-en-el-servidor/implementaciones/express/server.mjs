import { fileURLToPath } from "node:url";
import express from "express";

const app = express();

// Express no trae motor de plantillas: trae el ENCHUFE para uno. `view engine`
// es un contrato que cumplen EJS, Pug, Handlebars y una docena más — la misma
// filosofía que el resto del framework, y la razón por la que aquí hay una
// dependencia donde Django, Rails y Laravel no la necesitan.
app.set("view engine", "ejs");
// `fileURLToPath` y no `.pathname`: en Windows, `.pathname` devuelve
// `/C:/dev/...` con una barra de más, y el motor no encuentra la plantilla.
app.set("views", fileURLToPath(new URL("./vistas", import.meta.url)));

// La tercera tarea es lo que un usuario escribió en un campo de texto.
const TAREAS = [
  { id: "1", titulo: "comprar pan" },
  { id: "2", titulo: "regar las plantas" },
  { id: "3", titulo: "<script>alerta(1)</script>" },
];

app.get("/tareas", (peticion, respuesta) => respuesta.render("tareas", { tareas: TAREAS }));

// La misma lista por la puerta cruda: `<%- %>` en vez de `<%= %>`.
app.get("/tareas-crudo", (peticion, respuesta) =>
  respuesta.render("tareas-crudo", { tareas: TAREAS }),
);

app.listen(Number(process.env.PORT ?? 3000));
