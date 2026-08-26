import { createServer } from "node:http";
import { effect, ref } from "@vue/reactivity";

import { MODELOS, NOMBRES, VALORES } from "./modelos.mjs";

/**
 * VUE PUBLICA SU SISTEMA REACTIVO COMO PAQUETE INDEPENDIENTE.
 *
 * `@vue/reactivity` funciona sin componentes, sin plantillas y sin navegador. Se
 * puede usar en un servidor, en un proceso por lotes o en otro framework — y de
 * hecho hay quien lo hace.
 *
 * Eso lo convierte en el mejor sitio del elenco para ver el modelo desnudo: dos
 * `ref`, dos efectos que leen uno cada uno, se cambia uno y se cuenta. Sin
 * render de por medio.
 *
 * A diferencia de Solid, aquí no hay dos motores: el mismo paquete reacciona en
 * Node igual que en el navegador.
 */
function medir() {
  const cuenta = { a: 0, b: 0 };
  const a = ref(VALORES.a);
  const b = ref(VALORES.b);

  // Leer `.value` es lo que suscribe. Sin esa lectura, el efecto no se entera
  // de nada — y ese es exactamente el error de olvidar el `.value`.
  const parar1 = effect(() => {
    a.value;
    cuenta.a += 1;
  });
  const parar2 = effect(() => {
    b.value;
    cuenta.b += 1;
  });

  const inicial = { ...cuenta };
  a.value = VALORES.a + 1;

  const resultado = {
    ejecuciones_del_que_cambia: cuenta.a - inicial.a,
    ejecuciones_del_que_no_cambia: cuenta.b - inicial.b,
    ejecuciones_al_registrar: inicial,
  };
  parar1.effect?.stop?.();
  parar2.effect?.stop?.();
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
      framework: "vue",
      modelo: "reactividad-fina",
      es_uno_de_los_tres: NOMBRES.includes("reactividad-fina"),
      matiz:
        "Vue es fino para SABER qué cambió y de grano grueso para APLICARLO: marca el componente como sucio y vuelve a ejecutar su render, no el de sus hijos",
      ...MODELOS["reactividad-fina"],
    });
    return;
  }

  if (url.pathname === "/medir") {
    json({
      respondida: true,
      medido: true,
      framework: "vue",
      modelo: "reactividad-fina",
      valores: 2,
      cambia: url.searchParams.get("cambia") ?? "a",
      ...medir(),
      trabajo_proporcional_a: "el número de lectores del valor que cambió",
      paquete_usado: "@vue/reactivity, publicado aparte y usable sin Vue",
      lectura:
        "el efecto que no leyó el `ref` cambiado no se vuelve a ejecutar. Y como el paquete es independiente, se puede usar fuera de un componente — algo que ni React ni Svelte ofrecen igual de limpio",
    });
    return;
  }

  if (url.pathname === "/modelos.json") {
    json({ modelos: NOMBRES, ninguno_es_el_mejor: true, detalle: MODELOS });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
