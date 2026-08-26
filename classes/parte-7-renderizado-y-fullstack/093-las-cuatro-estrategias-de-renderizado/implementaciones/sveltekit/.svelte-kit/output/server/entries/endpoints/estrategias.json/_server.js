import { json } from "@sveltejs/kit";
const prerender = true;
const ESTRATEGIAS = {
  estatico: {
    cuando_se_genera: "al construir, una sola vez",
    que_gana: "la respuesta más rápida posible: son bytes en disco, sin proceso que espere",
    que_paga: "el contenido es de cuando se construyó",
    cuando_conviene: "marketing, documentación, blogs, catálogos que cambian poco"
  },
  servidor: {
    cuando_se_genera: "en cada petición",
    que_gana: "el contenido siempre es de ahora, y puede depender de quién pide",
    que_paga: "un proceso trabajando por cada visita",
    cuando_conviene: "paneles, listados con permisos, datos que son de alguien"
  },
  cliente: {
    cuando_se_genera: "en el navegador, tras descargar y ejecutar JavaScript",
    que_gana: "el servidor solo sirve archivos y la navegación posterior no pide páginas",
    que_paga: "la primera pantalla llega vacía",
    cuando_conviene: "aplicaciones detrás de un acceso"
  },
  revalidado: {
    cuando_se_genera: "al construir, y se regenera pasado un plazo o al invalidarse",
    que_gana: "la velocidad de lo estático con contenido que se refresca solo",
    que_paga: "una ventana sirviendo contenido viejo",
    cuando_conviene: "catálogos grandes que cambian a diario"
  }
};
function GET() {
  return json({
    framework: "sveltekit",
    estrategias: Object.keys(ESTRATEGIAS),
    se_elige_por_pantalla: true,
    como_se_elige_aqui: "`export const prerender` en el `+page.server.js` de cada ruta",
    por_omision: "servidor — SvelteKit renderiza en el servidor salvo que la ruta pida lo contrario",
    lo_decide_tambien: "el adaptador: `adapter-static` obliga a que todo sea estático",
    detalle: ESTRATEGIAS
  });
}
export {
  GET,
  prerender
};
