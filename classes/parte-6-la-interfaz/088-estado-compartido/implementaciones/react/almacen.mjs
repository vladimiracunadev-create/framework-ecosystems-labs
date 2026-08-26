/**
 * EL ALMACÉN. Un dato con dueño único y dos operaciones.
 *
 * Deliberadamente pequeño: un objeto, un lector y un escritor. La mayoría de las
 * bibliotecas de estado compartido —Redux, Zustand, Pinia, Nanostores— son esto
 * más suscripciones, herramientas de depuración y convenciones.
 *
 * Lo que importa de esta clase no es la biblioteca: es que **el dato deja de
 * viajar por el árbol**. Quien lo necesita lo pide; quien no, ni se entera.
 *
 * Y el precio, que hay que decirlo: el componente que lee del almacén ya no es
 * una función de sus propiedades. Depende de algo de fuera, así que probarlo
 * exige preparar ese algo.
 */
const estado = { usuario: "sin usuario" };

export function leer() {
  return estado.usuario;
}

export function escribir(valor) {
  estado.usuario = valor;
  return estado.usuario;
}
