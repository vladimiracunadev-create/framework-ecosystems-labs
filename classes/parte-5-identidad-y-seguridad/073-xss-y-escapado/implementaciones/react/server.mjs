// El renderizado REAL de React, en el servidor, para que el resultado sea
// medible sin navegador: lo que renderToStaticMarkup produce aquí es lo que
// React produce en el DOM — el mismo escapado, las mismas reglas.
import { createServer } from "node:http";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Lo que un usuario malicioso escribió en un campo de texto.
const TEXTO = "<script>alerta(1)</script>";

const rutas = {
  // La interpolación normal: React escapa TODO texto por omisión. No hay
  // opción para olvidar: la vía segura es la vía sin nombre.
  "/seguro": () => renderToStaticMarkup(h("p", null, TEXTO)),
  // La puerta explícita, con el nombre más honesto de la industria:
  // dangerouslySetInnerHTML. Imposible teclearla sin enterarse.
  "/inseguro": () =>
    renderToStaticMarkup(h("div", { dangerouslySetInnerHTML: { __html: TEXTO } })),
};

createServer((peticion, respuesta) => {
  const ruta = rutas[peticion.url];
  if (!ruta) {
    respuesta.writeHead(404).end();
    return;
  }
  respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  respuesta.end(ruta());
}).listen(Number(process.env.PORT ?? 3000));
