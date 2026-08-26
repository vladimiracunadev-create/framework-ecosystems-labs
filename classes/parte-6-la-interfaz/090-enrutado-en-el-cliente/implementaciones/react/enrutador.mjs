/**
 * UN ENRUTADOR ES UNA TABLA Y UNA FUNCIÓN DE EMPAREJAMIENTO.
 *
 * Eso es todo. React Router, Vue Router, el enrutador de Angular y el de
 * SvelteKit añaden navegación sin recarga, carga perezosa, guardias y
 * transiciones — pero por debajo, lo que deciden qué se pinta son estas veinte
 * líneas.
 *
 * Y como son lógica pura, **se pueden ejecutar en el servidor**. Por eso esta
 * clase se puede verificar sin navegador: pedir `/tareas/42` y comprobar que
 * sale el detalle es exactamente lo que hace el enrutador del cliente, solo que
 * en otro proceso.
 */

/**
 * EL ORDEN IMPORTA, y por eso la tabla es una lista y no un objeto.
 *
 * `/tareas/nueva` va ANTES que `/tareas/:id`, porque si no, «nueva» se comería
 * el hueco del identificador y siempre ganaría el detalle. Es la misma decisión
 * que la clase 012 tomó en el servidor, con la diferencia de que allí algunos
 * frameworks ordenan por especificidad y aquí lo ordenas tú.
 */
export const RUTAS = [
  { patron: "/", pantalla: "inicio" },
  { patron: "/tareas", pantalla: "listado" },
  { patron: "/tareas/nueva", pantalla: "nueva" },
  { patron: "/tareas/:id", pantalla: "detalle" },
];

/**
 * EMPAREJAR: comparar segmento a segmento y recoger los parámetros.
 *
 * Los patrones de verdad admiten comodines, segmentos opcionales y expresiones
 * regulares. Esta versión cubre lo único que importa para entender el modelo:
 * un segmento que empieza por dos puntos captura, y todos los demás tienen que
 * coincidir exactamente.
 */
export function emparejar(patron, ruta) {
  const esperados = patron.split("/").filter(Boolean);
  const recibidos = ruta.split("/").filter(Boolean);

  // Distinto número de segmentos es «no coincide». Sin esta línea, `/tareas`
  // emparejaría con `/tareas/:id` y el parámetro llegaría vacío.
  if (esperados.length !== recibidos.length) return { coincide: false, parametros: {} };

  const parametros = {};
  for (let i = 0; i < esperados.length; i += 1) {
    if (esperados[i].startsWith(":")) {
      parametros[esperados[i].slice(1)] = recibidos[i];
      continue;
    }
    if (esperados[i] !== recibidos[i]) return { coincide: false, parametros: {} };
  }
  return { coincide: true, parametros };
}

/** Recorre la tabla EN ORDEN y devuelve la primera que empareja. */
export function resolver(ruta) {
  for (const entrada of RUTAS) {
    const { coincide, parametros } = emparejar(entrada.patron, ruta);
    if (coincide) return { ...entrada, parametros, encontrada: true };
  }
  return { patron: null, pantalla: "no-encontrada", parametros: {}, encontrada: false };
}
