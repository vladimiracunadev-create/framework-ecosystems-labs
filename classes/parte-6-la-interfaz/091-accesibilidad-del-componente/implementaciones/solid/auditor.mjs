/**
 * CINCO REGLAS DE ACCESIBILIDAD QUE SE PUEDEN COMPROBAR SOBRE EL MARCADO.
 *
 * No son las únicas ni las más difíciles: son las que un servidor puede
 * verificar sin navegador, y por eso están aquí. Una auditoría de verdad usa
 * axe-core sobre el DOM renderizado y mira además contraste, orden del foco y lo
 * que anuncia un lector de pantalla.
 *
 * Decirlo importa: **pasar estas cinco no significa que el componente sea
 * accesible**. Significa que no comete los cinco errores más comunes, que es un
 * suelo, no un techo.
 */
export const REGLAS = [
  {
    id: "elemento-nativo",
    dice: "un control interactivo es un <button> o un <a>, no un <div>",
    por_que:
      "el elemento nativo trae gratis el foco con teclado, la activación con Enter y Espacio, y el papel correcto para un lector de pantalla",
    comprobar: (html) => /<button[\s>]/.test(html),
  },
  {
    id: "nombre-accesible",
    dice: "el control tiene un nombre que un lector puede anunciar",
    por_que:
      "un botón que solo contiene un icono no dice nada: hace falta texto dentro, aria-label o aria-labelledby",
    comprobar: (html) =>
      /<button[^>]*>[^<]*\S[^<]*<\/button>/.test(html) || /aria-label=/.test(html),
  },
  {
    id: "etiqueta-asociada",
    dice: "cada campo tiene una <label> apuntando a su id",
    por_que:
      "sin asociación, el lector no dice qué se está pidiendo — y además pulsar la etiqueta deja de enfocar el campo",
    comprobar: (html) => {
      const etiqueta = html.match(/<label[^>]*for="([^"]+)"/);
      return Boolean(etiqueta) && new RegExp(`id="${etiqueta[1]}"`).test(html);
    },
  },
  {
    id: "estado-expuesto",
    dice: "si algo se abre y se cierra, el marcado lo dice",
    por_que:
      "el color y la flecha son información visual: aria-expanded es la misma información para quien no la ve",
    comprobar: (html) => /aria-expanded="(true|false)"/.test(html),
  },
  {
    id: "foco-alcanzable",
    dice: "no hay tabindex negativo en un control que se debe poder usar",
    por_que:
      "un tabindex de -1 saca el elemento del recorrido del teclado: quien no usa ratón no llega nunca",
    comprobar: (html) => !/tabindex="-1"/.test(html),
  },
];

export function auditar(html) {
  const resultados = REGLAS.map((regla) => ({
    id: regla.id,
    dice: regla.dice,
    cumple: regla.comprobar(html),
    por_que: regla.por_que,
  }));
  const incumplidas = resultados.filter((r) => !r.cumple);
  return {
    reglas: REGLAS.length,
    incumplidas: incumplidas.length,
    accesible: incumplidas.length === 0,
    detalle: resultados,
    aviso:
      "cinco reglas comprobables sobre el marcado no son una auditoría: el contraste, el orden del foco y lo que anuncia un lector necesitan un navegador",
  };
}
