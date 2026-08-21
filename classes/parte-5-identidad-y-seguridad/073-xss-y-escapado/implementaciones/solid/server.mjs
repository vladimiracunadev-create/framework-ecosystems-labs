import { createServer } from "node:http";
import { seguro, inseguro } from "./App.compilada.mjs";

const TEXTO = "<script>alerta(1)</script>";

const rutas = {
  "/seguro": () => seguro(TEXTO),
  "/inseguro": () => inseguro(TEXTO),
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
