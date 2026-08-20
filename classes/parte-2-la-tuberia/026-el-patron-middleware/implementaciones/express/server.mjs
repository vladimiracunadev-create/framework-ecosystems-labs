import express from "express";

const app = express();

// La cadena de responsabilidad: cada capa recibe la petición, hace su parte y
// llama a la siguiente. `next()` es la llamada explícita; sin ella, la cadena
// se detiene aquí.
app.use((peticion, respuesta, siguiente) => {
  respuesta.set("x-capa", "intermedia");
  siguiente();
});

app.get("/a", (peticion, respuesta) => respuesta.json({ ruta: "a" }));
app.get("/b", (peticion, respuesta) => respuesta.json({ ruta: "b" }));

app.use((peticion, respuesta) => respuesta.status(404).json({ error: "no existe" }));

app.listen(Number(process.env.PORT ?? 3000));
