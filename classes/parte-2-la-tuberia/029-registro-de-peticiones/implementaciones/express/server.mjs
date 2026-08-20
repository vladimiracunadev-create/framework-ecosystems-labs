import express from "express";

const app = express();
const registro = [];

// Una línea por petición con lo que sirve para diagnosticar: método, ruta,
// estado y duración. El estado NO se conoce al entrar, así que la línea se
// emite al terminar la respuesta.
app.use((peticion, respuesta, siguiente) => {
  const inicio = process.hrtime.bigint();
  respuesta.on("finish", () => {
    // Mirar el registro no es tráfico de la aplicación: contarlo lo ensuciaría.
    if (peticion.path === "/registro") return;
    const ms = Number(process.hrtime.bigint() - inicio) / 1e6;
    registro.push({
      metodo: peticion.method,
      ruta: peticion.path,
      estado: respuesta.statusCode,
      // Se redondea para que el contrato sea determinista; en producción se
      // emitiría el valor real.
      medido: ms >= 0,
    });
  });
  siguiente();
});

app.get("/ok", (peticion, respuesta) => respuesta.json({ ok: true }));
app.get("/falla", (peticion, respuesta) => respuesta.status(500).json({ error: "roto" }));
app.get("/registro", (peticion, respuesta) => respuesta.json({ registro }));

app.listen(Number(process.env.PORT ?? 3000));
