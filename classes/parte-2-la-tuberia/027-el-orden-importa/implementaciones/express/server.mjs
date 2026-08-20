import express from "express";

const app = express();

// La traza vive EN LA PETICIÓN, no en una variable del módulo. Con estado
// global, dos peticiones simultáneas mezclarían sus trazas — y este contrato lo
// destapó en el primer intento.
function capa(nombre) {
  return (peticion, respuesta, siguiente) => {
    peticion.traza ??= [];
    peticion.traza.push(`entra:${nombre}`);
    siguiente();
    // Lo que se escriba aquí se ejecuta al VOLVER, en orden inverso. No entra
    // en el cuerpo porque para entonces la respuesta ya salió.
  };
}

app.use(capa("uno"));
app.use(capa("dos"));
app.use(capa("tres"));

app.get("/traza", (peticion, respuesta) => {
  peticion.traza.push("manejador");
  respuesta.json({ traza: peticion.traza });
});

app.listen(Number(process.env.PORT ?? 3000));
