import { createHash } from "node:crypto";
import express from "express";

const app = express();
app.use(express.json());

let tarea = { id: "1", titulo: "original" };

// La etiqueta identifica una VERSIÓN del recurso. Aquí se deriva del contenido,
// que es lo más simple y siempre correcto; con datos grandes se usa un número de
// versión de la fila, para no tener que leerla entera y resumirla.
function etiqueta(valor) {
  return `"${createHash("sha256").update(JSON.stringify(valor)).digest("hex").slice(0, 16)}"`;
}

app.get("/tareas/1", (peticion, respuesta) => {
  const actual = etiqueta(tarea);
  respuesta.set("etag", actual);

  // (1) AHORRO DE ANCHO DE BANDA: si el cliente ya tiene esta versión, 304 sin
  // cuerpo. El servidor hace el trabajo igual; lo que se ahorra es el envío.
  if (peticion.get("if-none-match") === actual) {
    return respuesta.status(304).end();
  }
  respuesta.json(tarea);
});

app.put("/tareas/1", (peticion, respuesta) => {
  const actual = etiqueta(tarea);
  const exigida = peticion.get("if-match");

  // (2) PROTECCIÓN CONTRA SOBRESCRITURA CIEGA. Sin esto, dos clientes que leen
  // y escriben a la vez producen la actualización perdida: el segundo pisa al
  // primero sin enterarse ninguno de los dos.
  if (exigida === undefined) {
    return respuesta.status(428).json({ code: "PRECONDICION_REQUERIDA" });
  }
  if (exigida !== actual) {
    return respuesta.status(412).json({ code: "PRECONDICION_FALLIDA" });
  }

  tarea = { id: "1", titulo: peticion.body?.titulo ?? "" };
  respuesta.set("etag", etiqueta(tarea)).json(tarea);
});

app.listen(Number(process.env.PORT ?? 3000));
