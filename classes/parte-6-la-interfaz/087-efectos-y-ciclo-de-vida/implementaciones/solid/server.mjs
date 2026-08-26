import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { renderToString } from "solid-js/web";

import { cuenta, debeRepetirse, reiniciar } from "./contadores.mjs";
import { Reloj } from "./Reloj.mjs";

const FUENTE = new URL("./Reloj.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 087</title></head><body>${contenido}</body></html>`;

const lista = (texto) => (texto === null ? null : texto.split(",").filter(Boolean));

createServer((peticion, respuesta) => {
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
    html(pagina(renderToString(() => Reloj({}))));
    return;
  }

  if (url.pathname === "/ciclo") {
    reiniciar();
    renderToString(() => Reloj({}));
    json({
      renders_ejecutados: cuenta.render,
      efectos_ejecutados: cuenta.efecto,
      limpiezas_ejecutadas: cuenta.limpieza,
      el_efecto_corre_en_el_servidor: cuenta.efecto > 0,
      que_si_corre: ["el cuerpo del componente"],
      que_no_corre: ["onMount", "createEffect", "onCleanup"],
      consecuencia:
        "si los datos se cargan en `onMount`, el HTML del servidor sale sin ellos y el usuario ve el estado inicial hasta que arranca el JavaScript",
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
      con_que_se_compara: "en Solid no hay lista: `createEffect` se suscribe a lo que lee",
    });
    return;
  }

  if (url.pathname === "/efecto.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    json({
      leido_del_archivo: true,
      archivo: "Reloj.mjs",
      lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_declara: "`createEffect` para reaccionar; `onMount` para el ciclo de vida",
      tiene_limpieza: true,
      como_se_limpia: "`onCleanup`, que se puede llamar dentro del propio efecto",
      cuando_se_limpia: "al destruir el ámbito reactivo, y antes de cada repetición",
      hay_lista_de_dependencias: false,
      que_pasa_sin_lista: "la suscripción se establece al leer la señal, igual que en el render",
      nota:
        "quita de golpe dos errores clásicos de React: la dependencia olvidada, porque no hay lista, y el efecto que se repite siempre porque en las dependencias hay un objeto literal",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
