import { anotar, reiniciar } from "./registro";

/**
 * LA FUENTE DE DATOS, IDÉNTICA EN LAS CINCO.
 *
 * Tarda diez milisegundos a propósito. Una fuente instantánea no serviría para
 * esta clase: si cargar no cuesta nada, da igual cuándo empiece.
 */
export const TAREAS = [
  { id: 1, texto: "comprar pan", hecha: false },
  { id: 2, texto: "regar las plantas", hecha: false },
  { id: 3, texto: "llamar al fontanero", hecha: true },
];

async function tardarUnPoco() {
  await new Promise((seguir) => setTimeout(seguir, 10));
}

export async function pedirLasTareas() {
  reiniciar();
  anotar("carga:inicio");
  await tardarUnPoco();
  anotar("carga:fin");
  return TAREAS;
}

/** Devuelve `null` si no existe. Quien llama decide qué hacer con eso, y ahí es
 *  donde los cinco frameworks se separan: cada uno tiene su forma de convertir
 *  un `null` en un 404 de verdad. */
export async function pedirUnaTarea(id) {
  reiniciar();
  anotar("carga:inicio");
  await tardarUnPoco();
  anotar("carga:fin");
  return TAREAS.find((t) => String(t.id) === String(id)) ?? null;
}
