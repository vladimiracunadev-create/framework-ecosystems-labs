import express from "express";
import cors from "cors";

const app = express();

// La lista de orígenes permitidos es EXPLÍCITA. `origin: true` reflejaría
// cualquier origen, que con credenciales equivale a no tener defensa.
const PERMITIDOS = new Set(["https://permitido.example"]);

app.use(
  cors({
    origin: (origen, devolver) => devolver(null, origen !== undefined && PERMITIDOS.has(origen)),
    methods: ["GET", "POST"],
    allowedHeaders: ["content-type", "x-token"],
    maxAge: 600,
    optionsSuccessStatus: 204,
  }),
);

app.get("/datos", (peticion, respuesta) => respuesta.json({ ok: true }));

app.listen(Number(process.env.PORT ?? 3000));
