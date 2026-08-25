import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Saludo } from "./Saludo.mjs";

/**
 * REACT EN EL SERVIDOR, para que el componente se pueda comparar sin navegador.
 *
 * `renderToStaticMarkup` devuelve el HTML que el componente produce, sin los
 * atributos que React necesitaría para hidratarlo después. Es la forma más
 * limpia de ver QUÉ produce un componente, separado de cómo se vuelve
 * interactivo — que es la clase 087.
 */

const FUENTE = new URL("./Saludo.mjs", import.meta.url);

const pagina = (contenido) =>
  `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Clase 082</title></head><body>${contenido}</body></html>`;

function servir(respuesta, cuerpo, tipo = "text/html; charset=utf-8") {
  respuesta.writeHead(200, { "content-type": tipo });
  respuesta.end(cuerpo);
}

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");

  if (url.pathname === "/") {
    servir(respuesta, pagina(renderToStaticMarkup(h(Saludo, {}))));
    return;
  }

  if (url.pathname === "/componente") {
    // El texto entra por PROPIEDADES. React lo escapa al renderizarlo, sin que
    // haya que pedirlo: es el comportamiento por omisión y la razón de que el
    // caso del texto peligroso pase.
    const texto = url.searchParams.get("texto") ?? undefined;
    servir(respuesta, pagina(renderToStaticMarkup(h(Saludo, { texto }))));
    return;
  }

  if (url.pathname === "/dos") {
    // EL MISMO COMPONENTE, DOS VECES, CON DATOS DISTINTOS.
    //
    // Es lo que separa un componente de un fragmento de plantilla: se puede
    // instanciar más de una vez y cada instancia tiene sus propios datos.
    const a = url.searchParams.get("a") ?? "uno";
    const b = url.searchParams.get("b") ?? "dos";
    servir(
      respuesta,
      pagina(
        renderToStaticMarkup(
          h("div", null, h(Saludo, { texto: a }), h(Saludo, { texto: b })),
        ),
      ),
    );
    return;
  }

  if (url.pathname === "/componente.json") {
    const fuente = readFileSync(FUENTE, "utf8");
    servir(
      respuesta,
      JSON.stringify({
        leido_del_archivo: true,
        archivo: "Saludo.mjs",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        es_un: "función que devuelve marcado",
        se_compila: false,
        nota_de_compilacion: "en un proyecto real se escribiría en JSX, y eso sí necesita compilador",
        renderiza_en: "servidor y navegador",
        escapa_por_omision: true,
        como_recibe_datos: "un objeto de propiedades como primer argumento",
      }),
      "application/json; charset=utf-8",
    );
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
