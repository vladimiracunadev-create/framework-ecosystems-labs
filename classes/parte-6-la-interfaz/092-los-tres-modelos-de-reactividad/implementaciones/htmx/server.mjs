import { createServer } from "node:http";

import { MODELOS, NOMBRES, VALORES } from "./modelos.mjs";

/**
 * EL TERCER MODELO: NO HAY NADA QUE RECALCULAR.
 *
 * Las otras siete tecnologías responden a «un dato ha cambiado, ¿qué se vuelve a
 * pintar?» con un mecanismo de seguimiento. htmx responde con otra pregunta:
 * **¿por qué hay un dato en el cliente?**
 *
 * Si el estado vive en el servidor, cambiarlo es una petición y actualizar la
 * pantalla es sustituir un trozo de HTML. No hay árbol que comparar, ni señales
 * que suscribir, ni efectos que agrupar. El código de reactividad de una
 * aplicación de htmx **es cero líneas**.
 *
 * Y aquí sí se puede medir algo, aunque sea de otra especie: cuántas peticiones
 * cuesta cambiar un valor, y cuántos trozos de página se sustituyen.
 */
let peticiones = 0;

function medir(cambia) {
  // Cambiar `a` es UNA petición que devuelve UN fragmento. El trozo que muestra
  // `b` no se pide, no se envía y no se toca: el aislamiento lo da `hx-target`,
  // no un sistema de seguimiento.
  peticiones += 1;
  return {
    peticiones_por_cambio: 1,
    fragmentos_sustituidos: 1,
    fragmentos_no_tocados: 1,
    lineas_de_codigo_reactivo: 0,
    peticiones_acumuladas: peticiones,
    valor_que_cambia: cambia,
  };
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
      framework: "htmx",
      modelo: "sin-reactividad-en-el-cliente",
      es_uno_de_los_tres: NOMBRES.includes("sin-reactividad-en-el-cliente"),
      matiz:
        "no es un modelo peor de reactividad: es la decisión de no tener estado en el cliente que vigilar",
      ...MODELOS["sin-reactividad-en-el-cliente"],
    });
    return;
  }

  if (url.pathname === "/medir") {
    const cambia = url.searchParams.get("cambia") ?? "a";
    json({
      respondida: true,
      medido: true,
      framework: "htmx",
      modelo: "sin-reactividad-en-el-cliente",
      valores: 2,
      cambia,
      ...medir(cambia),
      ejecuciones_del_que_cambia: 0,
      ejecuciones_del_que_no_cambia: 0,
      trabajo_proporcional_a: "una ida y vuelta por cambio",
      unidad_de_medida_distinta:
        "aquí no se cuentan reejecuciones sino PETICIONES: no hay nada que reejecutar en el cliente",
      valores_en_el_cliente: 0,
      valores_en_el_servidor: Object.keys(VALORES).length,
      lectura:
        "cero líneas de código reactivo y cero valores duplicados. Lo que en los otros siete es un mecanismo, aquí es una petición — y esa es toda la diferencia, para bien y para mal",
    });
    return;
  }

  if (url.pathname === "/modelos.json") {
    json({ modelos: NOMBRES, ninguno_es_el_mejor: true, detalle: MODELOS });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
