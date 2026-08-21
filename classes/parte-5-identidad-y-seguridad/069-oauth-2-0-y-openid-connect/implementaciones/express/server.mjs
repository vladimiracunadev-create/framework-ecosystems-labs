// Un servidor de autorización MÍNIMO, para ver el flujo de código con PKCE
// paso a paso. En producción no se escribe uno: se despliega Keycloak o se
// contrata; este existe para que cada defensa del protocolo sea medible.
import crypto from "node:crypto";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();
// El endpoint de token recibe formulario, no JSON: lo dice la especificación.
app.use(express.urlencoded({ extended: false }));

const SECRETO = "clave-de-firma-solo-para-el-laboratorio";

// El registro de clientes: la redirect_uri se registra POR ADELANTADO y la
// petición debe traer exactamente la registrada. Es la defensa que impide
// que un atacante pida "mándame el código a mi servidor".
const CLIENTES = new Map([["cliente-demo", { redireccion: "https://app.example/callback" }]]);

// Código → lo que hará falta al canjearlo. Un código es de un solo uso y
// aquí `usado` lo garantiza; en producción, además, caduca en minutos.
const codigos = new Map();

app.get("/autorizar", (peticion, respuesta) => {
  const q = peticion.query;
  const cliente = CLIENTES.get(q.client_id);

  // Cliente desconocido o redirect_uri no registrada: error DIRECTO, sin
  // redirigir. Redirigir el error a una URI no verificada sería entregar
  // datos al sitio del atacante — el fallo clásico de open redirect.
  if (!cliente || q.redirect_uri !== cliente.redireccion) {
    return respuesta.status(400).json({ error: "invalid_request" });
  }

  // Aquí iría la pantalla de login y consentimiento. El laboratorio la
  // salta con un usuario fijo: lo que esta clase mide es la mecánica del
  // código y de PKCE, no el formulario de entrada.
  const destino = new URL(cliente.redireccion);

  // Sin PKCE no hay código. Como la redirect_uri SÍ está verificada, el
  // error viaja de vuelta al cliente, con el state intacto.
  if (q.response_type !== "code" || !q.code_challenge || q.code_challenge_method !== "S256") {
    destino.searchParams.set("error", "invalid_request");
    if (q.state) destino.searchParams.set("state", q.state);
    return respuesta.redirect(302, destino.href);
  }

  const codigo = crypto.randomBytes(24).toString("base64url");
  codigos.set(codigo, {
    reto: q.code_challenge,
    redireccion: q.redirect_uri,
    cliente: q.client_id,
    usado: false,
  });

  destino.searchParams.set("code", codigo);
  // El state vuelve TAL CUAL: es el testigo anti-CSRF del cliente, y el
  // servidor de autorización ni lo interpreta ni lo recuerda.
  if (q.state) destino.searchParams.set("state", q.state);
  respuesta.redirect(302, destino.href);
});

app.post("/token", (peticion, respuesta) => {
  const f = peticion.body ?? {};
  const entrada = codigos.get(f.code);

  const invalido =
    f.grant_type !== "authorization_code" ||
    !entrada ||
    entrada.usado ||
    entrada.cliente !== f.client_id ||
    entrada.redireccion !== f.redirect_uri;

  // PKCE: el resumen del verificador que llega ahora tiene que casar con el
  // reto que llegó al principio. Solo quien INICIÓ el flujo tiene el
  // verificador — un código robado por el camino no se puede canjear.
  const resumen = crypto
    .createHash("sha256")
    .update(String(f.code_verifier ?? ""))
    .digest("base64url");

  if (invalido || resumen !== entrada.reto) {
    // Un código que llega dos veces o con mal verificador se quema: si ya
    // se canjeó, el RFC recomienda revocar lo emitido con él.
    if (entrada) entrada.usado = true;
    return respuesta.status(400).json({ error: "invalid_grant" });
  }

  entrada.usado = true;
  const idToken = jwt.sign(
    { iss: "http://laboratorio.local", sub: "ana", aud: f.client_id },
    SECRETO,
    { algorithm: "HS256", expiresIn: "1h" },
  );
  respuesta.json({
    access_token: crypto.randomBytes(24).toString("base64url"),
    token_type: "Bearer",
    expires_in: 3600,
    id_token: idToken,
  });
});

app.listen(Number(process.env.PORT ?? 3000));
