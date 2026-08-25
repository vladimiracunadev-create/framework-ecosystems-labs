import { LitElement, html } from "lit";

import { siguiente } from "./reglas.mjs";

/**
 * EL ESTADO ES UN CAMPO DE LA CLASE, MARCADO COMO INTERNO.
 *
 * `state: true` es la diferencia con la clase 082: una propiedad normal tiene
 * puente con un atributo de HTML —se puede poner desde fuera con
 * `<mi-contador valor="3">`— y una de estado, no. Es privada del elemento.
 *
 * Que el estado sea un campo de un objeto tiene una ventaja que los otros siete
 * no dan: **cada instancia es un objeto de verdad**, con su identidad. Se puede
 * hacer `document.querySelector("mi-contador").valor` y ahí está.
 *
 * Y tiene la contrapartida: escribir en el campo dispara el redibujado, así que
 * `this.valor = ...` no es una asignación cualquiera aunque lo parezca.
 */
export class Contador extends LitElement {
  static properties = {
    id: { type: String },
    valor: { state: true },
  };

  constructor() {
    super();
    this.valor = 0;
  }

  // Los atributos llegan como texto, y el estado inicial se toma de ahí una
  // sola vez. Es el equivalente del `inicial` de React: una entrada, no el
  // estado.
  connectedCallback() {
    super.connectedCallback();
    const inicial = Number(this.getAttribute("inicial") ?? 0);
    if (!Number.isNaN(inicial)) this.valor = inicial;
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`<div data-instancia=${this.id ?? "sola"} data-valor=${this.valor}>
      <span>${this.valor}</span>
      <button @click=${() => (this.valor = siguiente(this.valor, 1))}>+1</button>
      <button @click=${() => (this.valor = siguiente(this.valor, -1))}>-1</button>
    </div>`;
  }
}

customElements.define("mi-contador", Contador);
