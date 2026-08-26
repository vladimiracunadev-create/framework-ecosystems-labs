import "@angular/compiler";
import "zone.js";

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { renderApplication } from "@angular/platform-server";

import { RUTAS, emparejar, resolver } from "./enrutador.js";

const FUENTE = path.join(process.cwd(), "src", "enrutador.ts");

async function dibujar(pantalla: string, id: string | undefined) {
  @Component({
    selector: "app-raiz",
    standalone: true,
    // `[attr.data-id]` con `null` NO escribe el atributo, que es justo lo que se
    // quiere: la pantalla de inicio no tiene identificador.
    template: `<div [attr.data-pantalla]="pantalla" [attr.data-id]="id">{{ pantalla }}</div>`,
  })
  class Raiz {
    pantalla = pantalla;
    id = id ?? null;
  }

  const documento = "<!DOCTYPE html><html><head></head><body><app-raiz></app-raiz></body></html>";
  return renderApplication((contexto) => bootstrapApplication(Raiz, { providers: [] }, contexto), {
    document: documento,
  });
}

createServer(async (peticion, respuesta) => {
  const url = new URL(peticion.url ?? "/", "http://localhost");

  try {
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
          archivo: "src/enrutador.ts",
          lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
          rutas: RUTAS.map((r) => r.patron),
          la_direccion_es_estado: true,
          biblioteca_habitual: "@angular/router, incluido en el framework",
          viene_en_el_nucleo: true,
          como_se_lee_un_parametro: "ActivatedRoute.snapshot.paramMap.get('id')",
          el_orden_lo_decide: "la tabla: Angular empareja la primera que coincide",
          nota:
            "es el único de los cuatro que trae enrutador. Una decisión menos, una dependencia menos que elegir — y a cambio, una pieza más del framework que hay que aprender aunque no se use",
        }),
      );
      return;
    }

    const destino = resolver(url.pathname);
    respuesta.writeHead(destino.encontrada ? 200 : 404, {
      "content-type": "text/html; charset=utf-8",
    });
    respuesta.end(await dibujar(destino.pantalla, destino.parametros.id));
  } catch (fallo) {
    respuesta.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    respuesta.end(String(fallo));
  }
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
