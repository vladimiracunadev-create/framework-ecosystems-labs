/**
 * LOS TRES MODELOS DE REACTIVIDAD, Y NINGUNO ES EL MEJOR.
 *
 * Todas las tecnologías de interfaz resuelven la misma pregunta —«un dato ha
 * cambiado, ¿qué hay que volver a pintar?»— y solo hay tres respuestas
 * conocidas. Las ocho del elenco caen en una de ellas.
 *
 * La comparación honesta no es cuál va más rápido: es **dónde pone cada uno el
 * trabajo** y qué se paga por ello.
 */
export const MODELOS: Record<string, Record<string, unknown>> = {
  "arbol-virtual": {
    nombre: "Árbol virtual",
    como_funciona:
      "el componente se vuelve a EJECUTAR entero, produce un árbol nuevo y el framework lo compara con el anterior para aplicar solo las diferencias",
    quien_lo_usa: ["React"],
    que_gana:
      "el modelo mental más simple que existe: la interfaz es una función del estado, y no hay que declarar qué depende de qué",
    que_paga:
      "trabajo proporcional al tamaño del árbol, no al del cambio; y envoltorios de memoria —useMemo, useCallback— para evitar recalcular lo que no cambió",
    cuando_se_nota:
      "listas grandes y árboles profundos: cambiar un número puede reejecutar cien componentes para acabar tocando un nodo",
  },
  "reactividad-fina": {
    nombre: "Reactividad fina",
    como_funciona:
      "leer un valor SUSCRIBE al lector; al escribirlo se avisa solo a quien lo leyó, y se actualiza ese hueco del marcado sin volver a ejecutar el componente",
    quien_lo_usa: ["SolidJS", "Vue", "Svelte", "Angular con señales", "Lit", "Alpine.js"],
    que_gana:
      "el trabajo es proporcional al cambio: da igual el tamaño del árbol, y no hacen falta envoltorios de memoria",
    que_paga:
      "el valor deja de ser un valor y pasa a ser una caja —`.value`, `valor()`, `$state`— y hay que leerlo donde toca, o la suscripción no se establece",
    cuando_se_nota:
      "en cuanto la aplicación crece; y también al depurar, porque «quién provocó esta actualización» tiene una respuesta más indirecta",
  },
  "sin-reactividad-en-el-cliente": {
    nombre: "Sin reactividad en el cliente",
    como_funciona:
      "no hay estado en el navegador que vigilar: cuando algo cambia se pide al servidor el fragmento nuevo y se sustituye el trozo de página",
    quien_lo_usa: ["htmx"],
    que_gana:
      "una sola fuente de verdad y cero código de sincronización; el estado vive donde viven los datos",
    que_paga: "una ida y vuelta por cada cambio, y sin red no hay interfaz",
    cuando_se_nota:
      "en interacciones que deben ser instantáneas —arrastrar, escribir, validar en vivo— donde la latencia se ve",
  },
};

export const NOMBRES = Object.keys(MODELOS);

/**
 * LOS DOS VALORES DEL EXPERIMENTO.
 *
 * Independientes a propósito: nada de lo que se calcula con `a` depende de `b`.
 * Así, cuando cambia `a`, la pregunta «¿cuánto se recalcula?» tiene una
 * respuesta correcta —uno— y cada modelo se acerca o no a ella.
 */
export const VALORES = { a: 1, b: 100 };
