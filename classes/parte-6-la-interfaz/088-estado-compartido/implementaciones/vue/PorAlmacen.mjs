import { h } from "vue";

import { leer } from "./almacen.mjs";

/**
 * EL MISMO ÁRBOL, SIN QUE EL DATO LO ATRAVIESE.
 *
 * `Medio` y `Rama` ya no declaran nada. Su lista de propiedades está vacía, que
 * es la señal más clara de que no dependen del usuario.
 */
export const Nieto = {
  name: "Nieto",
  render() {
    return h("span", { "data-nivel": "nieto" }, leer());
  },
};

/** NIVEL INTERMEDIO. Sin propiedades: no sabe que hay un usuario. */
export const Medio = {
  name: "Medio",
  render() {
    return h("div", { "data-nivel": "medio" }, [h(Nieto)]);
  },
};

export const Rama = {
  name: "Rama",
  props: { lado: { type: String, default: "unica" } },
  render() {
    return h("div", { "data-nivel": "rama", "data-rama": this.lado }, [h(Medio)]);
  },
};

export const Pantalla = {
  name: "Pantalla",
  render() {
    return h("div", { "data-nivel": "pantalla" }, [h(Rama)]);
  },
};

export const DosRamas = {
  name: "DosRamas",
  render() {
    return h("div", { "data-nivel": "pantalla" }, [
      h(Rama, { lado: "izquierda" }),
      h(Rama, { lado: "derecha" }),
    ]);
  },
};
