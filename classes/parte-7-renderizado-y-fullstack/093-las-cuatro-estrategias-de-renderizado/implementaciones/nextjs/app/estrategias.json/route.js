export const dynamic = "force-static";

/**
 * LAS CUATRO ESTRATEGIAS, Y LA IDEA QUE ORDENA LA PARTE ENTERA.
 *
 * No son cuatro opciones de configuración entre las que elegir una para todo el
 * proyecto: son cuatro compromisos distintos, y **la respuesta correcta cambia
 * por pantalla**.
 */
const ESTRATEGIAS = {
  estatico: {
    cuando_se_genera: "al construir, una sola vez",
    que_gana: "la respuesta más rápida posible: son bytes en disco, sin proceso que espere",
    que_paga: "el contenido es de cuando se construyó",
    cuando_conviene: "marketing, documentación, blogs, catálogos que cambian poco",
  },
  servidor: {
    cuando_se_genera: "en cada petición",
    que_gana: "el contenido siempre es de ahora, y puede depender de quién pide",
    que_paga: "un proceso trabajando por cada visita",
    cuando_conviene: "paneles, listados con permisos, datos que son de alguien",
  },
  cliente: {
    cuando_se_genera: "en el navegador, tras descargar y ejecutar JavaScript",
    que_gana: "el servidor solo sirve archivos y la navegación posterior no pide páginas",
    que_paga: "la primera pantalla llega vacía",
    cuando_conviene: "aplicaciones detrás de un acceso",
  },
  revalidado: {
    cuando_se_genera: "al construir, y se regenera pasado un plazo o al invalidarse",
    que_gana: "la velocidad de lo estático con contenido que se refresca solo",
    que_paga: "una ventana sirviendo contenido viejo",
    cuando_conviene: "catálogos grandes que cambian a diario",
    nota: "Next lo llama regeneración estática incremental y fue quien popularizó la idea",
  },
};

export function GET() {
  return Response.json({
    framework: "nextjs",
    estrategias: Object.keys(ESTRATEGIAS),
    se_elige_por_pantalla: true,
    como_se_elige_aqui: "`export const dynamic` y `export const revalidate` en cada ruta",
    por_omision: "estático — una página sin nada dinámico dentro se genera al construir",
    la_via_indirecta:
      "leer cookies o cabeceras convierte la ruta en dinámica SOLA, sin declararlo: cómodo, y difícil de auditar sin construir",
    detalle: ESTRATEGIAS,
  });
}
