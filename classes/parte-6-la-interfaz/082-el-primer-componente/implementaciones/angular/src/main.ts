// `@angular/compiler` compila las plantillas en tiempo de ejecución.
//
// En un proyecto real lo hace la herramienta de construcción de Angular, y este
// paquete no llega al navegador. Aquí se importa a propósito para que la clase
// no necesite la CLI entera: el modelo del componente se ve igual, y el paso de
// compilación queda a la vista en lugar de escondido.
import "@angular/compiler";
import "zone.js";

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { renderApplication } from "@angular/platform-server";

import { SaludoComponent } from "./saludo.component.js";

const RAIZ = process.cwd();
const FUENTE = path.join(RAIZ, "src", "saludo.component.ts");

/**
 * Angular no renderiza un componente suelto: renderiza una APLICACIÓN.
 *
 * Hay que envolverlo en un componente raíz, arrancar la aplicación y esperar a
 * que el framework termine su ciclo. Es el paso extra que en React no existe —y
 * la razón es la misma que en Vue, solo que más marcada: el componente vive
 * dentro de algo que lo gobierna.
 */
async function dibujar(plantilla: string, contexto: Record<string, unknown> = {}) {
  @Component({
    selector: "app-raiz",
    standalone: true,
    imports: [SaludoComponent],
    template: plantilla,
  })
  class Raiz {
    a = String(contexto.a ?? "uno");
    b = String(contexto.b ?? "dos");
    texto = String(contexto.texto ?? "Hola, mundo");
  }

  const documento = "<!DOCTYPE html><html><head></head><body><app-raiz></app-raiz></body></html>";
  // El `contexto` no es opcional en el servidor: lleva la plataforma que
  // `renderApplication` acaba de crear. Sin pasarlo, Angular falla con NG0401 —
  // «Missing Platform», que es de los errores que más cuesta interpretar
  // cuando uno viene de React y esperaba una función suelta.
  return renderApplication((contexto) => bootstrapApplication(Raiz, { providers: [] }, contexto), {
    document: documento,
  });
}

createServer(async (peticion, respuesta) => {
  const url = new URL(peticion.url ?? "/", "http://localhost");
  const html = (cuerpo: string) => {
    respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    respuesta.end(cuerpo);
  };

  try {
    if (url.pathname === "/") {
      html(await dibujar("<mi-saludo></mi-saludo>"));
      return;
    }

    if (url.pathname === "/componente") {
      // `[texto]` con corchetes ENLAZA una expresión; sin corchetes pasaría la
      // cadena literal «texto». Angular interpola con `{{ }}` y escapa al
      // hacerlo: para meter marcado de verdad hay que pedir `innerHTML`, que es
      // la clase 073.
      const texto = url.searchParams.get("texto") ?? "Hola, mundo";
      html(await dibujar('<mi-saludo [texto]="texto"></mi-saludo>', { texto }));
      return;
    }

    if (url.pathname === "/dos") {
      const a = url.searchParams.get("a") ?? "uno";
      const b = url.searchParams.get("b") ?? "dos";
      html(
        await dibujar(
          '<div><mi-saludo [texto]="a"></mi-saludo><mi-saludo [texto]="b"></mi-saludo></div>',
          { a, b },
        ),
      );
      return;
    }

    if (url.pathname === "/componente.json") {
      const fuente = readFileSync(FUENTE, "utf8");
      respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      respuesta.end(
        JSON.stringify({
          leido_del_archivo: true,
          archivo: "src/saludo.component.ts",
          lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
          es_un: "clase con un decorador que declara selector, plantilla e independencia",
          se_compila: true,
          nota_de_compilacion:
            "dos veces: TypeScript compila la clase y el compilador de Angular compila la plantilla. En un proyecto real las dos las hace la CLI",
          renderiza_en: "servidor y navegador",
          escapa_por_omision: true,
          etiqueta: "mi-saludo",
          como_recibe_datos: "propiedades marcadas con @Input(), enlazadas con [corchetes]",
          nota_del_modelo:
            "no se renderiza un componente suelto: se arranca una aplicación que lo contiene",
        }),
      );
      return;
    }

    respuesta.writeHead(404).end();
  } catch (fallo) {
    respuesta.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    respuesta.end(String(fallo));
  }
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
