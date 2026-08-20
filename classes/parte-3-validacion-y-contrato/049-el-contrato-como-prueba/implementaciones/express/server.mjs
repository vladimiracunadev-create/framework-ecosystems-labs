import express from "express";

const app = express();
app.use(express.json());

/**
 * Esta clase no enseña una capacidad nueva: enseña el MÉTODO del programa.
 *
 * Las cuatro implementaciones cumplen el mismo contrato de cinco casos. Ninguna
 * conoce a las otras, ninguna comparte código, y el verificador no sabe qué
 * framework hay al otro lado del socket.
 *
 * Eso es lo que hace comparable la comparación: si las pruebas fueran distintas
 * para cada una, «pasa» significaría cosas distintas.
 */
const tareas = new Map([["1", { id: "1", titulo: "existente", completada: false }]]);
let siguiente = 2;

app.get("/tareas/:id", (peticion, respuesta) => {
  const tarea = tareas.get(peticion.params.id);
  return tarea ? respuesta.json(tarea) : respuesta.status(404).json({ code: "NO_EXISTE" });
});

app.post("/tareas", (peticion, respuesta) => {
  const titulo = peticion.body?.titulo;
  if (typeof titulo !== "string" || titulo.trim() === "") {
    return respuesta.status(422).json({ code: "VALIDACION" });
  }
  const id = String(siguiente++);
  const tarea = { id, titulo: titulo.trim(), completada: false };
  tareas.set(id, tarea);
  respuesta.status(201).location(`/tareas/${id}`).json(tarea);
});

app.delete("/tareas/:id", (peticion, respuesta) => {
  if (!tareas.delete(peticion.params.id)) {
    return respuesta.status(404).json({ code: "NO_EXISTE" });
  }
  respuesta.status(204).end();
});

app.listen(Number(process.env.PORT ?? 3000));
