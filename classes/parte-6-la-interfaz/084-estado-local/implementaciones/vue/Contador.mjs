import { h, ref } from "vue";

/**
 * `ref()` DECLARA UN DATO QUE VIVE DENTRO.
 *
 * Y aquí hay una diferencia real con React que se ve en la última línea: en Vue
 * `setup()` **se ejecuta una sola vez** por instancia. Lo que se vuelve a
 * ejecutar en cada cambio es solo la función de render.
 *
 * La consecuencia práctica es que las variables de `setup` no se recrean, así
 * que no hacen falta los envoltorios de memoria que en React sí — `useMemo`,
 * `useCallback`. Es el mismo motivo por el que Solid no los necesita.
 *
 * `.value` es el precio: el estado es una caja, y hay que abrirla para leerla.
 */
export const Contador = {
  name: "Contador",
  props: {
    id: { type: String, default: "sola" },
    inicial: { type: Number, default: 0 },
  },
  setup(props) {
    const valor = ref(props.inicial);
    const cambiar = (paso) => {
      valor.value = siguiente(valor.value, paso);
    };
    return { valor, cambiar };
  },
  render() {
    return h(
      "div",
      { "data-instancia": this.id, "data-valor": String(this.valor) },
      [
        h("span", null, String(this.valor)),
        h("button", { onClick: () => this.cambiar(1) }, "+1"),
        h("button", { onClick: () => this.cambiar(-1) }, "-1"),
      ],
    );
  },
};

/** LA REGLA VIVE CON EL ESTADO, y se prueba sin renderizar nada. */
export function siguiente(valorActual, paso) {
  return Math.max(0, valorActual + paso);
}
