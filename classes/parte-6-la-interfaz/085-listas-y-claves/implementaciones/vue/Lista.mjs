import { h } from "vue";

/**
 * `key` EN VUE ES UN ATRIBUTO ESPECIAL, NO UNA PROPIEDAD.
 *
 * En una plantilla se escribe `:key="fruta.id"` junto a `v-for`. Desde una
 * función de render es el mismo campo `key` del nodo virtual, y como en React
 * **no llega al HTML**: es para el algoritmo que compara árboles.
 *
 * Vue tiene aquí una regla de estilo que merece conocerse porque su verificador
 * la impone: `v-for` sin `key` es un ERROR de linter en la configuración
 * recomendada. No es el framework quien obliga, es la herramienta — y en la
 * práctica funciona igual de bien.
 */
export const Lista = {
  name: "Lista",
  props: { elementos: { type: Array, required: true } },
  render() {
    return h(
      "ul",
      { "data-lista": "frutas", "data-total": String(this.elementos.length) },
      this.elementos.map((fruta) =>
        h("li", { key: fruta.id, "data-clave": fruta.id }, fruta.nombre),
      ),
    );
  },
};

/** LA MISMA LISTA SIN CLAVE. */
export const ListaSinClave = {
  name: "ListaSinClave",
  props: { elementos: { type: Array, required: true } },
  render() {
    return h(
      "ul",
      { "data-lista": "frutas", "data-total": String(this.elementos.length) },
      this.elementos.map((fruta) => h("li", { "data-clave": fruta.id }, fruta.nombre)),
    );
  },
};
