/**
 * EL CONTENIDO, IDÉNTICO EN LAS TRES PANTALLAS.
 *
 * Es a propósito: si el contenido cambiara, la comparación mediría el contenido
 * en lugar de la estrategia. Lo único que distingue a las tres es CUÁNDO se
 * genera el HTML que lo contiene.
 */
export const TAREAS = ["comprar pan", "regar las plantas", "llamar al taller"];

/**
 * EL SELLO: la marca que delata cuándo se generó esta página.
 *
 * En la estática se calcula una vez, al construir, y queda escrito en el archivo
 * para siempre. En la de servidor se calcula en cada petición. El contrato pide
 * cada pantalla dos veces y compara: mismo sello significa generada al
 * construir; sello distinto, generada ahora.
 *
 * Es la única forma de demostrar la diferencia, porque el contenido de las dos
 * respuestas es idéntico.
 */
export function sello() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
