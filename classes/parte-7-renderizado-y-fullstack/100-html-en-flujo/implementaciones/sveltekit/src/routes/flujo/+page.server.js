import { nombreDeQuienMira, pedirLaLista } from "$lib/fuente.js";

/**
 * EL FLUJO DE SVELTEKIT SE DECLARA NO PONIENDO UN `await`.
 *
 * Lo que se devuelve resuelto —`nombre`— viaja en el primer trozo. Lo que se
 * devuelve como promesa —`tareas`— viaja después, cuando se resuelve, y
 * SvelteKit se encarga de coserlo.
 *
 * Es la declaración más discreta de las tres: no hay componente que envolver ni
 * etiqueta que añadir, solo un `await` que no se escribe. Y ahí está su riesgo,
 * que conviene decir: **quitar o poner ese `await` cambia el comportamiento de
 * la pantalla sin que se note al leer**.
 */
export function load() {
  return {
    nombre: nombreDeQuienMira(),
    tareas: pedirLaLista(),
  };
}
