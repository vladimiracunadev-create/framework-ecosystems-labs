import express from "express";

const app = express();

// Los DOS usuarios tienen el mismo rol. Esa es la trampa de la clase: una
// comprobación por rol los deja pasar a los dos, y la tarea de una no es
// asunto del otro. El rol responde «qué clase de usuario eres»; aquí la
// pregunta es «¿es tuyo ESTE dato?» — y esa se responde en la consulta.
const USUARIOS = new Map([
  ["ana", { clave: "secreta123", rol: "usuaria" }],
  ["luis", { clave: "secreta123", rol: "usuaria" }],
]);

const tareas = new Map([
  ["1", { id: "1", titulo: "preparar informe", propietaria: "ana" }],
  ["2", { id: "2", titulo: "revisar contrato", propietaria: "luis" }],
]);

// La pieza central de la clase: buscar SIEMPRE con el propietario en la
// condición. No es «buscar y luego comprobar»: es que para este usuario, la
// tarea ajena directamente NO SE ENCUENTRA. En una base de datos sería
// `WHERE id = ? AND propietaria = ?` — el mismo gesto.
function buscar(id, usuario) {
  const tarea = tareas.get(id);
  return tarea && tarea.propietaria === usuario ? tarea : null;
}

function autenticar(peticion) {
  const cabecera = peticion.get("authorization") ?? "";
  if (!cabecera.startsWith("Basic ")) return null;
  const texto = Buffer.from(cabecera.slice("Basic ".length), "base64").toString("utf8");
  const separador = texto.indexOf(":");
  if (separador < 0) return null;
  const usuario = texto.slice(0, separador);
  const registrado = USUARIOS.get(usuario);
  return registrado && registrado.clave === texto.slice(separador + 1) ? usuario : null;
}

app.use((peticion, respuesta, siguiente) => {
  const usuario = autenticar(peticion);
  if (!usuario) {
    return respuesta
      .status(401)
      .set("WWW-Authenticate", 'Basic realm="laboratorio"')
      .json({ error: "no-autenticado" });
  }
  peticion.usuario = usuario;
  siguiente();
});

app.get("/tareas", (peticion, respuesta) => {
  const mias = [...tareas.values()].filter((t) => t.propietaria === peticion.usuario);
  respuesta.json({ total: mias.length, tareas: mias });
});

app.get("/tareas/:id", (peticion, respuesta) => {
  const tarea = buscar(peticion.params.id, peticion.usuario);
  // 404 y no 403: un 403 confirmaría que la tarea EXISTE, y los
  // identificadores son enumerables. La ajena y la inexistente tienen que
  // ser indistinguibles.
  if (!tarea) return respuesta.status(404).json({ error: "no-encontrada" });
  respuesta.json(tarea);
});

app.delete("/tareas/:id", (peticion, respuesta) => {
  const tarea = buscar(peticion.params.id, peticion.usuario);
  if (!tarea) return respuesta.status(404).json({ error: "no-encontrada" });
  tareas.delete(tarea.id);
  respuesta.status(204).end();
});

app.listen(Number(process.env.PORT ?? 3000));
