import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";

import { cuenta, debeRepetirse, reiniciar } from "./contadores.mjs";

const FUENTE = new URL("./Reloj.svelte", import.meta.url);
const fuente = readFileSync(FUENTE, "utf8");

const { js } = compile(fuente, { generate: "server", name: "Reloj" });
const destino = new URL("./Reloj.compilada.mjs", import.meta.url);
writeFileSync(destino, js.code);
const Reloj = (await import(destino)).default;

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
    html(pagina(render(Reloj, { props: {} }).body));
    return;
  }

  if (url.pathname === "/ciclo") {
    reiniciar();
    render(Reloj, { props: {} });
    json({
      renders_ejecutados: cuenta.render,
      efectos_ejecutados: cuenta.efecto,
      limpiezas_ejecutadas: cuenta.limpieza,
      el_efecto_corre_en_el_servidor: cuenta.efecto > 0,
      que_si_corre: ["el cuerpo del <script>"],
      que_no_corre: ["onMount", "$effect", "la función de limpieza"],
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
      con_que_se_compara: "en Svelte no hay lista: `$effect` deduce las dependencias leyéndolas",
    });
    return;
  }

  if (url.pathname === "/efecto.json") {
    json({
      leido_del_archivo: true,
      archivo: "Reloj.svelte",
      lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
      como_se_declara: "`onMount` para el ciclo de vida; `$effect` para reaccionar a un cambio",
      tiene_limpieza: true,
      como_se_limpia: "devolviendo una función desde `onMount` o desde `$effect`",
      cuando_se_limpia: "al destruir el componente, y antes de cada repetición del efecto",
      hay_lista_de_dependencias: false,
      que_pasa_sin_lista: "`$effect` deduce las dependencias de lo que lee, así que no se puede olvidar ninguna",
      nota:
        "sin lista no existe el error de olvidar una dependencia; a cambio, tampoco se puede mentir sobre cuáles son — que es lo que la lista de React permite hacer",
    });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
