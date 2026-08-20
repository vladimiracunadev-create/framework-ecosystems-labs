import express from "express";

const app = express();
app.use(express.json());

// El esquema como DATO, no como código. Se puede leer, publicar, versionar y
// comparar; un `if` no.
const ESQUEMA_TAREA = {
  type: "object",
  required: ["titulo"],
  additionalProperties: false,
  properties: {
    titulo: { type: "string", minLength: 1, maxLength: 120 },
    prioridad: { type: "integer", enum: [1, 2, 3] },
  },
};

// Intérprete mínimo de la parte del esquema que usa esta clase. En un proyecto
// real se usa una biblioteca de JSON Schema; aquí está escrito a mano para que
// se vea que un esquema es un ÁRBOL DE DATOS que alguien recorre.
function validar(esquema, valor) {
  const errores = [];
  if (esquema.type === "object") {
    if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
      return [{ campo: "cuerpo", codigo: "TIPO" }];
    }
    for (const requerido of esquema.required ?? []) {
      if (!(requerido in valor)) errores.push({ campo: requerido, codigo: "REQUERIDO" });
    }
    if (esquema.additionalProperties === false) {
      for (const clave of Object.keys(valor)) {
        if (!(clave in esquema.properties)) {
          errores.push({ campo: clave, codigo: "DESCONOCIDO" });
        }
      }
    }
    for (const [clave, sub] of Object.entries(esquema.properties ?? {})) {
      if (!(clave in valor)) continue;
      errores.push(...validar(sub, valor[clave]).map((e) => ({ ...e, campo: clave })));
    }
    return errores;
  }

  if (esquema.type === "string") {
    if (typeof valor !== "string") return [{ campo: "", codigo: "TIPO" }];
    if (esquema.minLength !== undefined && valor.length < esquema.minLength) {
      return [{ campo: "", codigo: "REQUERIDO" }];
    }
    if (esquema.maxLength !== undefined && valor.length > esquema.maxLength) {
      return [{ campo: "", codigo: "LONGITUD" }];
    }
    return [];
  }

  if (esquema.type === "integer") {
    if (!Number.isInteger(valor)) return [{ campo: "", codigo: "TIPO" }];
    if (esquema.enum && !esquema.enum.includes(valor)) return [{ campo: "", codigo: "VALOR" }];
    return [];
  }

  return [];
}

app.post("/tareas", (peticion, respuesta) => {
  const errores = validar(ESQUEMA_TAREA, peticion.body);
  if (errores.length > 0) {
    return respuesta.status(422).type("application/problem+json").json({
      type: "about:blank", title: "la entrada no es valida", status: 422,
      code: "VALIDACION", errors: errores,
    });
  }
  respuesta.status(201).json({ titulo: peticion.body.titulo });
});

// El esquema se PUBLICA: el cliente puede leerlo y validar antes de enviar.
app.get("/esquemas/tarea", (peticion, respuesta) => respuesta.json(ESQUEMA_TAREA));

app.listen(Number(process.env.PORT ?? 3000));
