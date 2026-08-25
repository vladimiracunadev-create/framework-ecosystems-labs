import { createServer } from "node:http";
import { readFileSync } from "node:fs";

import { saludo } from "./saludo.mjs";

/**
 * HTMX NO TIENE COMPONENTES, Y ESO ES LO QUE VIENE A ENSEÑAR AQUÍ.
 *
 * En los otros siete, el componente es una pieza que vive en el cliente y se
 * instancia allí. En htmx la pieza vive **en el servidor**: es una función que
 * devuelve un fragmento de HTML, y el navegador solo lo pega donde toque.
 *
 * Por eso esta implementación no importa htmx para renderizar. Lo que importa
 * htmx es la PÁGINA: los atributos `hx-get` y `hx-target` que dicen de dónde
 * traer el fragmento y dónde ponerlo. El componente es una función de texto.
 *
 * Que sea la implementación más corta de las ocho no significa que sea la más
 * simple: significa que el trabajo está en otro sitio — en el servidor, donde
 * ya hay un lenguaje y una plantilla.
 */

const FUENTE = new URL("./saludo.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 082</title>` +
  `<script src="https://unpkg.com/htmx.org@2.0.4"></script></head>` +
  `<body>${contenido}` +
  // La mejora de htmx: el mismo fragmento, pedido sin recargar. El caso base ya
  // está arriba, servido por el servidor — es la clase 081 aplicada aquí.
  `<button hx-get="/componente?texto=desde%20htmx" hx-target="#destino">Cambiar</button>` +
  `<div id="destino"></div></body></html>`;

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const html = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(cuerpo);
  };

  if (url.pathname === "/") {
    html(pagina(saludo()));
    return;
  }

  if (url.pathname === "/componente") {
    // Se devuelve EL FRAGMENTO SUELTO, sin página alrededor. Es lo que htmx
    // espera: HTML que pegar, no un documento ni un JSON que haya que
    // convertir en HTML con JavaScript.
    html(saludo(url.searchParams.get("texto") ?? undefined));
    return;
  }

  if (url.pathname === "/dos") {
    const a = url.searchParams.get("a") ?? "uno";
    const b = url.searchParams.get("b") ?? "dos";
    html(pagina(`<div>${saludo(a)}${saludo(b)}</div>`));
    return;
  }

  if (url.pathname === "/componente.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(
      JSON.stringify({
        leido_del_archivo: true,
        archivo: "saludo.mjs",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        es_un: "función del SERVIDOR que devuelve un fragmento de HTML",
        se_compila: false,
        nota_de_compilacion: "no hay nada que compilar: el fragmento se escribe y se manda",
        renderiza_en: "solo servidor",
        escapa_por_omision: false,
        nota_de_escapado:
          "AQUÍ EL ESCAPADO ES TUYO: htmx pega el HTML que reciba, así que quien construye el fragmento tiene que escapar. Es la diferencia más importante con los otros siete",
        como_recibe_datos: "argumentos de la función, en el servidor",
        que_hace_htmx: "atributos hx-* en el marcado: de dónde traer el fragmento y dónde ponerlo",
      }),
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
