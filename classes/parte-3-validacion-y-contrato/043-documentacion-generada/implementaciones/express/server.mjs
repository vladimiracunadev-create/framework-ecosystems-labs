import express from "express";

const app = express();
app.use(express.json());

const tareas = new Map([["1", { id: "1", titulo: "existente" }]]);

/**
 * Express NO genera documentación: no hay tipos ni esquemas de los que
 * derivarla. Este documento está escrito a mano, y por eso esta implementación
 * es la que mejor enseña la clase: es la única que PUEDE mentir.
 *
 * Está deliberadamente al lado de las rutas para reducir la distancia. En un
 * proyecto real vive en otro archivo, y la distancia es la que produce la
 * divergencia.
 */
const DOCUMENTO = {
  openapi: "3.1.0",
  info: { title: "Tareas", version: "1.0.0" },
  paths: {
    "/tareas": {
      post: {
        responses: { 201: { description: "Creada" }, 422: { description: "Entrada invalida" } },
      },
    },
    "/tareas/{id}": {
      get: {
        responses: { 200: { description: "La tarea" }, 404: { description: "No existe" } },
      },
    },
  },
};

app.get("/tareas/:id", (peticion, respuesta) => {
  const tarea = tareas.get(peticion.params.id);
  return tarea ? respuesta.json(tarea) : respuesta.status(404).json({ code: "NO_EXISTE" });
});

app.post("/tareas", (peticion, respuesta) => {
  const titulo = peticion.body?.titulo;
  if (typeof titulo !== "string" || titulo.length === 0 || titulo.length > 120) {
    return respuesta.status(422).json({ code: "VALIDACION" });
  }
  const id = String(tareas.size + 1);
  const creada = { id, titulo };
  tareas.set(id, creada);
  respuesta.status(201).json(creada);
});

app.get("/openapi.json", (peticion, respuesta) => respuesta.json(DOCUMENTO));

app.listen(Number(process.env.PORT ?? 3000));
