import { ssr, escape } from "solid-js/web";

/**
 * EN SOLID EL CAMPO CONTROLADO NO REDIBUJA NADA.
 *
 * Y esa es la diferencia de fondo con React, aunque el código se parezca. En
 * React, cada tecla vuelve a ejecutar el componente entero y el `<input>` se
 * compara con su versión anterior. En Solid, el componente se ejecutó una vez:
 * lo que hay atado al estado es **el atributo**, y cambiarlo escribe
 * directamente en el nodo.
 *
 * Por eso Solid no sufre el problema clásico del cursor que salta al principio
 * del campo: no reemplaza el elemento, le cambia una propiedad.
 *
 * Y no trae atajo bidireccional: como en React, las dos mitades se escriben. Eso
 * es más verboso y deja el hueco donde meter la normalización, que con `v-model`
 * o `bind:value` hay que recuperar aparte.
 */
export function CampoControlado(props) {
  const texto = () => props.texto ?? "";
  return ssr(['<input data-campo="controlado" value="', '">'], escape(texto()));
}

/** CAMPO NO CONTROLADO: el valor de partida y nada más. */
export function CampoNoControlado(props) {
  return ssr(['<input data-campo="no-controlado" value="', '">'], escape(props.texto ?? ""));
}
