import express from "express";

const app = express();

const TAREAS = [
  { id: "1", titulo: "beta", prioridad: 2, completada: false },
  { id: "2", titulo: "alfa", prioridad: 1, completada: true },
  { id: "3", titulo: "gamma", prioridad: 3, completada: false },
];

// LISTA BLANCA. Es lo único que separa un filtro de una inyección: si el cliente
// puede nombrar cualquier campo, puede ordenar por uno que no debería ver, o
// —con un ORM que traduzca sin filtrar— colar una expresión en la consulta.
const CAMPOS_ORDENABLES = new Set(["titulo", "prioridad"]);
const CAMPOS_FILTRABLES = new Set(["completada", "prioridad"]);

app.get("/tareas", (peticion, respuesta) => {
  let resultado = [...TAREAS];

  for (const [campo, valor] of Object.entries(peticion.query)) {
    if (campo === "orden") continue;
    if (!CAMPOS_FILTRABLES.has(campo)) {
      return respuesta.status(422).json({ code: "CAMPO_NO_FILTRABLE", campo });
    }
    if (campo === "completada") {
      if (valor !== "true" && valor !== "false") {
        return respuesta.status(422).json({ code: "VALOR_INVALIDO", campo });
      }
      resultado = resultado.filter((t) => t.completada === (valor === "true"));
    }
    if (campo === "prioridad") {
      const n = Number(valor);
      if (!Number.isInteger(n)) {
        return respuesta.status(422).json({ code: "VALOR_INVALIDO", campo });
      }
      resultado = resultado.filter((t) => t.prioridad === n);
    }
  }

  const orden = peticion.query.orden;
  if (orden !== undefined) {
    // `-campo` para descendente: una convención extendida y suficiente.
    const descendente = orden.startsWith("-");
    const campo = descendente ? orden.slice(1) : orden;
    if (!CAMPOS_ORDENABLES.has(campo)) {
      return respuesta.status(422).json({ code: "CAMPO_NO_ORDENABLE", campo });
    }
    resultado.sort((a, b) => (a[campo] > b[campo] ? 1 : a[campo] < b[campo] ? -1 : 0));
    if (descendente) resultado.reverse();
  }

  respuesta.json({ elementos: resultado });
});

app.listen(Number(process.env.PORT ?? 3000));
