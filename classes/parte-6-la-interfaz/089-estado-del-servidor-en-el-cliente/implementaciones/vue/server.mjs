import { createServer } from "node:http";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";

import { leer } from "./cache.mjs";
import { responder } from "./servidor-comun.mjs";

/**
 * CÓMO LO CONSUME UN COMPONENTE DE VUE.
 *
 * En un proyecto real, `useQuery` de Pinia Colada o de TanStack Query para Vue.
 * Y hay una diferencia de ecosistema que merece decirse: **Vue trae Pinia como
 * almacén oficial**, y mucha gente mete ahí el estado del servidor porque ya
 * está instalado.
 *
 * Es el error que esta clase quiere evitar. Un almacén guarda estado propio; una
 * caché de consultas gestiona estado ajeno. Meter lo segundo en el primero
 * significa escribir a mano la obsolescencia, la revalidación y la invalidación
 * — que es exactamente lo que Pinia Colada existe para no tener que escribir.
 */
const Panel = {
  name: "Panel",
  props: { clave: { type: String, required: true } },
  render() {
    const { dato, origen } = leer(this.clave);
    return h("div", { "data-panel": this.clave, "data-origen": origen }, dato);
  },
};

const FICHA = {
  biblioteca_habitual: "Pinia Colada, o TanStack Query para Vue",
  como_se_consume: "useQuery({ key, query }) devuelve refs reactivas con el dato y su estado",
  por_que_no_useState: "guardarlo en un `ref` o en Pinia convierte un dato ajeno en estado propio",
  nota:
    "Vue trae Pinia como almacén oficial y mucha gente mete ahí el estado del servidor porque ya está instalado; un almacén guarda estado PROPIO, y para el ajeno hay que escribir a mano todo lo que una caché de consultas trae hecho",
};

createServer(async (peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");

  if (url.pathname === "/") {
    const marcado = await renderToString(
      createSSRApp({
        render: () => h(Panel, { clave: url.searchParams.get("clave") ?? "usuarios" }),
      }),
    );
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(
      `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 089</title></head><body>${marcado}</body></html>`,
    );
    return;
  }

  const resultado = responder(url, FICHA);
  if (resultado) {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify(resultado.json));
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
