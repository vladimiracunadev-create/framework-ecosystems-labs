/**
 * CONTAR LAS TAREAS MIRANDO EL HTML, IDÉNTICO EN LAS CINCO.
 *
 * Podría contarse leyendo el almacén directamente, y sería más corto. Se hace
 * así por un motivo: en algunos de los cinco frameworks el manejador de un
 * endpoint y el render de una página comparten memoria, y en otros no. Una
 * comprobación que dependiera de eso mediría el empaquetador en lugar del
 * framework.
 *
 * Contando lo que la página enseña, la cifra significa lo mismo en los cinco:
 * cuántas tareas ve alguien que pide `/tareas` con un navegador sin JavaScript.
 */
export async function cuantasTareasSeVen(host, pedir = fetch) {
  const html = await (await pedir(`http://${host}/tareas`)).text();
  return (html.match(/data-tarea="/g) ?? []).length;
}
