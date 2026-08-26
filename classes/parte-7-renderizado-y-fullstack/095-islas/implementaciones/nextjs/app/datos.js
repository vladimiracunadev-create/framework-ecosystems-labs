/**
 * EL CONTENIDO, IDÉNTICO EN LAS TRES IMPLEMENTACIONES.
 *
 * Un artículo que no cambia nunca y una lista de tres tareas. El artículo es la
 * parte grande y muerta de la página —lo que hay en cualquier sitio real: texto,
 * cabecera, pie, navegación— y las tareas son lo poco que necesita responder.
 *
 * Esa proporción es el argumento entero de la arquitectura de islas: en una
 * página normal, la mayor parte del marcado no necesita JavaScript, y hidratarla
 * toda es pagar por algo que nadie va a usar.
 */
export const ARTICULO = [
  "Una página de un periódico es casi toda texto muerto. La cabecera no responde, el pie no responde, el cuerpo del artículo tampoco. Lo único que reacciona es el buscador de arriba y el botón de compartir.",
  "Durante quince años la respuesta a eso fue mandar el marco entero al navegador y revivirlo completo, porque los frameworks de componentes no sabían hacer otra cosa: o hidratabas la aplicación o no tenías interactividad en ninguna parte.",
  "La arquitectura de islas invierte la pregunta. En lugar de preguntar qué se puede quitar de lo que se manda, pregunta qué hay que añadir a lo que no se manda. El resultado es el mismo tipo de página, con una diferencia de una escala de magnitud en lo que llega al navegador.",
  "El nombre viene de una entrada de Katie Sylor-Miller y de un artículo de Jason Miller de 2020, y la idea es más vieja que el nombre: es el barco de Teseo del renderizado, cambiar las tablas de una en una sin tirar el barco.",
];

/** Lo poco que sí necesita responder. */
export const TAREAS = ["comprar pan", "regar las plantas", "llamar al fontanero"];
