export const prerender = true;

/**
 * LAS CUATRO ESTRATEGIAS, Y LA IDEA QUE ORDENA LA PARTE ENTERA.
 *
 * No son cuatro opciones de configuración entre las que elegir una para todo el
 * proyecto: son cuatro compromisos distintos, y **la respuesta correcta cambia
 * por pantalla**.
 *
 * Un catálogo de productos y un panel de administración de la misma aplicación
 * tienen necesidades opuestas, y los cinco metaframeworks de esta parte permiten
 * mezclarlas. Elegir una sola para todo es el error que la clase 104 desmonta.
 */
const ESTRATEGIAS = {
  estatico: {
    cuando_se_genera: "al construir, una sola vez",
    que_gana: "la respuesta más rápida posible: son bytes en disco o en una red de distribución, sin proceso que espere",
    que_paga: "el contenido es de cuando se construyó; para cambiarlo hay que volver a construir y desplegar",
    cuando_conviene: "páginas de marketing, documentación, blogs, catálogos que cambian poco",
  },
  servidor: {
    cuando_se_genera: "en cada petición",
    que_gana: "el contenido siempre es de ahora, y puede depender de quién pide: sesión, permisos, idioma",
    que_paga: "un proceso trabajando por cada visita, y una latencia que crece con lo que ese proceso haga",
    cuando_conviene: "paneles, listados con permisos, cualquier pantalla con datos que cambian y son de alguien",
  },
  cliente: {
    cuando_se_genera: "en el navegador, después de descargar y ejecutar JavaScript",
    que_gana: "el servidor solo sirve archivos, y una vez cargado el navegador navega sin volver a pedir páginas",
    que_paga: "la primera pantalla llega vacía; quien no ejecute JavaScript no ve nada y los buscadores dependen de que lo ejecuten ellos",
    cuando_conviene: "aplicaciones detrás de un acceso, donde el primer pintado importa poco y la interacción mucho",
  },
  revalidado: {
    cuando_se_genera: "al construir, y se regenera pasado un plazo o cuando algo lo invalida",
    que_gana: "la velocidad de lo estático con un contenido que se refresca solo",
    que_paga: "una ventana en la que se sirve contenido viejo, y una complejidad de invalidación que hay que entender",
    cuando_conviene: "catálogos grandes que cambian a diario: construirlos enteros en cada cambio no sale a cuenta",
    nota: "es la clase 062 y la 089 aplicadas al HTML: obsoleto mientras se revalida, con la página como unidad",
  },
};

export function GET() {
  return new Response(
    JSON.stringify({
      framework: "astro",
      estrategias: Object.keys(ESTRATEGIAS),
      se_elige_por_pantalla: true,
      como_se_elige_aqui: "`export const prerender` en cada página: true la deja estática, false la manda al servidor",
      por_omision: "estático — Astro no monta servidor salvo que una página lo pida",
      detalle: ESTRATEGIAS,
    }),
    { headers: { "content-type": "application/json; charset=utf-8" } },
  );
}
