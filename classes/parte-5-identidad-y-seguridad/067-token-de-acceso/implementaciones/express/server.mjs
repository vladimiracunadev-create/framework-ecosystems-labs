import express from "express";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

// En producción este secreto viene del entorno (clase 075), es largo y no se
// parece a nada. Con HS256, quien tiene el secreto puede EMITIR tokens, no
// solo verificarlos: si más de un servicio necesita verificar, se cambia a un
// par de claves asimétrico (RS256/EdDSA) y el secreto de firma no sale de
// quien emite.
const SECRETO = "clave-de-firma-solo-para-el-laboratorio";
const USUARIOS = new Map([["ana", "secreta123"]]);

app.post("/token", (peticion, respuesta) => {
  const { usuario, clave } = peticion.body ?? {};
  if (USUARIOS.get(usuario) !== clave) {
    return respuesta.status(401).json({ error: "credenciales-invalidas" });
  }
  // El token lleva lo que el servidor necesitará saber sin consultar nada:
  // quién (sub) y hasta cuándo (exp). No lleva secretos: el cuerpo de un JWT
  // va codificado, NO cifrado — cualquiera que lo tenga puede leerlo.
  const token = jwt.sign({ sub: usuario }, SECRETO, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
  respuesta.json({ token, tipo: "Bearer", expira_en: 3600 });
});

app.get("/informe", (peticion, respuesta) => {
  const cabecera = peticion.get("authorization") ?? "";
  const token = cabecera.startsWith("Bearer ") ? cabecera.slice("Bearer ".length) : "";
  try {
    // `algorithms` FIJA lo que se acepta. Sin esa lista, la biblioteca acepta
    // lo que declare la cabecera del token — y la cabecera la escribe quien
    // ataca: `alg: none` fue exactamente eso.
    const datos = jwt.verify(token, SECRETO, { algorithms: ["HS256"] });
    respuesta.json({ usuario: datos.sub });
  } catch {
    // Alterado, caducado, de otra clave o ausente: al cliente le da igual el
    // matiz y al atacante no hay que dárselo. Un solo 401 para todo.
    respuesta.status(401).json({ error: "token-invalido" });
  }
});

app.listen(Number(process.env.PORT ?? 3000));
