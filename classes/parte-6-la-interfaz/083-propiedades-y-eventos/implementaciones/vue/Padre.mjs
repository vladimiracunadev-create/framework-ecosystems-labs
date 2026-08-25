import { h } from "vue";

import { Contador } from "./Contador.mjs";

/**
 * EL PADRE. Escucha el evento declarado y decide.
 *
 * `onCambiar` en las propiedades del hijo es cómo Vue conecta un `$emit` desde
 * una función de render. En una plantilla `.vue` se escribiría
 * `@cambiar="alRecibirCambio"`, que es lo mismo con azúcar.
 *
 * `alRecibirCambio` está exportada aparte para que el contrato pueda llamarla:
 * una función que calcula el estado siguiente a partir del actual y del evento
 * se prueba sola, sin navegador y sin framework.
 */
export function alRecibirCambio(valorActual, paso) {
  return valorActual + paso;
}

export const Padre = {
  name: "Padre",
  props: {
    valor: { type: Number, default: 0 },
  },
  render() {
    return h("div", { "data-padre": "app" }, [
      h(Contador, {
        valor: this.valor,
        onCambiar: (paso) => alRecibirCambio(this.valor, paso),
      }),
    ]);
  },
};
