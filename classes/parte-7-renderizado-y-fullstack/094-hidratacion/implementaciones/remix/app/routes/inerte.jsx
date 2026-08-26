import { TAREAS } from "../datos.js";

/**
 * SIN `loader` Y SIN ESTADO, PERO NO SIN JAVASCRIPT.
 *
 * Esta ruta no tiene `loader`, así que la lista no se serializa: el dato viaja
 * una sola vez, pintado. Y no tiene nada interactivo, así que no hay manejadores
 * que atar.
 *
 * Pero la aplicación de Remix arranca igual, porque `<Scripts />` está en el
 * documento raíz y no distingue rutas. Es la diferencia entre **no serializar
 * estado** y **no hidratar**, y esta pantalla enseña la primera sin conseguir la
 * segunda.
 *
 * Quien quiera lo segundo en Remix tiene una sola salida: no poner `<Scripts />`
 * en absoluto y aceptar que el sitio entero funcione con HTML y formularios. La
 * clase 103 lleva esa idea hasta el final.
 */
export default function Inerte() {
  return (
    <>
      <h1>Sin hidratar</h1>
      <section data-hidratacion="no">
        <ul>
          {TAREAS.map((tarea) => (
            <li key={tarea}>{tarea}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
