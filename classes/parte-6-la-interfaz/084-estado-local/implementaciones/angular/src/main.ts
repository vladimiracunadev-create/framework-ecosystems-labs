import "@angular/compiler";
import "zone.js";

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { renderApplication } from "@angular/platform-server";

import { ContadorComponent } from "./contador.component.js";
import { siguiente } from "./reglas.js";

const FUENTE = path.join(process.cwd(), "src", "contador.component.ts");

async function dibujar(plantilla: string, a = 0, b = 5) {
  @Component({
    selector: "app-raiz",
    standalone: true,
    imports: [ContadorComponent],
    template: plantilla,
  })
  class Raiz {
    a = a;
    b = b;
  }

  const documento = "<!DOCTYPE html><html><head></head><body><app-raiz></app-raiz></body></html>";
  return renderApplication((contexto) => bootstrapApplication(Raiz, { providers: [] }, contexto), {
    document: documento,
  });
}

createServer(async (peticion, respuesta) => {
  const url = new URL(peticion.url ?? "/", "http://localhost");
  const json = (cuerpo: unknown) => {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify(cuerpo));
  };

  try {
    if (url.pathname === "/") {
      const a = Number(url.searchParams.get("a") ?? 0);
      const b = Number(url.searchParams.get("b") ?? 5);
      respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      respuesta.end(
        await dibujar(
          `<div data-padre="app"><mi-contador id="a" [inicial]="a"></mi-contador><mi-contador id="b" [inicial]="b"></mi-contador></div>`,
          a,
          b,
        ),
      );
      return;
    }

    if (url.pathname === "/sin-propiedades") {
      respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      respuesta.end(await dibujar(`<mi-contador></mi-contador>`));
      return;
    }

    if (url.pathname === "/transicion") {
      const antes = Number(url.searchParams.get("desde") ?? 0);
      const paso = Number(url.searchParams.get("paso") ?? 1);
      json({ antes, paso, despues: siguiente(antes, paso), regla: "no baja de cero" });
      return;
    }

    if (url.pathname === "/estado.json") {
      const fuente = readFileSync(FUENTE, "utf8");
      json({
        leido_del_archivo: true,
        archivo: "src/contador.component.ts",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        como_se_declara: "signal(inicial), un campo de la clase",
        el_estado_es_una_propiedad: false,
        cada_instancia_tiene_el_suyo: true,
        como_se_identifica_la_instancia: "cada componente es una instancia de la clase",
        quien_dispara_el_redibujado: "la señal, al escribir con .set() o .update()",
        nota:
          "durante diez años el estado fue un campo normal y quien detectaba los cambios era Zone.js, parcheando setTimeout y addEventListener para revisar el árbol entero. Desde la versión 16, `signal()` hace lo que las demás hacían desde el principio",
      });
      return;
    }

    respuesta.writeHead(404).end();
  } catch (fallo) {
    respuesta.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    respuesta.end(String(fallo));
  }
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
