/**
 * EL «COMPONENTE» DE HTMX: una función que devuelve texto.
 *
 * No hay framework debajo. No hay propiedades declaradas, ni ciclo de vida, ni
 * registro. Hay una función, un argumento y una plantilla de cadena — y eso es
 * suficiente para el modelo entero de htmx, porque el fragmento se genera aquí y
 * el navegador solo lo coloca.
 */

/**
 * EL ESCAPADO, A MANO.
 *
 * Los otros siete frameworks escapan solos al interpolar. Aquí no hay quien lo
 * haga: si esta función no existiera, `<script>` llegaría al navegador como una
 * etiqueta de verdad.
 *
 * No es un descuido del ecosistema — es la consecuencia de que el fragmento sea
 * texto. En un proyecto real esto lo resuelve el motor de plantillas del
 * servidor (Jinja, Blade, ERB, Thymeleaf), que sí escapa por omisión. La clase
 * 073 lo mide en cinco de ellos.
 */
function escapar(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function saludo(texto = "Hola, mundo") {
  return `<h1 data-componente="saludo">${escapar(texto)}</h1>`;
}
