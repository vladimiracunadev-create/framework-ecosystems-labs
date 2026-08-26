import { h, onMounted, onUnmounted, ref, watch } from "vue";

import { cuenta } from "./contadores.mjs";

/**
 * VUE SEPARA LO QUE REACT JUNTA.
 *
 * Donde React tiene un solo `useEffect` con una lista de dependencias, Vue tiene
 * dos herramientas distintas y cada una dice para qué es:
 *
 *   - `onMounted` / `onUnmounted`: el ciclo de vida. Ocurre una vez.
 *   - `watch`: reaccionar a que un dato concreto cambió.
 *
 * Esa separación evita el error más común de `useEffect` —usarlo para lo que no
 * es— y a cambio obliga a saber cuál toca. Quien viene de React suele buscar el
 * equivalente de `useEffect` y encuentra dos, y esa es exactamente la pregunta
 * que hay que hacerse: ¿esto es ciclo de vida o es reaccionar a un cambio?
 *
 * `onMounted` NO se ejecuta en el servidor, igual que `useEffect`: montar es
 * algo que pasa en el navegador.
 */
export const Reloj = {
  name: "Reloj",
  props: { etiqueta: { type: String, default: "reloj" } },
  setup(props) {
    // `setup` SÍ corre en el servidor: es donde se prepara el componente.
    cuenta.render += 1;
    const dato = ref("sin cargar");

    onMounted(() => {
      cuenta.efecto += 1;
      dato.value = "cargado en el navegador";
    });

    onUnmounted(() => {
      cuenta.limpieza += 1;
    });

    // Reaccionar a un cambio es OTRA cosa, y se declara aparte.
    watch(
      () => props.etiqueta,
      () => {
        cuenta.efecto += 1;
      },
    );

    return { dato };
  },
  render() {
    return h(
      "div",
      { "data-componente": "reloj", "data-etiqueta": this.etiqueta },
      this.dato,
    );
  },
};
