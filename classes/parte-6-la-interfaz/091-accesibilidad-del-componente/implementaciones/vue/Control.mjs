import { h } from "vue";

/**
 * LA VERSIÓN ACCESIBLE.
 *
 * Vue tiene aquí una ventaja pequeña y real frente a React: **los atributos se
 * escriben como en HTML**. `for` es `for`, `class` es `class`. No hay que
 * recordar ningún renombrado, y eso quita una fuente de olvidos.
 *
 * A cambio no trae verificador de accesibilidad de serie: existe
 * `eslint-plugin-vuejs-accessibility`, es de la comunidad y hay que instalarlo a
 * propósito.
 */
export const ControlAccesible = {
  name: "ControlAccesible",
  props: { abierto: { type: Boolean, default: false } },
  render() {
    return h("div", { "data-version": "accesible" }, [
      h(
        "button",
        {
          type: "button",
          "aria-expanded": this.abierto ? "true" : "false",
          "aria-controls": "panel",
        },
        "Detalles",
      ),
      h("div", { id: "panel", hidden: !this.abierto }, "contenido"),
      h("label", { for: "titulo" }, "Título"),
      h("input", { id: "titulo", name: "titulo" }),
    ]);
  },
};

/**
 * LA VERSIÓN INACCESIBLE. Se ve exactamente igual.
 *
 * Y hay una trampa propia de Vue que merece señalarse: `v-if` quita el elemento
 * del árbol y `v-show` solo lo oculta con CSS. Para un lector de pantalla no es
 * lo mismo — lo que sigue en el árbol se puede leer aunque no se vea, salvo que
 * lleve `hidden` o `aria-hidden`.
 */
export const ControlInaccesible = {
  name: "ControlInaccesible",
  props: { abierto: { type: Boolean, default: false } },
  render() {
    return h("div", { "data-version": "inaccesible" }, [
      h("div", { class: this.abierto ? "boton abierto" : "boton" }, "Detalles"),
      h("div", { class: this.abierto ? "panel visible" : "panel" }, "contenido"),
      h("span", { class: "etiqueta" }, "Título"),
      h("input", { name: "titulo", tabindex: "-1" }),
    ]);
  },
};
