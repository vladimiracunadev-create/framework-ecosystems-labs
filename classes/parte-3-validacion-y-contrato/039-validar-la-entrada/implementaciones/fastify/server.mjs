import Fastify from "fastify";

const app = Fastify({ ajv: { customOptions: { allErrors: false } } });

// El esquema ES la validación: el manejador recibe datos que ya cumplen.
const esquema = {
  body: {
    type: "object",
    required: ["titulo"],
    properties: {
      titulo: { type: "string", minLength: 1, maxLength: 120 },
      completada: { type: "boolean", default: false },
    },
  },
};

app.post("/tareas", { schema: esquema }, (peticion, respuesta) => {
  // El esquema comprueba `minLength: 1` sobre el texto CRUDO: "     " tiene
  // cinco caracteres y pasa. JSON Schema no recorta espacios, así que la regla
  // de "no vacío tras recortar" hay que escribirla aparte.
  //
  // Es la limitación de fondo de validar por esquema: cubre la FORMA del dato,
  // no las reglas del dominio.
  const titulo = peticion.body.titulo.trim();
  if (titulo.length === 0) {
    return respuesta.code(422).send({ error: "titulo no puede estar vacío" });
  }

  respuesta.code(201).send({ titulo, completada: peticion.body.completada ?? false });
});

app.setErrorHandler((error, peticion, respuesta) => {
  const estado = error.validation ? 422 : (error.statusCode ?? 500);
  respuesta.code(estado).send({ error: error.message });
});

await app.listen({ port: Number(process.env.PORT ?? 3000), host: "127.0.0.1" });
