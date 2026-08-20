import express from "express";

const app = express();
app.use(express.json());

const tareas = new Map();
// Clave de idempotencia → respuesta ya emitida. En producción esto vive en un
// almacén compartido con caducidad, no en memoria: con dos instancias, cada una
// tendría su propio registro y la garantía desaparecería.
const respuestas = new Map();
let siguiente = 1;

app.post("/tareas", (peticion, respuesta) => {
  const clave = peticion.get("idempotency-key");

  // Sin clave, POST se comporta como POST: cada llamada crea otra.
  if (!clave) {
    const creada = crear(peticion.body?.titulo);
    return respuesta.status(201).json(creada);
  }

  const previa = respuestas.get(clave);
  if (previa) {
    // Se devuelve LA MISMA respuesta, con el mismo código y el mismo cuerpo.
    // Y se declara que fue un reenvío: el cliente puede distinguirlo si quiere.
    return respuesta.status(previa.estado).set("idempotent-replay", "true").json(previa.cuerpo);
  }

  const creada = crear(peticion.body?.titulo);
  respuestas.set(clave, { estado: 201, cuerpo: creada });
  respuesta.status(201).json(creada);
});

function crear(titulo) {
  const id = String(siguiente++);
  const tarea = { id, titulo: titulo ?? "" };
  tareas.set(id, tarea);
  return tarea;
}

app.get("/tareas", (peticion, respuesta) => respuesta.json({ total: tareas.size }));

app.listen(Number(process.env.PORT ?? 3000));
