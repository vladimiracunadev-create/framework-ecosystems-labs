import express from "express";

// Las claves que la aplicación necesita para arrancar. Ninguna tiene valor
// por omisión: un secreto con valor por defecto es un secreto que alguien
// olvidó poner y que corre en producción con la clave del ejemplo.
const REQUERIDAS = ["APP_ENTORNO", "APP_SECRETO"];

// El validador. Devuelve TODAS las que faltan, no la primera: quien arranca
// con tres variables sin poner no quiere descubrirlas de una en una, tres
// despliegues fallidos seguidos.
function validar(fuente) {
  const faltan = REQUERIDAS.filter((clave) => !fuente[clave]);
  return { valida: faltan.length === 0, faltan };
}

// El arranque usa EL MISMO validador. Si falta algo, el proceso no escucha:
// muere aquí, con un mensaje que nombra las claves. Fallar al arrancar es la
// única forma de no fallar en la primera petición del primer usuario.
const arranque = validar(process.env);
if (!arranque.valida) {
  console.error(`Configuración incompleta, faltan: ${arranque.faltan.join(", ")}`);
  process.exit(1);
}

const config = {
  entorno: process.env.APP_ENTORNO,
  secreto: process.env.APP_SECRETO,
};

const app = express();
app.use(express.json());

app.get("/configuracion", (peticion, respuesta) => {
  // El secreto NUNCA sale: se reporta su presencia, no su valor. Un endpoint
  // de configuración que filtra el secreto es el propio agujero que la clase
  // viene a cerrar.
  respuesta.json({
    entorno: config.entorno,
    secreto_presente: Boolean(config.secreto),
    secreto: "****",
  });
});

app.post("/validar", (peticion, respuesta) => {
  const resultado = validar(peticion.body ?? {});
  if (!resultado.valida) {
    return respuesta.status(422).json({ valida: false, faltan: resultado.faltan });
  }
  respuesta.json({ valida: true });
});

app.listen(Number(process.env.PORT ?? 3000));
