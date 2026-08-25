// La inversión de control, hecha medible.
//
// `manejarTrabajo` se define y se REGISTRA, y en este archivo no hay ninguna
// línea que la llame. El contador arranca en cero y sube solo cuando llega una
// petición: la prueba de que quien la invoca es Express y no este código.
import express from "express";

const app = express();

let veces = 0;

// El manejador. Nótese que es una función normal: no hereda de nada, no
// implementa ninguna interfaz y no sabe que existe un framework.
function manejarTrabajo(peticion, respuesta) {
  veces += 1;
  respuesta.type("text/plain").send("hecho");
}

// EL REGISTRO. `app.get` recibe la función y la guarda en la tabla de rutas.
// No la ejecuta: si la ejecutara, el primer caso del contrato —veces = 0 recién
// arrancado— fallaría al instante.
app.get("/trabajo", manejarTrabajo);

// La ventana de inspección del laboratorio: expone el contador para que el
// contrato pueda contar invocaciones desde fuera. No incrementa nada.
app.get("/invocaciones", (peticion, respuesta) => {
  respuesta.json({ veces });
});

// A partir de aquí el control es de Express: acepta conexiones, lee peticiones,
// busca en la tabla y decide a quién llamar. Este archivo ya no vuelve a
// ejecutarse.
app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
