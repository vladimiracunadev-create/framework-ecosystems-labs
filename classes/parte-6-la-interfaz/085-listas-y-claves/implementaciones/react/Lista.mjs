import { createElement as h } from "react";

/**
 * LA CLAVE NO ES UN ATRIBUTO: ES UNA INSTRUCCIÓN PARA EL FRAMEWORK.
 *
 * `key` no aparece en el HTML resultante. No es para el navegador — es para
 * React, que la usa al comparar el árbol anterior con el nuevo y decidir qué
 * elementos son «el mismo de antes» y cuáles son nuevos.
 *
 * Por eso `data-clave` está aparte: el contrato necesita VER la identidad en el
 * marcado, y `key` no se ve. Es una diferencia que confunde a mucha gente al
 * inspeccionar el DOM y no encontrarla.
 *
 * Y por eso usar el índice como clave es un error tan común: el índice
 * identifica el HUECO, no el elemento. Al reordenar, el hueco 0 sigue siendo el
 * hueco 0 y React cree que nada cambió de sitio — así que mueve el contenido y
 * deja el estado local donde estaba.
 */
export function Lista({ elementos }) {
  return h(
    "ul",
    { "data-lista": "frutas", "data-total": String(elementos.length) },
    elementos.map((fruta) =>
      h("li", { key: fruta.id, "data-clave": fruta.id }, fruta.nombre),
    ),
  );
}

/** LA MISMA LISTA SIN CLAVE. En React se puede: solo avisa. */
export function ListaSinClave({ elementos }) {
  return h(
    "ul",
    { "data-lista": "frutas", "data-total": String(elementos.length) },
    elementos.map((fruta) => h("li", { "data-clave": fruta.id }, fruta.nombre)),
  );
}
