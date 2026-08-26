import { h } from "vue";

import { siguiente } from "./reglas.mjs";

/**
 * VUE TIENE UN ATAJO PARA LAS DOS DIRECCIONES: `v-model`.
 *
 * En una plantilla se escribe `<input v-model="texto">` y ya está: el campo lee
 * del estado y lo escribe al teclear. Es la diferencia más visible con React, y
 * es la razón de que los formularios de Vue tengan fama de cómodos.
 *
 * Aquí, desde una función de render, se ve **en qué se convierte ese atajo**:
 * exactamente lo mismo que escribe React a mano — un `value` y un manejador.
 * `v-model` no añade magia: quita la mitad de las teclas.
 *
 * Y tiene una consecuencia práctica que conviene conocer: con `v-model` puro no
 * hay sitio donde meter la normalización. Para eso están los modificadores
 * —`v-model.trim`, `.number`— y, cuando no bastan, hay que abrir el atajo en sus
 * dos mitades como está aquí.
 */
export const CampoControlado = {
  name: "CampoControlado",
  props: {
    texto: { type: String, default: "" },
    alEscribir: { type: Function, default: () => {} },
  },
  render() {
    return h("input", {
      "data-campo": "controlado",
      value: this.texto,
      onInput: (evento) => this.alEscribir(siguiente(this.texto, evento.target.value.slice(-1))),
    });
  },
};

/** CAMPO NO CONTROLADO: el valor de partida y nada más. */
export const CampoNoControlado = {
  name: "CampoNoControlado",
  props: { texto: { type: String, default: "" } },
  render() {
    return h("input", { "data-campo": "no-controlado", value: this.texto });
  },
};
