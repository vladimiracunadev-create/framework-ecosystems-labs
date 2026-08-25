import { h } from "vue";

/**
 * EL COMPONENTE. Un objeto que declara sus propiedades y su función de render.
 *
 * Aquí está la primera diferencia con React: las propiedades **se declaran**.
 * `props: { texto: { ... } }` no es documentación, es la lista de lo que el
 * componente acepta — Vue usa esa lista para separar propiedades de atributos
 * sueltos, y para avisar cuando falta una obligatoria.
 *
 * En un proyecto real esto se escribiría en un archivo `.vue` con `<template>`,
 * y eso necesita compilador. La función de render es lo que ese compilador
 * produce, y por eso se usa aquí: mismo modelo, sin herramienta por delante.
 */
export const Saludo = {
  name: "Saludo",
  props: {
    texto: { type: String, default: "Hola, mundo" },
  },
  render() {
    return h("h1", { "data-componente": "saludo" }, this.texto);
  },
};
