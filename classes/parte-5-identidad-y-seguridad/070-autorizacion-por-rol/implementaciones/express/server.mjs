import express from "express";

const app = express();

// Quién eres (autenticación) y qué puedes (autorización) son dos preguntas
// distintas y aquí viven separadas a propósito: `autenticar` responde la
// primera, `conRol` la segunda. Express no trae ninguna de las dos — este
// archivo ES el framework de autorización, con todo lo que eso implica.
const USUARIOS = new Map([
  ["ana", { clave: "secreta123", rol: "admin" }],
  ["luis", { clave: "secreta123", rol: "lector" }],
]);

const tareas = new Map([
  ["1", { id: "1", titulo: "preparar informe" }],
  ["2", { id: "2", titulo: "revisar contrato" }],
]);

function autenticar(peticion) {
  const cabecera = peticion.get("authorization") ?? "";
  if (!cabecera.startsWith("Basic ")) return null;
  const texto = Buffer.from(cabecera.slice("Basic ".length), "base64").toString("utf8");
  const separador = texto.indexOf(":");
  if (separador < 0) return null;
  const usuario = texto.slice(0, separador);
  const clave = texto.slice(separador + 1);
  const registrado = USUARIOS.get(usuario);
  return registrado && registrado.clave === clave ? { usuario, rol: registrado.rol } : null;
}

// La distinción que la clase mide: 401 es «no sé quién eres» (y se piden
// credenciales); 403 es «sé quién eres y no puedes». Confundirlos rompe a
// los clientes: ante un 401 reintentan con credenciales; ante un 403, no.
function conRol(...roles) {
  return (peticion, respuesta, siguiente) => {
    const actual = autenticar(peticion);
    if (!actual) {
      return respuesta
        .status(401)
        .set("WWW-Authenticate", 'Basic realm="laboratorio"')
        .json({ error: "no-autenticado" });
    }
    if (roles.length && !roles.includes(actual.rol)) {
      return respuesta.status(403).json({ error: "rol-insuficiente" });
    }
    peticion.actual = actual;
    siguiente();
  };
}

app.get("/panel", conRol("admin"), (peticion, respuesta) => {
  respuesta.json({ usuario: peticion.actual.usuario, rol: peticion.actual.rol });
});

// Sin lista de roles: basta estar autenticado. El lector lee.
app.get("/tareas", conRol(), (peticion, respuesta) => {
  respuesta.json({ total: tareas.size });
});

app.delete("/tareas/:id", conRol("admin"), (peticion, respuesta) => {
  tareas.delete(peticion.params.id);
  respuesta.status(204).end();
});

app.listen(Number(process.env.PORT ?? 3000));
