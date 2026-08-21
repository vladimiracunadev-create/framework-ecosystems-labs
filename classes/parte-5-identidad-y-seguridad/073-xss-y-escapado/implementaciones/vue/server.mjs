// El renderizado REAL de Vue en el servidor. Se usan funciones de render —
// es exactamente a lo que compilan las plantillas: {{ texto }} compila a un
// hijo de texto (escapado) y v-html compila a la propiedad innerHTML.
import { createServer } from "node:http";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";

const TEXTO = "<script>alerta(1)</script>";

const rutas = {
  // {{ texto }}: la interpolación escapa por omisión.
  "/seguro": () => createSSRApp({ render: () => h("p", TEXTO) }),
  // v-html: la puerta explícita. La documentación de Vue la presenta con
  // una advertencia de XSS en el primer párrafo.
  "/inseguro": () => createSSRApp({ render: () => h("div", { innerHTML: TEXTO }) }),
};

createServer(async (peticion, respuesta) => {
  const ruta = rutas[peticion.url];
  if (!ruta) {
    respuesta.writeHead(404).end();
    return;
  }
  respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  respuesta.end(await renderToString(ruta()));
}).listen(Number(process.env.PORT ?? 3000));
