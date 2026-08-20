import express from "express";
import multer from "multer";

const app = express();
const LIMITE = 1024; // bytes, pequeño a propósito para que la prueba sea rápida

// `memoryStorage` con límite: lo importante es que el límite se comprueba
// MIENTRAS se recibe, no después. Sin él, un archivo enorme se carga entero en
// memoria antes de que puedas rechazarlo.
const subida = multer({ storage: multer.memoryStorage(), limits: { fileSize: LIMITE } });

app.post("/subir", subida.single("archivo"), (peticion, respuesta) => {
  if (!peticion.file) {
    return respuesta.status(422).json({ error: "falta el archivo" });
  }
  respuesta.status(201).json({ nombre: peticion.file.originalname, bytes: peticion.file.size });
});

app.use((error, peticion, respuesta, siguiente) => {
  if (error?.code === "LIMIT_FILE_SIZE") {
    return respuesta.status(413).json({ error: "archivo demasiado grande" });
  }
  siguiente(error);
});

app.listen(Number(process.env.PORT ?? 3000));
