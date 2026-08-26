import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";

import { cuenta, debeRepetirse, reiniciar } from "./contadores.mjs";
import { Reloj } from "./Reloj.mjs";

const FUENTE = new URL("./Reloj.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 087</title></head><body>${contenido}</body></html>`;

const render = (nodo) => renderToString(createSSRApp({ render: () => nodo }));
const lista = (texto) => (texto === null ? null : texto.split(",").filter(Boolean));

createServer(async (peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const html = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(cuerpo);
  };
  const json = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify(cuerpo));
  };

  if (url.pathname === "/") {
    html(pagina(await render(h(Reloj))));
    return;
  }

  if (url.pathname === "/ciclo") {
    reiniciar();
    await render(h(Reloj));
    json({
      renders_ejecutados: cuenta.render,
      efectos_ejecutados: cuenta.efecto,
      limpiezas_ejecutadas: cuenta.limpieza,
      el_efecto_corre_en_el_servidor: cuenta.efecto > 0,
      que_si_corre: ["setup", "render"],
      que_no_corre: ["onMounted", "onUnmounted", "watch"],
      consecuencia:
        "si los datos se cargan en `onMounted`, el HTML del servidor sale sin ellos y el usuario ve el estado inicial hasta que arranca el JavaScript",
    });
    return;
  }

  if (url.pathname === "/debe-repetirse") {
    const antes = lista(url.searchParams.get("antes"));
    const despues = lista(url.searchParams.get("despues")) ?? [];
    json({
      antes,
      despues,
      se_repite: debeRepetirse(antes, despues),
      comparacion: "superficial",
      con_que_se_compara: "en Vue, el sistema de reactividad: `watch` se dispara cuando la fuente que observa cambia",
    });
    return;
  }

  if (url.pathname === "/efecto.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    json({
      leido_del_archivo: true,
      archivo: "Reloj.mjs",
      lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_declara: "`onMounted` para el ciclo de vida; `watch` para reaccionar a un cambio",
      tiene_limpieza: true,
      como_se_limpia: "`onUnmounted`, o la función `onCleanup` que recibe `watch`",
      cuando_se_limpia: "al desmontar; `watch` limpia antes de cada repetición",
      hay_lista_de_dependencias: false,
      que_pasa_sin_lista: "no hay lista: `watch` observa una fuente concreta y `watchEffect` deduce las dependencias leyéndolas",
      nota:
        "Vue separa en dos lo que React junta en uno. Quien viene de React busca `useEffect` y encuentra dos herramientas, y elegir es la pregunta correcta: ¿ciclo de vida o reacción a un cambio?",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
