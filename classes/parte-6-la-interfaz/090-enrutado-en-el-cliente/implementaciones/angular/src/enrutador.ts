/**
 * UN ENRUTADOR ES UNA TABLA Y UNA FUNCIÓN DE EMPAREJAMIENTO.
 *
 * En Angular esa tabla existe de verdad y tiene un tipo: `Routes`, del paquete
 * `@angular/router`, que **viene en el framework**. Es el único de los cuatro
 * que no obliga a elegir biblioteca.
 *
 * La tabla real se escribe así:
 *
 *   const rutas: Routes = [
 *     { path: "", component: Inicio },
 *     { path: "tareas/nueva", component: Nueva },
 *     { path: "tareas/:id", component: Detalle },
 *     { path: "**", component: NoEncontrada },
 *   ];
 *
 * Aquí se reescribe la lógica a mano para que el emparejamiento se vea, que es
 * lo que la clase enseña. Y hay una diferencia de comportamiento que sí importa:
 * **el enrutador de Angular empareja en orden**, como esta versión, así que
 * poner `tareas/:id` antes que `tareas/nueva` rompe la aplicación igual.
 */
export interface Ruta {
  patron: string;
  pantalla: string;
}

export const RUTAS: Ruta[] = [
  { patron: "/", pantalla: "inicio" },
  { patron: "/tareas", pantalla: "listado" },
  { patron: "/tareas/nueva", pantalla: "nueva" },
  { patron: "/tareas/:id", pantalla: "detalle" },
];

export interface Emparejamiento {
  coincide: boolean;
  parametros: Record<string, string>;
}

export function emparejar(patron: string, ruta: string): Emparejamiento {
  const esperados = patron.split("/").filter(Boolean);
  const recibidos = ruta.split("/").filter(Boolean);

  if (esperados.length !== recibidos.length) return { coincide: false, parametros: {} };

  const parametros: Record<string, string> = {};
  for (let i = 0; i < esperados.length; i += 1) {
    if (esperados[i].startsWith(":")) {
      parametros[esperados[i].slice(1)] = recibidos[i];
      continue;
    }
    if (esperados[i] !== recibidos[i]) return { coincide: false, parametros: {} };
  }
  return { coincide: true, parametros };
}

export function resolver(ruta: string) {
  for (const entrada of RUTAS) {
    const { coincide, parametros } = emparejar(entrada.patron, ruta);
    if (coincide) return { ...entrada, parametros, encontrada: true };
  }
  return { patron: "**", pantalla: "no-encontrada", parametros: {}, encontrada: false };
}
