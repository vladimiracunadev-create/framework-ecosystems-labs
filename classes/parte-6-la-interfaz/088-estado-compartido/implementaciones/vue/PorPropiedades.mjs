import { h } from "vue";

/**
 * EL DATO ATRAVESANDO TRES NIVELES.
 *
 * `Medio` y `Rama` declaran `usuario` en sus `props` y no lo usan: solo lo
 * pasan. En Vue eso se ve incluso más que en React, porque las propiedades se
 * declaran explícitamente — la lista de lo que un componente acepta está
 * escrita, y ahí aparece un dato que no le sirve de nada.
 *
 * Vue tiene además un atajo para esto que conviene conocer antes de saltar a un
 * almacén: `provide` / `inject`. Un ancestro provee un valor y cualquier
 * descendiente lo inyecta, sin tocar los niveles intermedios. Es el equivalente
 * del contexto de React, y resuelve el problema sin traer una biblioteca.
 */
export const Nieto = {
  name: "Nieto",
  props: { usuario: { type: String, required: true } },
  render() {
    return h("span", { "data-nivel": "nieto" }, this.usuario);
  },
};

/** NIVEL INTERMEDIO. Declara `usuario` y no lo usa: solo lo pasa. */
export const Medio = {
  name: "Medio",
  props: { usuario: { type: String, required: true } },
  render() {
    return h("div", { "data-nivel": "medio" }, [h(Nieto, { usuario: this.usuario })]);
  },
};

export const Rama = {
  name: "Rama",
  props: { usuario: { type: String, required: true } },
  render() {
    return h("div", { "data-nivel": "rama" }, [h(Medio, { usuario: this.usuario })]);
  },
};

export const Pantalla = {
  name: "Pantalla",
  props: { usuario: { type: String, required: true } },
  render() {
    return h("div", { "data-nivel": "pantalla" }, [h(Rama, { usuario: this.usuario })]);
  },
};

export const COSTE = {
  niveles_que_atraviesa: 3,
  niveles_que_no_usan_el_dato: 2,
};
