import { c as defineEventHandler } from '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const ESTRATEGIAS = {
  estatico: {
    cuando_se_genera: "al construir, una sola vez",
    que_gana: "la respuesta m\xE1s r\xE1pida posible: son bytes en disco, sin proceso que espere",
    que_paga: "el contenido es de cuando se construy\xF3",
    cuando_conviene: "marketing, documentaci\xF3n, blogs, cat\xE1logos que cambian poco"
  },
  servidor: {
    cuando_se_genera: "en cada petici\xF3n",
    que_gana: "el contenido siempre es de ahora, y puede depender de qui\xE9n pide",
    que_paga: "un proceso trabajando por cada visita",
    cuando_conviene: "paneles, listados con permisos, datos que son de alguien"
  },
  cliente: {
    cuando_se_genera: "en el navegador, tras descargar y ejecutar JavaScript",
    que_gana: "el servidor solo sirve archivos y la navegaci\xF3n posterior no pide p\xE1ginas",
    que_paga: "la primera pantalla llega vac\xEDa",
    cuando_conviene: "aplicaciones detr\xE1s de un acceso"
  },
  revalidado: {
    cuando_se_genera: "al construir, y se regenera pasado un plazo o al invalidarse",
    que_gana: "la velocidad de lo est\xE1tico con contenido que se refresca solo",
    que_paga: "una ventana sirviendo contenido viejo",
    cuando_conviene: "cat\xE1logos grandes que cambian a diario",
    nota: "en Nuxt es `swr` o `isr` en la misma tabla de `routeRules`"
  }
};
const estrategias_json = defineEventHandler(() => ({
  framework: "nuxt",
  estrategias: Object.keys(ESTRATEGIAS),
  se_elige_por_pantalla: true,
  como_se_elige_aqui: "`routeRules` en `nuxt.config.ts`: un mapa de patr\xF3n de ruta a estrategia",
  por_omision: "servidor \u2014 sin regla, la ruta se renderiza en cada petici\xF3n",
  ventaja_de_la_tabla: "la arquitectura entera se lee de un vistazo, sin abrir veinte archivos",
  desventaja_de_la_tabla: "la decisi\xF3n queda lejos de la pantalla a la que afecta, as\xED que es f\xE1cil que se desincronicen",
  detalle: ESTRATEGIAS
}));

export { estrategias_json as default };
//# sourceMappingURL=estrategias.json.mjs.map
