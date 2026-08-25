/**
 * EL «COMPONENTE» DE ALPINE: marcado con dos atributos.
 *
 * Alpine no tiene archivos de componente ni funciones de render. Un componente
 * es **un trozo de HTML con `x-data`**, y el ámbito de esa variable es ese
 * elemento y todo lo que cuelga de él.
 *
 * Esto tiene una consecuencia que la clase quiere dejar clara: el componente de
 * Alpine **no se renderiza en el servidor**, porque no hay nada que renderizar.
 * Lo que el servidor manda es el marcado; Alpine lo despierta en el navegador.
 *
 * Por eso el texto aparece DOS VECES:
 *
 *   - dentro de `x-data`, para que Alpine lo tenga como estado;
 *   - y dentro del `<h1>`, para que se vea antes de que cargue Alpine.
 *
 * No es duplicación por descuido: es mejora progresiva, la clase 081 aplicada al
 * modelo de Alpine. La página funciona sin JavaScript y mejora con él.
 */

/**
 * DOS CONTEXTOS, DOS ESCAPADOS.
 *
 * El mismo texto va a un atributo de HTML y al contenido de un elemento, y no
 * se escapan igual: dentro de un atributo entrecomillado, la comilla cierra el
 * atributo; dentro del texto, no significa nada.
 *
 * Los frameworks que renderizan lo resuelven solos porque saben en qué contexto
 * están poniendo cada valor. Aquí lo sabe quien escribe la plantilla — y ese es
 * exactamente el hueco por donde entran los fallos de la clase 073.
 */
function paraAtributo(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function paraTexto(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function saludo(texto = "Hola, mundo") {
  const estado = paraAtributo(JSON.stringify({ texto }));
  return `<div x-data="${estado}"><h1 data-componente="saludo" x-text="texto">${paraTexto(texto)}</h1></div>`;
}
