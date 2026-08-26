import express from "express";

/**
 * REINTENTAR SIN CAUSAR DAÑO.
 *
 * Las clases anteriores dejaron el sistema lleno de sitios donde algo se
 * reintenta: un cliente que reconecta, una cola que vuelve a coger un trabajo,
 * un temporizador que dispara dos veces. Y hay uno más, el más común de todos:
 * **una respuesta que se perdió**.
 *
 * Ese es el caso que hay que tener en la cabeza. El cobro se hizo, la respuesta
 * no llegó, y quien pidió no tiene forma de distinguir eso de que no se hiciera.
 * Va a reintentar. Y con razón.
 *
 * Hay dos respuestas y son distintas:
 *
 *   - **Reintentar bien**: espera creciente, un tope, y no reintentar lo que no
 *     tiene arreglo —un 400 no mejora por repetirlo—.
 *   - **Que reintentar no haga daño**: es lo de verdad importante, y consiste en
 *     que quien pide traiga una clave, y el servidor recuerde qué contestó a esa
 *     clave.
 *
 * Lo segundo se llama idempotencia y es la única de las dos que arregla el
 * problema. Reintentar bien sin ella solo reparte el daño mejor.
 */

const app = express();
app.use(express.json());

/** Los cobros hechos. Lo que hay que impedir es que esta lista crezca dos veces
 *  por el mismo intento. */
let COBROS = [];

/**
 * LA MEMORIA DE CLAVES, QUE ES TODA LA IDEA.
 *
 * Guarda, por clave, **la respuesta que ya se dio**. No basta con recordar «esta
 * clave ya pasó»: hay que devolver lo mismo, porque quien reintenta necesita el
 * identificador del cobro tanto como el primero.
 *
 * Y tiene que caducar. Una clave guardada para siempre es una fuga de memoria
 * con forma de tabla; una que caduca demasiado pronto deja pasar un reintento
 * tardío. Un día suele ser el valor razonable, y hay que elegirlo a propósito.
 */
const CLAVES = new Map();

app.post("/cobros", (peticion, respuesta) => {
  const clave = peticion.headers["idempotency-key"];
  const importe = Number(peticion.body?.importe ?? 30);

  // SIN CLAVE NO HAY NADA QUE HACER. El servidor no puede distinguir un
  // reintento de un cobro nuevo, y tiene que cobrar. Es correcto y es el motivo
  // de que la clave la ponga QUIEN PIDE: solo él sabe si es lo mismo.
  if (clave && CLAVES.has(clave)) {
    const anterior = CLAVES.get(clave);
    return respuesta.status(200).json({ ...anterior, repetida: true });
  }

  const cobro = { id: `cobro-${COBROS.length + 1}`, importe, estado: "cobrado" };
  COBROS.push(cobro);
  const cuerpo = { ...cobro, repetida: false };
  if (clave) CLAVES.set(clave, cobro);
  respuesta.status(201).json(cuerpo);
});

app.get("/cobros", (peticion, respuesta) => {
  respuesta.json({
    cobros_totales: COBROS.length,
    importe_total: COBROS.reduce((suma, c) => suma + c.importe, 0),
    cobros: COBROS,
  });
});

/** La espera creciente entre reintentos. Sin ella, reintentar es una forma de
 *  tumbar lo que se acaba de caer. */
const ESPERAS_MS = [50, 100, 200];
const esperar = (ms) => new Promise((seguir) => setTimeout(seguir, ms));

/** Una operación que falla las dos primeras veces y funciona a la tercera. Es el
 *  caso normal de un proveedor con un mal rato, no de uno roto. */
function operacionInestable() {
  let intentos = 0;
  return async () => {
    intentos += 1;
    if (intentos < 3) throw new Error("el proveedor no contesta");
    return "hecho";
  };
}

app.get("/idempotencia.json", async (peticion, respuesta) => {
  const origen = `http://${peticion.headers.host}`;
  COBROS = [];
  CLAVES.clear();

  // CON CLAVE: tres peticiones, un cobro.
  for (let i = 0; i < 3; i += 1) {
    await fetch(`${origen}/cobros`, {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": "k-prueba" },
      body: JSON.stringify({ importe: 30 }),
    });
  }
  const conClave = (await (await fetch(`${origen}/cobros`)).json()).cobros_totales;

  // SIN CLAVE: tres peticiones, tres cobros. Y esto no es un fallo del
  // servidor: es lo correcto, porque no puede saber que era el mismo intento.
  COBROS = [];
  CLAVES.clear();
  for (let i = 0; i < 3; i += 1) {
    await fetch(`${origen}/cobros`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ importe: 30 }),
    });
  }
  const sinClave = (await (await fetch(`${origen}/cobros`)).json()).cobros_totales;

  // LOS REINTENTOS, con espera creciente y un tope.
  const intentar = operacionInestable();
  let intentos = 0;
  let resultado = null;
  for (const espera of [0, ...ESPERAS_MS]) {
    if (espera) await esperar(espera);
    intentos += 1;
    try {
      resultado = await intentar();
      break;
    } catch {
      resultado = null;
    }
  }

  respuesta.json({
    framework: "express",
    con_clave_peticiones: 3,
    con_clave_cobros: conClave,
    sin_clave_peticiones: 3,
    sin_clave_cobros: sinClave,
    la_clave_evita_el_duplicado: conClave === 1 && sinClave === 3,
    reintentos: intentos,
    exito_tras_reintentos: resultado === "hecho",
    esperas_ms: ESPERAS_MS,
    la_espera_crece: true,
    donde_se_guarda_la_clave: "un Map en memoria; en produccion, una tabla con indice unico",
    que_hace_falta_para_que_valga:
      "guardar la RESPUESTA y no solo la clave, y ponerle caducidad: sin lo primero el "
      + "reintento se queda sin identificador, sin lo segundo la tabla crece para siempre",
    que_no_se_debe_reintentar: "lo que devuelve 4xx: un 400 no mejora por repetirlo",
  });
});

app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
