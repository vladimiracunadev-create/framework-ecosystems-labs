import { listar } from "../../almacen";

/**
 * LA LISTA, SERVIDA COMO API, Y NO ES UNA COMPLICACIÓN GRATUITA.
 *
 * En Nuxt las rutas de servidor —Nitro— y el renderizado de las páginas se
 * empaquetan por separado. Un módulo importado desde los dos sitios acaba
 * duplicado: **son dos instancias distintas en memoria**, y una escritura hecha
 * desde una ruta de servidor no se ve desde la página.
 *
 * Se descubre exactamente así: escribiendo, recargando y viendo que no está.
 *
 * La forma idiomática de arreglarlo es la de aquí: el estado vive en el lado de
 * Nitro y la página lo pide con `useFetch`. Es una petición HTTP más, y a cambio
 * hay una sola copia del almacén.
 */
export default defineEventHandler(() => ({ tareas: listar() }));
