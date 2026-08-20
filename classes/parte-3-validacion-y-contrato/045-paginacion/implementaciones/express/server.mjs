import express from "express";

const app = express();

// 25 tareas con identificador ordenado, para que el cursor sea comprobable.
const TAREAS = Array.from({ length: 25 }, (nada, i) => ({
  id: String(i + 1).padStart(3, "0"),
  titulo: `tarea ${i + 1}`,
}));

const LIMITE_OMISION = 10;
const LIMITE_MAX = 50;

function limiteDe(consulta) {
  const bruto = consulta.limite;
  if (bruto === undefined) return LIMITE_OMISION;
  const n = Number(bruto);
  if (!Number.isInteger(n) || n < 1 || n > LIMITE_MAX) return null;
  return n;
}

// (1) POR DESPLAZAMIENTO. Fácil de implementar y de entender, y con dos
// problemas conocidos: la página se desplaza si alguien inserta mientras
// paginas, y el coste crece con el desplazamiento —la base tiene que contar y
// descartar todo lo anterior.
app.get("/tareas", (peticion, respuesta) => {
  const limite = limiteDe(peticion.query);
  if (limite === null) return respuesta.status(422).json({ code: "LIMITE_INVALIDO" });

  const desde = Number(peticion.query.desde ?? 0);
  if (!Number.isInteger(desde) || desde < 0) {
    return respuesta.status(422).json({ code: "DESDE_INVALIDO" });
  }

  respuesta.json({
    elementos: TAREAS.slice(desde, desde + limite),
    total: TAREAS.length,
  });
});

// (2) POR CURSOR. El cursor apunta al ÚLTIMO elemento devuelto, así que la
// página siguiente es "lo que viene después de este". Insertar no desplaza
// nada, y el coste no crece con la profundidad.
app.get("/tareas-cursor", (peticion, respuesta) => {
  const limite = limiteDe(peticion.query);
  if (limite === null) return respuesta.status(422).json({ code: "LIMITE_INVALIDO" });

  const cursor = peticion.query.cursor;
  const inicio = cursor === undefined ? 0 : TAREAS.findIndex((t) => t.id === cursor) + 1;
  if (cursor !== undefined && inicio === 0) {
    return respuesta.status(422).json({ code: "CURSOR_INVALIDO" });
  }

  const elementos = TAREAS.slice(inicio, inicio + limite);
  const siguiente = inicio + limite < TAREAS.length ? elementos.at(-1).id : null;
  respuesta.json({ elementos, siguiente });
});

app.listen(Number(process.env.PORT ?? 3000));
