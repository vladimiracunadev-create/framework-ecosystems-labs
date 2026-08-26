import { createElement as h } from "react";

import { siguiente } from "./reglas.mjs";

/**
 * CAMPO CONTROLADO: el valor viene del estado, y solo del estado.
 *
 * `value` atado a una variable convierte al `<input>` en una pantalla: no
 * guarda nada, muestra lo que el estado diga. Si `onChange` no llamara al
 * asignador, el campo **no cambiaría al escribir** — y ese es el clásico
 * «mi input no me deja teclear» de quien empieza con React.
 *
 * A cambio, el valor está siempre disponible sin preguntarle al DOM, se puede
 * validar y normalizar en cada pulsación, y dos campos pueden depender uno del
 * otro sin esfuerzo.
 */
export function CampoControlado({ texto = "", alEscribir = () => {} }) {
  return h("input", {
    "data-campo": "controlado",
    value: texto,
    onChange: (evento) => alEscribir(siguiente(texto, evento.target.value.slice(-1))),
  });
}

/**
 * CAMPO NO CONTROLADO: el dueño del valor es el elemento del navegador.
 *
 * `defaultValue` pone el valor de partida y se desentiende. A partir de ahí el
 * `<input>` guarda lo suyo y React no se entera — para leerlo hay que ir a
 * buscarlo con una referencia.
 *
 * No es peor: es el comportamiento de un formulario de HTML de siempre, y para
 * un formulario que solo se lee al enviar es más simple y más rápido.
 */
export function CampoNoControlado({ texto = "" }) {
  return h("input", { "data-campo": "no-controlado", defaultValue: texto });
}
