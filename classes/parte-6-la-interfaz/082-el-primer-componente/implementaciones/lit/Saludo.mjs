import { LitElement, html } from "lit";

/**
 * EL COMPONENTE. Un ELEMENTO PERSONALIZADO del navegador.
 *
 * Aquí está la diferencia grande de Lit con los otros siete: lo que se define no
 * es una función ni un objeto del framework, es **una etiqueta HTML nueva**.
 * `<mi-saludo texto="...">` funciona en cualquier página, con o sin Lit
 * alrededor, porque los elementos personalizados son parte del estándar del
 * navegador desde 2018.
 *
 * `static properties` declara qué atributos del HTML se convierten en
 * propiedades del objeto. Es la misma idea que `props` en Vue, con una
 * diferencia importante: aquí el puente es con **atributos de HTML**, que
 * siempre son texto.
 */
export class Saludo extends LitElement {
  static properties = {
    texto: { type: String },
  };

  // `createRenderRoot` devolviendo el propio elemento desactiva el DOM en la
  // sombra. Sin esto, el marcado quedaría dentro de un `<template shadowroot>`
  // y el contrato —que mira el HTML como texto— vería otra cosa.
  //
  // Es una decisión real, no un apaño para la clase: el DOM en la sombra aísla
  // los estilos y complica el renderizado en el servidor, y muchos proyectos lo
  // desactivan por eso mismo.
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<h1 data-componente="saludo">${this.texto ?? "Hola, mundo"}</h1>`;
  }
}

customElements.define("mi-saludo", Saludo);
