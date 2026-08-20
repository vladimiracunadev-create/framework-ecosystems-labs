import express from "express";

// Express se apoya en el mismo `http` de Node: no reemplaza el servidor, lo
// envuelve. Lo que añade es la tabla de rutas, la cadena de middleware y el 404.
const app = express();

app.get("/", (peticion, respuesta) => {
  respuesta.json({ capa: "express" });
});

app.use((peticion, respuesta) => {
  respuesta.status(404).json({ error: "no existe" });
});

app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
