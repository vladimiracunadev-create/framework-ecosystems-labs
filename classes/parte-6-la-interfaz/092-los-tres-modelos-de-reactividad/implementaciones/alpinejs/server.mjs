import { createServer } from "node:http";

import { MODELOS, NOMBRES } from "./modelos.mjs";

/**
 * ALPINE ES REACTIVIDAD FINA, Y USA EL MOTOR DE VUE PARA SERLO.
 *
 * No es una casualidad ni un parecido: Alpine construye su reactividad sobre
 * `@vue/reactivity`, el mismo paquete que la implementación de Vue de esta clase
 * usa para medir. Los objetos de `x-data` se envuelven en un proxy reactivo y
 * cada expresión de un atributo se convierte en un efecto.
 *
 * Así que el modelo de Alpine ya está medido en esta clase — en la carpeta de al
 * lado. Lo que cambia es dónde se declara: allí en un archivo, aquí en un
 * atributo del HTML.
 *
 * Medirlo desde aquí exigiría arrancar Alpine, y Alpine necesita un documento:
 * su punto de entrada recorre el DOM buscando atributos `x-`. Sin navegador no
 * hay nada que recorrer.
 */
createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const json = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify(cuerpo));
  };

  if (url.pathname === "/modelo") {
    json({
      respondida: true,
      framework: "alpinejs",
      modelo: "reactividad-fina",
      es_uno_de_los_tres: NOMBRES.includes("reactividad-fina"),
      matiz:
        "usa `@vue/reactivity` por debajo: el mismo motor que Vue, declarado en atributos del HTML en lugar de en archivos",
      ...MODELOS["reactividad-fina"],
    });
    return;
  }

  if (url.pathname === "/medir") {
    json({
      respondida: true,
      medido: false,
      framework: "alpinejs",
      modelo: "reactividad-fina",
      valores: 2,
      cambia: url.searchParams.get("cambia") ?? "a",
      por_que_no_se_puede_medir:
        "Alpine arranca recorriendo el documento en busca de atributos `x-`: sin navegador no hay nada que recorrer",
      donde_esta_medido: "en la implementación de Vue de esta misma clase, porque comparten motor",
      motor_reactivo: "@vue/reactivity",
      lectura:
        "es el caso más claro del programa de una idea que viaja entre proyectos: Alpine no reinventó la reactividad, se trajo la de Vue y la puso en atributos",
    });
    return;
  }

  if (url.pathname === "/modelos.json") {
    json({ modelos: NOMBRES, ninguno_es_el_mejor: true, detalle: MODELOS });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
