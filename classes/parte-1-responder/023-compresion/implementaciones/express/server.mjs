import express from "express";
import compression from "compression";

const app = express();

// `threshold`: por debajo de ese tamaño no se comprime. Comprimir 20 bytes
// cuesta CPU y puede AGRANDAR la respuesta por la cabecera del formato.
app.use(compression({ threshold: 1024 }));

const largo = "tarea pendiente. ".repeat(400);

app.get("/grande", (peticion, respuesta) => respuesta.type("text/plain").send(largo));
app.get("/pequeno", (peticion, respuesta) => respuesta.type("text/plain").send("corto"));

app.listen(Number(process.env.PORT ?? 3000));
