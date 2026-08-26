import { ssr, escape } from "solid-js/web";

/**
 * EN SOLID NO HAY CLAVES, Y NO ES UN OLVIDO.
 *
 * `<For>` —el componente que se usa para listas— identifica cada elemento **por
 * su referencia**, no por una clave que tú escribas. Si el objeto es el mismo
 * objeto, es el mismo elemento; si es otro, es otro.
 *
 * La consecuencia es doble y conviene tenerla clara:
 *
 *   - no se puede equivocar uno escribiendo la clave, porque no hay clave;
 *   - pero sí se puede equivocar creando objetos nuevos en cada render — y ahí
 *     Solid piensa que la lista entera cambió, aunque los datos sean iguales.
 *
 * El error cambia de sitio: de «puse mal la clave» a «recreé los objetos».
 *
 * (Existe `<Index>` para el caso contrario: cuando lo que importa es la
 * posición y no el elemento. Elegir entre los dos es la decisión que en las
 * otras siete se toma escribiendo o no una clave.)
 */
export function Lista(props) {
  const elementos = () => props.elementos ?? [];
  const filas = elementos()
    .map(
      (fruta) =>
        `<li data-clave="${escape(fruta.id)}">${escape(fruta.nombre)}</li>`,
    )
    .join("");

  return ssr(
    ['<ul data-lista="frutas" data-total="', '">', "</ul>"],
    escape(String(elementos().length)),
    filas,
  );
}
