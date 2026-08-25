/**
 * Preguntas al catálogo.
 *
 * Hay clases —la 004 es la primera— cuyo contenido no es un servidor que
 * responde, sino una AFIRMACIÓN sobre cómo se clasifican las tecnologías. «React
 * no compite con Next.js» no se demuestra levantando un puerto.
 *
 * Pero tampoco puede quedarse en prosa, porque entonces vale lo mismo que
 * cualquier hilo de opiniones. Así que estas clases se verifican contra
 * `catalog/frameworks.json`, que es el catálogo del repositorio y el único sitio
 * donde la clasificación está escrita una sola vez.
 *
 * Ese catálogo no es una opinión tampoco: `scripts/refresh-catalog.mjs`
 * contrasta cada entrada con su documentación oficial y su licencia. Si alguien
 * reclasifica una tecnología, la clase se pone en rojo — que es exactamente lo
 * que debe pasar.
 *
 * Cuatro formas de preguntar, y ninguna más:
 *
 *   { "tecnologia": "react", "campo": "kind" }   → el valor de un campo
 *   { "compite_con": "react" }                   → quién comparte su categoría
 *   { "alternativa_en": "react" }                → quién comparte categoría Y ecosistema
 *   { "cuantas": { "kind": "orm" } }             → cuántas entradas cumplen un filtro
 *
 * Las dos del medio no son la misma pregunta, y esa diferencia es el contenido
 * de la clase 004. NestJS compite con Spring Boot —hacen lo mismo— y no es una
 * alternativa a Spring Boot en un proyecto Java. Competir es hacer lo mismo;
 * ser alternativa es poder ocupar su sitio sin cambiar de lenguaje.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const catalogo = JSON.parse(
  fs.readFileSync(path.join(root, "catalog/frameworks.json"), "utf8"),
);
const entradas = catalogo.entries ?? catalogo;
const porId = new Map(entradas.map((e) => [e.id, e]));

/** Las que comparten categoría: competir es disputarse el mismo hueco. */
function competidoras(id) {
  const entrada = porId.get(id);
  if (!entrada) return null;
  return entradas
    .filter((e) => e.kind === entrada.kind && e.id !== id)
    .map((e) => e.id)
    .sort();
}

/** Las que además comparten ecosistema: las que podrían ocupar su sitio hoy. */
function alternativas(id) {
  const entrada = porId.get(id);
  if (!entrada) return null;
  return entradas
    .filter((e) => e.kind === entrada.kind && e.ecosystem === entrada.ecosystem && e.id !== id)
    .map((e) => e.id)
    .sort();
}

function cuantas(filtro) {
  return entradas.filter((e) =>
    Object.entries(filtro).every(([campo, valor]) =>
      Array.isArray(e[campo]) ? e[campo].includes(valor) : e[campo] === valor,
    ),
  ).length;
}

/**
 * Responde una pregunta. Devuelve `{ valor }` o `{ error }`.
 *
 * Preguntar por una tecnología que no está en el catálogo es un fallo del caso,
 * no una respuesta vacía: el contrato estaría hablando de algo que no existe.
 */
export function responder(pregunta) {
  if (pregunta.tecnologia !== undefined) {
    const entrada = porId.get(pregunta.tecnologia);
    if (!entrada) return { error: `"${pregunta.tecnologia}" no está en el catálogo` };
    if (!(pregunta.campo in entrada)) {
      return { error: `"${pregunta.tecnologia}" no declara el campo "${pregunta.campo}"` };
    }
    return { valor: entrada[pregunta.campo] };
  }

  if (pregunta.compite_con !== undefined) {
    const lista = competidoras(pregunta.compite_con);
    if (lista === null) return { error: `"${pregunta.compite_con}" no está en el catálogo` };
    return { valor: lista };
  }

  if (pregunta.alternativa_en !== undefined) {
    const lista = alternativas(pregunta.alternativa_en);
    if (lista === null) return { error: `"${pregunta.alternativa_en}" no está en el catálogo` };
    return { valor: lista };
  }

  if (pregunta.cuantas !== undefined) {
    return { valor: cuantas(pregunta.cuantas) };
  }

  return { error: `pregunta desconocida: ${JSON.stringify(pregunta)}` };
}

const mismo = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Comprueba una respuesta contra lo esperado. Devuelve la lista de motivos por
 * los que no encaja; vacía si encaja.
 */
export function contrastar(valor, esperado) {
  const fallos = [];
  const lista = Array.isArray(valor) ? valor : [valor];

  if (esperado.es !== undefined && !mismo(valor, esperado.es)) {
    fallos.push(`esperaba ${JSON.stringify(esperado.es)} y responde ${JSON.stringify(valor)}`);
  }
  for (const uno of esperado.incluye ?? []) {
    if (!lista.includes(uno)) fallos.push(`falta "${uno}"`);
  }
  for (const uno of esperado.excluye ?? []) {
    if (lista.includes(uno)) fallos.push(`no debería aparecer "${uno}"`);
  }
  if (esperado.al_menos !== undefined && !(valor >= esperado.al_menos)) {
    fallos.push(`esperaba al menos ${esperado.al_menos} y responde ${valor}`);
  }
  if (esperado.como_mucho !== undefined && !(valor <= esperado.como_mucho)) {
    fallos.push(`esperaba como mucho ${esperado.como_mucho} y responde ${valor}`);
  }
  return fallos;
}

/** Ejecuta un contrato entero de tipo `catalogo`. */
export function verificarCatalogo(contrato) {
  const resultados = [];
  for (const caso of contrato.casos) {
    const { valor, error } = responder(caso.pregunta ?? {});
    if (error) {
      resultados.push({ nombre: caso.nombre, paso: false, motivo: error });
      continue;
    }
    const fallos = contrastar(valor, caso.esperado ?? {});
    resultados.push({
      nombre: caso.nombre,
      paso: fallos.length === 0,
      motivo: fallos.join(" || "),
    });
  }
  return resultados;
}

export const versionDelCatalogo = catalogo.verified_on;
