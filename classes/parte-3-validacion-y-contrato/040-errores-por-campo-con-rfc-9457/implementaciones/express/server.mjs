import express from "express";

const app = express();
app.use(express.json());

const TIPO = "application/problem+json";

// Se recogen TODOS los errores, no solo el primero. Un formulario con cuatro
// campos mal exige cuatro viajes si el servidor solo informa de uno.
function validar(cuerpo) {
  const errores = [];
  const titulo = cuerpo?.titulo;
  if (typeof titulo !== "string") {
    errores.push({ campo: "titulo", codigo: "TIPO", detalle: "debe ser texto" });
  } else if (titulo.trim() === "") {
    errores.push({ campo: "titulo", codigo: "REQUERIDO", detalle: "no puede estar vacío" });
  } else if (titulo.length > 120) {
    errores.push({ campo: "titulo", codigo: "LONGITUD", detalle: "máximo 120 caracteres" });
  }

  const prioridad = cuerpo?.prioridad;
  if (prioridad !== undefined && ![1, 2, 3].includes(prioridad)) {
    errores.push({ campo: "prioridad", codigo: "VALOR", detalle: "debe ser 1, 2 o 3" });
  }
  return errores;
}

app.post("/tareas", (peticion, respuesta) => {
  const errores = validar(peticion.body);
  if (errores.length > 0) {
    return respuesta.status(422).type(TIPO).json({
      type: "about:blank",
      title: "la entrada no es válida",
      status: 422,
      code: "VALIDACION",
      errors: errores,
    });
  }
  respuesta.status(201).json({ titulo: peticion.body.titulo.trim() });
});

app.listen(Number(process.env.PORT ?? 3000));
