import express from "express";

const app = express();
app.use(express.json());

// Las reglas en un solo sitio: el manejador solo las aplica. Sin esto, cada
// ruta que acepte una tarea repite las mismas cuatro comprobaciones.
const REGLAS = { tituloMin: 1, tituloMax: 120 };

function validar(cuerpo) {
  const titulo = cuerpo?.titulo;
  if (typeof titulo !== "string") return "titulo debe ser texto";
  if (titulo.trim().length < REGLAS.tituloMin) return "titulo no puede estar vacío";
  if (titulo.length > REGLAS.tituloMax) return "titulo no puede pasar de 120 caracteres";
  if (cuerpo.completada !== undefined && typeof cuerpo.completada !== "boolean") {
    return "completada debe ser booleano";
  }
  return null;
}

app.post("/tareas", (peticion, respuesta) => {
  const error = validar(peticion.body);
  if (error) return respuesta.status(422).json({ error });

  respuesta.status(201).json({
    titulo: peticion.body.titulo.trim(),
    completada: peticion.body.completada ?? false,
  });
});

app.listen(Number(process.env.PORT ?? 3000));
