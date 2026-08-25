import "@angular/compiler";
import "zone.js";

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { renderApplication } from "@angular/platform-server";

import { ContadorComponent } from "./contador.component.js";
import { alRecibirCambio } from "./padre.js";

const FUENTE = path.join(process.cwd(), "src", "contador.component.ts");

async function dibujar(valor: number) {
  @Component({
    selector: "app-raiz",
    standalone: true,
    imports: [ContadorComponent],
    // `(cambiar)` escucha la salida del hijo. Los paréntesis son la mitad de
    // arriba de la sintaxis de Angular: `[propiedad]` baja, `(evento)` sube, y
    // `[(ngModel)]` —los dos juntos— es el atajo de las dos direcciones que la
    // clase 086 desmonta.
    template: `<div data-padre="app"><mi-contador [valor]="valor" (cambiar)="alCambiar($event)"></mi-contador></div>`,
  })
  class Raiz {
    valor = valor;

    alCambiar(paso: number) {
      this.valor = alRecibirCambio(this.valor, paso);
    }
  }

  const documento = "<!DOCTYPE html><html><head></head><body><app-raiz></app-raiz></body></html>";
  return renderApplication((contexto) => bootstrapApplication(Raiz, { providers: [] }, contexto), {
    document: documento,
  });
}

createServer(async (peticion, respuesta) => {
  const url = new URL(peticion.url ?? "/", "http://localhost");

  try {
    if (url.pathname === "/") {
      const valor = Number(url.searchParams.get("valor") ?? 0);
      respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      respuesta.end(await dibujar(valor));
      return;
    }

    if (url.pathname === "/evento") {
      const antes = Number(url.searchParams.get("valor") ?? 0);
      const paso = Number(url.searchParams.get("paso") ?? 1);
      respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      respuesta.end(
        JSON.stringify({
          antes,
          paso,
          despues: alRecibirCambio(antes, paso),
          quien_decide: "el padre",
        }),
      );
      return;
    }

    if (url.pathname === "/flujo.json") {
      const fuente = readFileSync(FUENTE, "utf8");
      respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      respuesta.end(
        JSON.stringify({
          leido_del_archivo: true,
          archivo: "src/contador.component.ts",
          lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
          datos_hacia_abajo: "propiedades",
          como_se_declaran: "`@Input()`, enlazadas con [corchetes]",
          avisos_hacia_arriba: "`@Output()` con un `EventEmitter`, escuchado con (paréntesis)",
          el_hijo_muta_la_propiedad: false,
          hay_mecanismo_de_eventos_aparte: true,
          eventos_declarados: ["cambiar"],
          nota:
            "es el único de los ocho donde cada dirección tiene su propio decorador, así que el contrato del componente se lee de un vistazo. `EventEmitter` es RxJS por debajo: la salida es un flujo observable",
          el_hijo_sabe_que_pasa_despues: false,
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
