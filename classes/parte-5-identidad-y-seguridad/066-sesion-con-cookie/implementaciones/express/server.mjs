import express from "express";
import session from "express-session";

const app = express();
app.use(express.json());

// express-session guarda la sesión EN EL SERVIDOR y a la cookie solo viaja el
// identificador, firmado con el secreto. Por eso cerrar sesión puede invalidar
// de verdad: se borra la entrada del almacén y la cookie robada deja de abrir.
app.use(
  session({
    name: "sesion",
    secret: "clave-de-firma-solo-para-el-laboratorio",
    // Sin `resave` ni `saveUninitialized`: una visita anónima no crea sesión,
    // y por tanto no recibe cookie. Menos estado y menos superficie.
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", path: "/" },
  }),
);

const USUARIOS = new Map([["ana", "secreta123"]]);

app.post("/entrar", (peticion, respuesta) => {
  const { usuario, clave } = peticion.body ?? {};
  if (USUARIOS.get(usuario) !== clave) {
    return respuesta.status(401).json({ error: "credenciales-invalidas" });
  }
  // `regenerate` descarta el identificador con el que llegó la petición y
  // emite uno nuevo. Es la defensa contra la fijación de sesión: si un
  // atacante consiguió plantar un identificador antes del inicio de sesión,
  // ese identificador nunca queda autenticado.
  peticion.session.regenerate((error) => {
    if (error) return respuesta.status(500).json({ error: "sesion" });
    peticion.session.usuario = usuario;
    respuesta.json({ usuario });
  });
});

app.get("/perfil", (peticion, respuesta) => {
  if (!peticion.session.usuario) {
    return respuesta.status(401).json({ error: "no-autenticado" });
  }
  respuesta.json({ usuario: peticion.session.usuario });
});

app.post("/salir", (peticion, respuesta) => {
  // Dos gestos, y hacen falta los dos: `destroy` borra la sesión del almacén
  // (la cookie robada deja de valer) y `clearCookie` le dice al navegador que
  // tire la suya. Borrar solo la cookie dejaría la sesión viva en el servidor.
  peticion.session.destroy(() => {
    respuesta.clearCookie("sesion", { path: "/" });
    respuesta.status(204).end();
  });
});

app.listen(Number(process.env.PORT ?? 3000));
