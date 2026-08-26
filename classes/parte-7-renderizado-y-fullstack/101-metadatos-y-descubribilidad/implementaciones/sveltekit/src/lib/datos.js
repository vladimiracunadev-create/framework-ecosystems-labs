/**
 * LO QUE HAY QUE PUBLICAR, IDÉNTICO EN LAS CINCO IMPLEMENTACIONES.
 *
 * Dos rutas y dos juegos de metadatos. El detalle que importa no es el
 * contenido: es que **cada ruta tiene los suyos** y que salen ya escritos en el
 * primer HTML.
 *
 * Un rastreador de una red social no ejecuta JavaScript. Si el título y la
 * descripción se ponen desde el navegador, el enlace compartido sale con el
 * título de la plantilla y sin imagen. Es el fallo de descubribilidad más caro
 * y el más fácil de no ver, porque en el navegador se ve bien.
 */
export const PORTADA = {
  titulo: "Tareas de Ada",
  descripcion: "Una lista de tres tareas y ninguna promesa de productividad.",
  ruta: "/",
  tipo: "website",
};

export const ARTICULO = {
  identificador: "hola-mundo",
  titulo: "Hola mundo, otra vez",
  descripcion: "Por que el primer programa de todo el mundo sigue ensenando algo.",
  ruta: "/articulo/hola-mundo",
  tipo: "article",
  publicado: "2026-03-14",
  autor: "Ada",
};

/** El grafo de la entidad, en el formato que leen los buscadores. Es lo mismo
 *  que las etiquetas de arriba dicho otra vez y en otro idioma, y esa
 *  duplicación es la parte que ningún framework ahorra. */
export function grafoDelArticulo(origen) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ARTICULO.titulo,
    description: ARTICULO.descripcion,
    datePublished: ARTICULO.publicado,
    author: { "@type": "Person", name: ARTICULO.autor },
    url: `${origen}${ARTICULO.ruta}`,
  };
}
