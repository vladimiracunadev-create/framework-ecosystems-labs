/**
 * LAS TRES DECISIONES, CON SU MOTIVO, IDÉNTICAS EN LAS CINCO IMPLEMENTACIONES.
 *
 * Este objeto es el resultado de esta parte entera. No dice qué estrategia usa
 * cada pantalla —eso se ve pidiéndolas— sino **por qué**, y el porqué se
 * responde con tres preguntas que no son técnicas:
 *
 *   1. ¿Es igual para todo el mundo?
 *   2. ¿Cada cuánto cambia, comparado con cada cuánto se despliega?
 *   3. ¿Importa el primer pintado?
 *
 * Las tres son sobre el producto. Ninguna es sobre el framework, y esa es la
 * conclusión de la parte 7.
 */
export const DECISIONES = {
  catalogo: {
    estrategia: "estatico",
    es_igual_para_todo_el_mundo: true,
    cada_cuanto_cambia: "cuando se publica un producto, unas veces al mes",
    importa_el_primer_pintado: true,
    por_que:
      "lo ve todo el mundo, es igual para todos y cambia menos que los despliegues: no hay motivo para que un proceso trabaje por cada visita",
    que_se_paga: "que un producto publicado no aparezca hasta la siguiente construccion",
  },
  panel: {
    estrategia: "servidor",
    es_igual_para_todo_el_mundo: false,
    cada_cuanto_cambia: "a cada minuto, y depende de quien mira",
    importa_el_primer_pintado: true,
    por_que:
      "las cifras son de quien ha entrado y cambian mientras se miran: cachearlas es enseñar datos de otro o datos viejos",
    que_se_paga: "un proceso trabajando por cada visita, y una latencia que crece con la consulta",
  },
  editor: {
    estrategia: "cliente",
    es_igual_para_todo_el_mundo: false,
    cada_cuanto_cambia: "a cada tecla",
    importa_el_primer_pintado: false,
    por_que:
      "esta detras de un acceso, nadie lo comparte y lo que importa es la interaccion: el primer pintado se puede pagar una vez",
    que_se_paga: "una pantalla vacia mientras carga, y nada indexable",
  },
};

export const PANTALLAS = ["catalogo", "panel", "editor"];
export const ESTRATEGIAS = ["estatico", "servidor", "cliente"];

/** Las tres preguntas, escritas para poder hacerlas en una reunión. */
export const LAS_TRES_PREGUNTAS = [
  "¿es igual para todo el mundo?",
  "¿cambia mas o menos a menudo que los despliegues?",
  "¿importa el primer pintado?",
];
