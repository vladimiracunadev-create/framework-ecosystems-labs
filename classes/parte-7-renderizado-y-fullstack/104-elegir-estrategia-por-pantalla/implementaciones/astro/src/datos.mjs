/**
 * UN PRODUCTO CON TRES PANTALLAS, Y UNA SOLA APLICACIÓN.
 *
 * Es la diferencia con la clase 093, donde tres pantallas enseñaban tres
 * estrategias sobre el mismo contenido para poder compararlas. Aquí el contenido
 * es distinto en cada una **porque las tres pantallas son distintas de verdad**,
 * y la estrategia de cada una sale de lo que esa pantalla es:
 *
 *   - El catálogo lo ve todo el mundo, es igual para todos y cambia cuando se
 *     publica. → estático.
 *   - El panel es de quien ha entrado, cambia a cada minuto y no se puede
 *     cachear. → servidor.
 *   - El editor está detrás de un acceso, nadie lo comparte y lo que importa es
 *     la interacción, no el primer pintado. → cliente.
 *
 * Ninguna de las tres decisiones es del framework. Las tres salen de tres
 * preguntas sobre el producto, y esas preguntas están en el `decisiones.json`
 * de cada implementación.
 */
export const PRODUCTOS = ["pan de masa madre", "aceite de oliva", "queso curado"];

/** Lo que el panel enseña: cifras que cambian mientras se mira. */
export function ventasDeHoy() {
  return { pedidos: 12, importe: 348 };
}

/**
 * EL SELLO: la marca que delata cuándo se generó esta página.
 *
 * En el catálogo se calcula una vez, al construir, y queda escrito en el archivo
 * para siempre. En el panel se calcula en cada petición. El contrato pide las
 * dos pantallas dos veces y compara.
 */
export function sello() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
