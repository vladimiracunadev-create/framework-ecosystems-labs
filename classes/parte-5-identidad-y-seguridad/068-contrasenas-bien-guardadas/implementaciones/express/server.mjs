import express from "express";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());

// Usuario → resumen bcrypt. La contraseña en claro no se guarda NUNCA: entra,
// se resume, y la variable muere. Lo único persistente es el resumen.
const usuarios = new Map();

// El coste es el parámetro que envejece bien: subirlo encarece cada intento
// del atacante sin tocar el código. 12 es el suelo razonable hoy; el resumen
// lo lleva escrito, así que se puede subir mañana y re-resumir al entrar.
const COSTE = 12;

// Resumen señuelo para usuarios inexistentes: verificar contra él cuesta lo
// mismo que verificar de verdad, y así el tiempo de respuesta no delata qué
// usuarios existen.
const SENUELO = bcrypt.hashSync("senuelo-que-nunca-coincide", COSTE);

app.post("/usuarios", (peticion, respuesta) => {
  const { usuario, clave } = peticion.body ?? {};
  if (!usuario || !clave) {
    return respuesta.status(422).json({ error: "faltan-campos" });
  }
  if (usuarios.has(usuario)) {
    return respuesta.status(409).json({ error: "ya-existe" });
  }
  const resumen = bcrypt.hashSync(clave, COSTE);
  usuarios.set(usuario, resumen);
  // Devolver el resumen es la ventana de inspección del laboratorio: el
  // contrato mide que dos claves iguales producen resúmenes distintos. En
  // producción, el resumen no sale de la base de datos.
  respuesta.status(201).json({ usuario, resumen });
});

app.post("/entrar", (peticion, respuesta) => {
  const { usuario, clave } = peticion.body ?? {};
  const resumen = usuarios.get(usuario) ?? SENUELO;
  const coincide = bcrypt.compareSync(clave ?? "", resumen);
  if (!coincide || !usuarios.has(usuario)) {
    // Un solo mensaje para «no existe» y «clave mala»: distinguirlos regalaría
    // la lista de usuarios.
    return respuesta.status(401).json({ error: "credenciales-invalidas" });
  }
  respuesta.json({ usuario });
});

app.listen(Number(process.env.PORT ?? 3000));
