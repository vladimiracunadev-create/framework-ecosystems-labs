import { createServer } from "node:http";

import { MODELOS, NOMBRES, VALORES } from "./modelos.mjs";

/**
 * EL MISMO PAQUETE TRAE DOS MOTORES, Y EL DEL SERVIDOR NO REACCIONA.
 *
 * Importar `solid-js` en Node resuelve la condición «server» y trae una versión
 * del sistema reactivo **con las actualizaciones desactivadas**: las señales se
 * pueden leer, pero escribir en una no propaga nada.
 *
 * Y tiene todo el sentido: en el servidor se renderiza una vez y se manda el
 * texto. Nada va a cambiar después, así que llevar el motor de propagación sería
 * peso muerto. Es la misma lógica por la que el efecto de la clase 087 tampoco
 * corre aquí.
 *
 * Para medir el modelo de verdad hay que pedir el motor del CLIENTE
 * explícitamente. Escribir esta ruta a mano no es lo que se hace en un proyecto
 * —ahí lo elige el empaquetador— pero es lo que permite que esta clase mida en
 * lugar de afirmar.
 */
const solid = await import("solid-js/dist/solid.js");

/**
 * MEDIR LA REACTIVIDAD FINA.
 *
 * Dos señales, dos cálculos que leen una cada uno. Esa lectura es lo que los
 * suscribe: nadie declara dependencias.
 *
 * `createComputed` corre en cuanto se registra y vuelve a correr cuando cambia
 * algo que leyó. Es la primitiva más directa para ver el mecanismo, por debajo
 * de `createEffect`, que además espera al render.
 */
function medir() {
  const cuenta = { a: 0, b: 0 };
  let ponerA;
  const desechar = solid.createRoot((tirar) => {
    const [a, asignar] = solid.createSignal(VALORES.a);
    const [b] = solid.createSignal(VALORES.b);
    ponerA = asignar;

    solid.createComputed(() => {
      a();
      cuenta.a += 1;
    });
    solid.createComputed(() => {
      b();
      cuenta.b += 1;
    });
    return tirar;
  });

  const inicial = { ...cuenta };
  ponerA(VALORES.a + 1);
  const resultado = {
    ejecuciones_del_que_cambia: cuenta.a - inicial.a,
    ejecuciones_del_que_no_cambia: cuenta.b - inicial.b,
    ejecuciones_al_registrar: inicial,
  };
  desechar();
  return resultado;
}

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const json = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify(cuerpo));
  };

  if (url.pathname === "/modelo") {
    json({
      respondida: true,
      framework: "solid",
      modelo: "reactividad-fina",
      es_uno_de_los_tres: NOMBRES.includes("reactividad-fina"),
      ...MODELOS["reactividad-fina"],
    });
    return;
  }

  if (url.pathname === "/medir") {
    json({
      respondida: true,
      medido: true,
      framework: "solid",
      modelo: "reactividad-fina",
      valores: 2,
      cambia: url.searchParams.get("cambia") ?? "a",
      ...medir(),
      trabajo_proporcional_a: "el número de lectores del valor que cambió",
      motor_usado: "solid-js/dist/solid.js, el del cliente",
      por_que_no_el_de_serie:
        "importar `solid-js` en Node trae el motor del servidor, que no propaga cambios: en el servidor se renderiza una vez y nada va a cambiar después",
      lectura:
        "el cálculo que no leyó la señal cambiada NO se vuelve a ejecutar: cero, no uno. Esa es la diferencia entera con el árbol virtual, y por eso aquí no hacen falta envoltorios de memoria",
    });
    return;
  }

  if (url.pathname === "/modelos.json") {
    json({ modelos: NOMBRES, ninguno_es_el_mejor: true, detalle: MODELOS });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
