import express from "express";

const app = express();

// 301: movido para siempre. El cliente puede recordar el destino y no volver a
// preguntar. Por eso es peligroso: retirarlo después no siempre funciona.
app.get("/antigua", (peticion, respuesta) => respuesta.redirect(301, "/nueva"));

// 302: movido temporalmente. Históricamente los clientes convertían el POST en
// GET al seguirlo, aunque el estándar no lo decía.
app.get("/temporal", (peticion, respuesta) => respuesta.redirect(302, "/nueva"));

// 307: temporal preservando el método y el cuerpo. Es el que hay que usar hoy
// cuando se redirige algo que no es un GET.
app.post("/temporal-estricta", (peticion, respuesta) => respuesta.redirect(307, "/nueva"));

app.get("/nueva", (peticion, respuesta) => respuesta.json({ destino: "nueva" }));
app.post("/nueva", (peticion, respuesta) => respuesta.json({ destino: "nueva", metodo: "POST" }));

app.listen(Number(process.env.PORT ?? 3000));
