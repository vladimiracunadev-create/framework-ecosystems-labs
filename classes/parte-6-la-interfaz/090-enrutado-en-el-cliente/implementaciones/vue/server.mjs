import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";

import { RUTAS, emparejar, resolver } from "./enrutador.mjs";

const FUENTE = new URL("./enrutador.mjs", import.meta.url);

/**
 * LAS PANTALLAS.
 *
 * Con Vue Router esto sería `{ path: "/tareas/:id", component: Detalle }` —
 * literalmente la misma tabla, con el componente en lugar del nombre— y el
 * parámetro se leería con `useRoute().params.id`.
 *
 * La diferencia de ecosistema es que Vue Router es **oficial**: lo mantiene el
 * mismo equipo, la documentación lo da por hecho y no hay dos opciones
 * compitiendo. Es una decisión menos que tomar, y una dependencia igual de real.
 */
const Pantalla = {
  name: "Pantalla",
  props: { pantalla: { type: String, required: true }, parametros: { type: Object, default: () => ({}) } },
  render() {
    const atributos = { "data-pantalla": this.pantalla };
    if (this.parametros.id) atributos["data-id"] = this.parametros.id;
    return h("div", atributos, this.pantalla);
  },
};

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 090</title></head><body>${contenido}</body></html>`;

createServer(async (peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");

  if (url.pathname === "/emparejar") {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify(
        emparejar(url.searchParams.get("patron") ?? "/", url.searchParams.get("ruta") ?? "/"),
      ),
    );
    return;
  }

  if (url.pathname === "/rutas.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({
        leido_del_archivo: true,
        archivo: "enrutador.mjs",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        rutas: RUTAS.map((r) => r.patron),
        la_direccion_es_estado: true,
        biblioteca_habitual: "Vue Router, oficial",
        viene_en_el_nucleo: false,
        como_se_lee_un_parametro: "useRoute().params.id",
        el_orden_lo_decide: "Vue Router ordena por especificidad, no por el orden de la tabla",
        nota:
          "es oficial: mismo equipo, misma documentación, sin dos opciones compitiendo. Una decisión menos que tomar, y una dependencia igual de real",
      }),
    );
    return;
  }

  const destino = resolver(url.pathname);
  const marcado = await renderToString(createSSRApp({ render: () => h(Pantalla, destino) }));
  respuesta.writeHead(destino.encontrada ? 200 : 404, {
    "content-type": "text/html; charset=utf-8",
  });
  respuesta.end(pagina(marcado));
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
