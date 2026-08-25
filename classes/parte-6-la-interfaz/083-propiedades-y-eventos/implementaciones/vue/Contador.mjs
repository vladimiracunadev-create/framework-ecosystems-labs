import { h } from "vue";

/**
 * EL HIJO. Declara lo que recibe Y lo que emite.
 *
 * Aquí está la diferencia con React, y es de las que se notan en un equipo:
 * `emits: ["cambiar"]` es **un contrato de salida declarado**. Cualquiera que
 * abra el archivo sabe qué eventos puede escuchar sin leer el cuerpo del
 * componente.
 *
 * En React esa lista no existe: hay que buscar qué propiedades resultan ser
 * funciones. Aquí está escrita, y Vue la usa para distinguir un evento propio de
 * un evento nativo del DOM que se propaga.
 *
 * La regla de fondo es la misma que en las ocho: **el hijo no cambia la
 * propiedad**. Vue lo lleva más lejos que casi ninguna — en desarrollo, mutar
 * una propiedad desde el hijo produce un aviso en la consola.
 */
export const Contador = {
  name: "Contador",
  props: {
    valor: { type: Number, required: true },
  },
  emits: ["cambiar"],
  render() {
    return h(
      "div",
      { "data-hijo": "contador", "data-valor": String(this.valor) },
      [
        h("span", null, String(this.valor)),
        h("button", { onClick: () => this.$emit("cambiar", 1) }, "+1"),
        h("button", { onClick: () => this.$emit("cambiar", -1) }, "-1"),
      ],
    );
  },
};
