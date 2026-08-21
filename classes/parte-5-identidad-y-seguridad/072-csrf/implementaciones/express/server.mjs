import crypto from "node:crypto";
import express from "express";
import session from "express-session";

// El ataque primero: la víctima está autenticada en este sitio, visita una
// página del atacante, y esa página envía un POST aquí. El navegador ADJUNTA
// LA COOKIE — es su trabajo. Sin más defensa, la petición del atacante es
// indistinguible de una legítima. SameSite=Lax (clase 066) corta la mayoría;
// el testigo sincronizado corta el resto: un valor que el atacante no puede
// leer, porque leer respuestas de otro origen es lo que bloquea el navegador.
//
// El middleware histórico de Express para esto —csurf— está RETIRADO. La
// defensa se compone a mano sobre la sesión, y son quince líneas.
const app = express();
app.use(express.json());
app.use(
  session({
    name: "sesion",
    secret: "clave-de-firma-solo-para-el-laboratorio",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", path: "/" },
  }),
);

const USUARIOS = new Map([["ana", "secreta123"]]);
const cuentas = new Map([["ana", 100]]);

app.post("/entrar", (peticion, respuesta) => {
  const { usuario, clave } = peticion.body ?? {};
  if (USUARIOS.get(usuario) !== clave) {
    return respuesta.status(401).json({ error: "credenciales-invalidas" });
  }
  peticion.session.regenerate((error) => {
    if (error) return respuesta.status(500).json({ error: "sesion" });
    peticion.session.usuario = usuario;
    // El testigo vive EN LA SESIÓN y viaja en el cuerpo de la respuesta —
    // nunca en una cookie sola, que el navegador también adjuntaría solo.
    peticion.session.csrf = crypto.randomBytes(24).toString("base64url");
    respuesta.json({ usuario, csrf: peticion.session.csrf });
  });
});

function conSesion(peticion, respuesta, siguiente) {
  if (!peticion.session.usuario) {
    return respuesta.status(401).json({ error: "no-autenticado" });
  }
  siguiente();
}

// La comprobación CSRF: el testigo del encabezado tiene que ser EL DE ESTA
// SESIÓN. La página del atacante no puede leerlo (mismo origen) ni
// adivinarlo (aleatorio). timingSafeEqual: la comparación en tiempo
// constante de la clase 068.
function conTestigo(peticion, respuesta, siguiente) {
  const recibido = peticion.get("x-csrf-token") ?? "";
  const esperado = peticion.session.csrf ?? "";
  const iguales =
    recibido.length === esperado.length &&
    crypto.timingSafeEqual(Buffer.from(recibido), Buffer.from(esperado));
  if (!esperado || !iguales) {
    return respuesta.status(403).json({ error: "testigo-invalido" });
  }
  siguiente();
}

app.post("/transferir", conSesion, conTestigo, (peticion, respuesta) => {
  const importe = Number(peticion.body?.importe ?? 0);
  const saldo = cuentas.get(peticion.session.usuario) - importe;
  cuentas.set(peticion.session.usuario, saldo);
  respuesta.json({ saldo });
});

// GET no muta y no lleva testigo: la defensa protege las escrituras. Un GET
// que transfiriera dinero sería indefendible — clase 014.
app.get("/saldo", conSesion, (peticion, respuesta) => {
  respuesta.json({ saldo: cuentas.get(peticion.session.usuario) });
});

app.listen(Number(process.env.PORT ?? 3000));
