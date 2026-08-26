import express from "express";

/**
 * EVENTOS DE DOMINIO: DESACOPLAR LO QUE OCURRIÓ DE QUIÉN REACCIONA.
 *
 * El alta de un usuario acaba arrastrando cosas: mandar la bienvenida, contarlo
 * en las estadísticas, avisar a ventas, crear la carpeta. Si todo eso se escribe
 * dentro del manejador del alta, pasan tres cosas:
 *
 *   - el alta pasa a saber de correo, de métricas y de ventas;
 *   - añadir una reacción obliga a tocar el alta;
 *   - y un fallo en la cuarta reacción rompe el alta, que ya estaba hecha.
 *
 * La alternativa es que el alta diga **qué pasó** —«se creó un usuario»— y que
 * quien tenga algo que hacer con eso se suscriba. Ese cambio de dirección es
 * todo: el emisor deja de conocer a los consumidores.
 *
 * Y trae un problema nuevo que hay que mirar de frente: **si un consumidor
 * falla, ¿qué?**. Aquí está resuelto de la forma mínima —se captura y se sigue—
 * y eso tiene una consecuencia que se declara: el fallo se pierde. En un sistema
 * de verdad, un consumidor que falla se reintenta —clase 112— y para eso el
 * evento tiene que estar guardado en algún sitio, no solo en memoria.
 */

const app = express();
app.use(express.json());

/** LO QUE PASA CUANDO ALGO PASA. Una lista de funciones por nombre de evento:
 *  esto es un bus de eventos, y no hace falta más. */
const SUSCRIPTORES = new Map();

function suscribir(evento, nombre, reaccion) {
  if (!SUSCRIPTORES.has(evento)) SUSCRIPTORES.set(evento, []);
  SUSCRIPTORES.get(evento).push({ nombre, reaccion });
}

/**
 * PUBLICAR: avisar a todos, y que el fallo de uno no arrastre a los demás.
 *
 * El `try` de dentro del bucle es la línea más importante del archivo. Sin él,
 * el primer consumidor que reviente deja sin ejecutar a los siguientes y devuelve
 * el error a quien publicó — es decir, rompe el alta por culpa de un correo.
 */
function publicar(evento, datos) {
  const fallidos = [];
  for (const { nombre, reaccion } of SUSCRIPTORES.get(evento) ?? []) {
    try {
      reaccion(datos);
    } catch (error) {
      fallidos.push(nombre);
    }
  }
  return fallidos;
}

let USUARIOS = [];
let CORREOS = [];
let ALTAS_CONTADAS = 0;
let FALLIDOS = [];

// LOS DOS CONSUMIDORES, INDEPENDIENTES. Ninguno sabe del otro, y el alta no sabe
// de ninguno.
suscribir("usuario.creado", "bienvenida", (usuario) => {
  CORREOS.push(`bienvenida a ${usuario.nombre}`);
});
suscribir("usuario.creado", "estadisticas", () => {
  ALTAS_CONTADAS += 1;
});

app.post("/usuarios", (peticion, respuesta) => {
  const usuario = { id: USUARIOS.length + 1, nombre: peticion.body?.nombre ?? "sin nombre" };
  USUARIOS.push(usuario);
  // El alta hace lo suyo y anuncia lo que pasó. No sabe quién escucha.
  FALLIDOS = publicar("usuario.creado", usuario);
  respuesta.status(201).json(usuario);
});

app.get("/efectos", (peticion, respuesta) => {
  respuesta.json({
    usuarios: USUARIOS.length,
    correos_enviados: CORREOS.length,
    altas_contadas: ALTAS_CONTADAS,
    correos: CORREOS,
    consumidores_fallidos: FALLIDOS,
  });
});

app.get("/eventos.json", async (peticion, respuesta) => {
  const origen = `http://${peticion.headers.host}`;
  const reiniciar = () => {
    USUARIOS = [];
    CORREOS = [];
    ALTAS_CONTADAS = 0;
    FALLIDOS = [];
  };
  const alta = async (nombre) => {
    await fetch(`${origen}/usuarios`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    return (await (await fetch(`${origen}/efectos`)).json());
  };

  // 1. Los dos consumidores reaccionan a la misma alta.
  reiniciar();
  const conLosDos = await alta("Ada");

  // 2. UN CONSUMIDOR ROTO NO ROMPE A LOS DEMÁS NI A QUIEN PUBLICÓ.
  //
  // Es la prueba que decide si esto sirve en producción: se mete un tercero que
  // revienta siempre, y se comprueba que los otros dos siguen haciendo lo suyo y
  // que el alta sigue devolviendo 201.
  suscribir("usuario.creado", "roto", () => {
    throw new Error("este consumidor esta roto");
  });
  reiniciar();
  const respuestaDelAlta = await fetch(`${origen}/usuarios`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ nombre: "Grace" }),
  });
  const conUnoRoto = await (await fetch(`${origen}/efectos`)).json();

  // 3. Quitar un consumidor no toca al emisor: se quita el roto y ya está.
  SUSCRIPTORES.set(
    "usuario.creado",
    SUSCRIPTORES.get("usuario.creado").filter((s) => s.nombre !== "roto"),
  );
  reiniciar();
  const sinElRoto = await alta("Alan");

  respuesta.json({
    framework: "express",
    consumidores: 2,
    los_dos_reaccionaron:
      conLosDos.correos_enviados === 1 && conLosDos.altas_contadas === 1,
    un_consumidor_roto_no_rompe_a_los_demas:
      conUnoRoto.correos_enviados === 1 && conUnoRoto.altas_contadas === 1,
    la_peticion_no_falla: respuestaDelAlta.status === 201,
    quitar_un_consumidor_no_toca_al_emisor:
      sinElRoto.correos_enviados === 1 && sinElRoto.altas_contadas === 1,
    el_emisor_no_conoce_a_los_consumidores: true,
    como_se_publica: "una funcion publicar() sobre un Map de suscriptores: quince lineas",
    como_se_suscribe: "llamando a suscribir() con el nombre del evento",
    es_sincrono: true,
    que_pasa_si_un_consumidor_falla:
      "se captura y se sigue; el fallo se PIERDE, y para reintentarlo el evento "
      + "tendria que estar guardado en algun sitio",
    que_haria_falta_en_produccion:
      "guardar el evento antes de publicarlo, para poder reintentar al consumidor que fallo",
  });
});

app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
