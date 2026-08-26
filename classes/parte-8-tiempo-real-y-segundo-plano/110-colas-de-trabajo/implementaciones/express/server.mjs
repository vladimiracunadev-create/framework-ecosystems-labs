import express from "express";

/**
 * COLAS DE TRABAJO: SACAR DE LA PETICIÓN LO QUE NO TIENE QUE OCURRIR AHORA.
 *
 * Generar un informe, mandar un correo, redimensionar una imagen, llamar a un
 * proveedor lento. Nada de eso tiene que pasar antes de contestar, y hacerlo
 * dentro de la petición tiene tres consecuencias que se pagan juntas:
 *
 *   - quien pide espera lo que tarde lo lento;
 *   - un fallo del proveedor se convierte en un error de la petición, aunque lo
 *     importante ya estuviera guardado;
 *   - y no hay forma de reintentar sin repetir la petición entera.
 *
 * La respuesta es contestar **202 Aceptado**, decir dónde mirar y hacer el
 * trabajo después. El código de estado importa: un 200 significa «hecho», y esto
 * no está hecho. Es la clase 015 aplicada donde más se nota.
 */

const app = express();
app.use(express.json());

/** Lo que tarda el trabajo. Cuatrocientos milisegundos es poco para un informe
 *  de verdad y bastante para que la diferencia con la respuesta no se pueda
 *  confundir con ruido. */
const TARDANZA_MS = 400;

/**
 * LA COLA, QUE AQUÍ ES UNA LISTA Y EN PRODUCCIÓN NO PUEDE SERLO.
 *
 * Esto es lo mínimo que funciona, y hay que decir en voz alta lo que le falta:
 * **si el proceso se reinicia, la cola se pierde**. Todo lo encolado y no hecho
 * desaparece sin que nadie se entere. Por eso las colas de verdad viven fuera
 * —Redis, RabbitMQ, una tabla de la base de datos— y por eso el JSON de esta
 * clase declara `se_pierde_al_reiniciar: true` en las cuatro implementaciones.
 */
const TRABAJOS = new Map();
let siguienteId = 1;

const esperar = (ms) => new Promise((seguir) => setTimeout(seguir, ms));

/**
 * EL TRABAJADOR. En Node no hace falta un hilo: basta con no esperar la promesa.
 *
 * Y ahí está el detalle que confunde a mucha gente: esto NO es paralelismo. El
 * trabajo corre en el mismo bucle de eventos que atiende las peticiones. Sirve
 * porque lo que tarda es esperar —una consulta, una llamada de red— y no
 * calcular. Un trabajo que consuma procesador de verdad bloquea el servidor
 * igual, y entonces hace falta otro proceso.
 */
function encolar(descripcion) {
  const trabajo = { id: siguienteId, descripcion, estado: "encolada", resultado: null };
  siguienteId += 1;
  TRABAJOS.set(trabajo.id, trabajo);

  (async () => {
    // ESTE `await` DE CERO MILISEGUNDOS NO SOBRA, Y LO DESCUBRIÓ EL CONTRATO.
    //
    // Una función `async` **no empieza a ser asíncrona hasta su primer `await`**:
    // todo lo que haya antes corre síncrono, dentro de la petición que la lanzó.
    // Sin esta línea, el estado ya era «en curso» cuando la respuesta salía, y el
    // caso que exige «encolada» fallaba.
    //
    // Es un detalle pequeño con una consecuencia grande: si lo primero que hace
    // el trabajo es algo costoso y no hay un `await` antes, ese coste se lo come
    // la petición, y la cola no ha servido para nada.
    await esperar(0);
    trabajo.estado = "en curso";
    await esperar(TARDANZA_MS);
    trabajo.estado = "terminada";
    trabajo.resultado = `informe de ${descripcion}`;
  })();

  return trabajo;
}

app.post("/tareas", (peticion, respuesta) => {
  const trabajo = encolar(peticion.body?.descripcion ?? "sin nombre");
  // 202 y no 200: **esto no está hecho**. Y `Location` para que quien pregunta
  // no tenga que inventarse la URL donde mirar.
  respuesta
    .status(202)
    .location(`/tareas/${trabajo.id}`)
    .json({ id: trabajo.id, estado: trabajo.estado });
});

app.get("/tareas/:id", (peticion, respuesta) => {
  const trabajo = TRABAJOS.get(Number(peticion.params.id));
  if (!trabajo) return respuesta.status(404).json({ error: "no existe" });
  respuesta.json(trabajo);
});

/**
 * LA MEDICIÓN: LO QUE TARDA LA RESPUESTA CONTRA LO QUE TARDA EL TRABAJO.
 *
 * Es la única forma de demostrar que la petición no espera, porque el resultado
 * final es el mismo con cola y sin ella. Se encola, se cronometra la respuesta,
 * y luego se pregunta hasta que esté.
 */
app.get("/cola.json", async (peticion, respuesta) => {
  const origen = `http://${peticion.headers.host}`;

  const inicio = Date.now();
  const encolada = await fetch(`${origen}/tareas`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ descripcion: "ventas de marzo" }),
  });
  const msHastaLaRespuesta = Date.now() - inicio;
  const { id } = await encolada.json();

  let estado = "encolada";
  while (estado !== "terminada" && Date.now() - inicio < 5000) {
    await esperar(20);
    estado = (await (await fetch(`${origen}/tareas/${id}`)).json()).estado;
  }
  const msHastaTerminar = Date.now() - inicio;

  respuesta.json({
    framework: "express",
    estado_de_la_respuesta: encolada.status,
    tardanza_del_trabajo_ms: TARDANZA_MS,
    ms_hasta_la_respuesta: msHastaLaRespuesta,
    ms_hasta_terminar: msHastaTerminar,
    // La respuesta tiene que llegar muy por debajo de lo que tarda el trabajo.
    // La mitad es un margen de sobra para cualquier maquina.
    la_respuesta_no_espera: msHastaLaRespuesta < TARDANZA_MS / 2,
    se_pierde_al_reiniciar: true,
    donde_vive_la_cola: "un Map en la memoria del proceso",
    como_se_encola: "una funcion async cuya promesa no se espera: el bucle de eventos la sigue",
    es_paralelismo: false,
    que_haria_falta_en_produccion:
      "una cola fuera del proceso —Redis, RabbitMQ, una tabla— para que un reinicio no borre lo pendiente",
  });
});

app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
