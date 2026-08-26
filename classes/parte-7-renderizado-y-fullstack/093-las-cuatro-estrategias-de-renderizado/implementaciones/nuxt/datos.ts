/**
 * EL CONTENIDO, IDÉNTICO EN LAS TRES PANTALLAS, y el sello que las distingue.
 */
export const TAREAS = ["comprar pan", "regar las plantas", "llamar al taller"];

export function sello(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
