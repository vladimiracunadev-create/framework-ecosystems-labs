/**
 * EL ALMACÉN, IDÉNTICO EN LAS CINCO IMPLEMENTACIONES.
 *
 * En memoria y sin base de datos: lo que esta clase compara es **cómo llega la
 * escritura al servidor**, no dónde se guarda. La parte 4 ya se ocupó de lo
 * segundo.
 *
 * `crear` devuelve `null` si el texto viene vacío, y ese `null` es la mitad del
 * contrato: el formulario vacío no puede añadir una tarea en blanco por muy
 * bonita que sea la sintaxis del framework.
 */
const TAREAS = [
  { id: 1, texto: "comprar pan" },
  { id: 2, texto: "regar las plantas" },
  { id: 3, texto: "llamar al fontanero" },
];

let siguienteId = 4;

export function listar() {
  return TAREAS;
}

export function crear(texto) {
  const limpio = String(texto ?? "").trim();
  if (!limpio) return null;
  const tarea = { id: siguienteId, texto: limpio };
  siguienteId += 1;
  TAREAS.push(tarea);
  return tarea;
}
