// EL FRAMEWORK. Compara este archivo con `nodejs/server.mjs`: hacen
// exactamente lo mismo y aquí no hay bucle de decisión, no hay comparación de
// rutas y no hay 404.
//
// Lo que hay es un REGISTRO: le dices a Express qué función quieres para
// `GET /saludo` y quién decide cuándo llamarla es él. Eso es la inversión de
// control, y es lo único que separa una biblioteca de un framework.
import express from "express";

const app = express();

app.get("/saludo", (peticion, respuesta) => {
  // La ruta ya está emparejada, la cadena de consulta ya está separada y el
  // `%20` ya está decodificado: `peticion.query` llega hecho. Las tres cosas
  // que en la versión con la biblioteca hay que escribir.
  const nombre = peticion.query.nombre;
  respuesta.type("text/plain").send(nombre ? `hola ${nombre}` : "hola");
});

// Aquí no hay 404 escrito en ninguna parte, y el contrato lo exige igual.
// Lo emite Express cuando ninguna ruta registrada coincide: es la primera
// decisión que el framework toma por ti sin que le hayas dicho nada.

app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
