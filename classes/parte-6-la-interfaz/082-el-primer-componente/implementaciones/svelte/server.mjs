import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { compile } from "svelte/compiler";
import { render } from "svelte/server";

/**
 * SVELTE SE COMPILA, Y ESA ES SU TESIS.
 *
 * Los otros siete llevan su motor al sitio donde se ejecutan: React, Vue, Solid
 * y Lit envían una biblioteca al navegador que interpreta el componente en
 * tiempo de ejecución. Svelte no: **traduce el componente a código** durante la
 * compilación, y lo que se envía es ese código.
 *
 * Por eso este archivo empieza compilando. En un proyecto real lo haría la
 * herramienta de construcción; aquí se hace a la vista para que el paso no
 * quede escondido, que es justo lo que la clase quiere enseñar.
 */

const FUENTE = new URL("./Saludo.svelte", import.meta.url);
const fuente = readFileSync(FUENTE, "utf8");

mkdirSync(new URL("./compilados/", import.meta.url), { recursive: true });
const { js } = compile(fuente, { generate: "server", name: "Saludo" });
const destino = new URL("./compilados/Saludo.js", import.meta.url);
writeFileSync(destino, js.code);
const Saludo = (await import(destino)).default;

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 082</title></head><body>${contenido}</body></html>`;

const dibujar = (props) => render(Saludo, { props }).body;

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const html = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(cuerpo);
  };

  if (url.pathname === "/") {
    html(pagina(dibujar({})));
    return;
  }

  if (url.pathname === "/componente") {
    // El texto entra por propiedades y `{texto}` lo escapa. En Svelte el
    // equivalente de meter marcado a propósito es `{@html ...}`, y también es
    // la clase 073.
    const texto = url.searchParams.get("texto");
    html(pagina(dibujar(texto === null ? {} : { texto })));
    return;
  }

  if (url.pathname === "/dos") {
    const a = url.searchParams.get("a") ?? "uno";
    const b = url.searchParams.get("b") ?? "dos";
    html(pagina(`<div>${dibujar({ texto: a })}${dibujar({ texto: b })}</div>`));
    return;
  }

  if (url.pathname === "/componente.json") {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({
        leido_del_archivo: true,
        archivo: "Saludo.svelte",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        es_un: "archivo propio con marcado y script juntos",
        se_compila: true,
        nota_de_compilacion:
          "no es opcional: sin compilar, un .svelte no es JavaScript válido. El compilador está aquí, en el arranque, en lugar de escondido en la herramienta de construcción",
        lineas_compiladas: js.code.split(/\r?\n/).filter((l) => l.trim()).length,
        renderiza_en: "servidor y navegador",
        escapa_por_omision: true,
        como_recibe_datos: "`$props()`, desestructurado con valores por omisión",
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
