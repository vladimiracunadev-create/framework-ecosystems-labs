/**
 * EL CONTENIDO, IDÉNTICO EN LAS TRES PANTALLAS, y el sello que las distingue.
 */
export const TAREAS = ["comprar pan", "regar las plantas", "llamar al taller"];

export function sello() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * EL SELLO «DE CONSTRUCCIÓN» DE REMIX.
 *
 * Se calcula al evaluar este módulo, es decir una sola vez por proceso, y por
 * eso no cambia entre peticiones. Es lo más parecido a lo estático que Remix
 * ofrece sin poner una caché delante — y la clase lo dice en lugar de fingir que
 * hay prerenderizado.
 */
export const SELLO_DE_ARRANQUE = sello();
