#!/usr/bin/env node
/**
 * Generador del árbol de clases.
 *
 * Fuente única: `classes/_manifest.json`. De ahí salen el índice general, el
 * índice de cada parte y —solo si aún no existe— el esqueleto de cada clase.
 *
 * Regla del repositorio: lo generado no se edita a mano y lo escrito a mano no
 * se sobrescribe. Por eso el esqueleto de una clase se crea una sola vez: en
 * cuanto alguien escribe su prosa, este script deja de tocar ese archivo y pasa
 * a limitarse a los bloques marcados.
 *
 * Uso:
 *   node scripts/generate-classes.mjs          escribe
 *   node scripts/generate-classes.mjs --check  falla si algo está desfasado
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const CLASSES = path.join(root, "classes");
const MANIFEST = path.join(CLASSES, "_manifest.json");
const check = process.argv.includes("--check");

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const catalogo = JSON.parse(fs.readFileSync(path.join(root, "catalog/frameworks.json"), "utf8"));
const porId = new Map((catalogo.entries ?? catalogo).map((e) => [e.id, e]));

const NIVELES = {
  introductorio: { icono: "🟢", orden: 1 },
  intermedio: { icono: "🟡", orden: 2 },
  avanzado: { icono: "🔴", orden: 3 },
};

const ESTADOS = {
  esqueleto: "🚧 Esqueleto",
  construida: "✅ Construida",
};

const desfasados = [];
const creados = [];

function escribir(destino, contenido) {
  const previo = fs.existsSync(destino) ? fs.readFileSync(destino, "utf8") : null;
  if (previo === contenido) return;
  if (check) {
    desfasados.push(path.relative(root, destino).replace(/\\/g, "/"));
    return;
  }
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, contenido);
  creados.push(path.relative(root, destino).replace(/\\/g, "/"));
}

/** Crea el archivo solo si no existe. Nunca pisa prosa escrita a mano. */
function sembrar(destino, contenido) {
  if (fs.existsSync(destino)) return;
  if (check) {
    desfasados.push(`${path.relative(root, destino).replace(/\\/g, "/")} (falta)`);
    return;
  }
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, contenido);
  creados.push(path.relative(root, destino).replace(/\\/g, "/"));
}

const nombre = (id) => porId.get(id)?.name ?? id;
const fichaDe = (id) => `../../../atlas/fichas/${id}.md`;

function elencoEnlazado(elenco) {
  return elenco.map((id) => `[${nombre(id)}](${fichaDe(id)})`).join(" · ");
}

function elencoPlano(elenco, prefijo = "../../atlas/fichas") {
  return elenco.map((id) => `[${nombre(id)}](${prefijo}/${id}.md)`).join(" · ");
}

// ------------------------------------------------------------ índice general

function indiceGeneral() {
  const total = manifest.partes.reduce((a, p) => a + p.clases.length, 0);
  const construidas = manifest.partes
    .flatMap((p) => p.clases)
    .filter((c) => c.estado === "construida").length;

  const filas = manifest.partes
    .map(
      (p) =>
        `| **${p.idx}** | [${p.titulo}](${p.slug}/README.md) | ${p.inicio}–${p.fin} | ${p.count} |`,
    )
    .join("\n");

  const pistas = Object.entries(manifest.pistas)
    .map(
      ([id, p]) =>
        `| \`${id}\` | ${p.titulo} | ${p.descripcion} | ${p.elenco.length} |`,
    )
    .join("\n");

  return `# 🎓 Clases

> [⬅️ Repositorio](../README.md) · [🗺️ Atlas](../atlas/README.md) · [📚 Programa](../curriculum/README.md)

${manifest.tagline}

**${total} clases** en **${manifest.partes.length} partes**, de lo más simple a lo más
avanzado. ${construidas} construidas, ${total - construidas} en esqueleto.

## 🧭 El método

${manifest.metodo}

Cada clase tiene la misma anatomía:

| Archivo | Qué contiene |
| --- | --- |
| \`README.md\` | La clase: situación, modelo, implementaciones a la vista, comparación y decisión |
| \`contrato.json\` | Los casos verificables. Es lo que hace comparable el ejercicio |
| \`implementaciones/<framework>/\` | El código real de cada framework del elenco |
| \`porque-si-porque-no.md\` | Por qué esta solución es natural en un framework y forzada en otro |

## 🎬 Los elencos

Los lenguajes son intercambiables: cualquiera suma dos números. **Los frameworks
no.** Spring Boot no implementa una clase de reactividad en el cliente y React no
implementa una de migraciones. Por eso cada clase declara su **elenco**: los
frameworks para los que ese problema tiene sentido.

| Pista | Título | De qué trata | Frameworks |
| --- | --- | --- | --- |
${pistas}

## 📚 Las partes

| # | Parte | Clases | Total |
| --- | --- | --- | --- |
${filas}

## ✅ Verificación

\`\`\`bash
node scripts/run-class.mjs 011
\`\`\`

El verificador ejecuta cada implementación contra \`contrato.json\` y **declara
cuáles omitió** por no encontrar su cadena de herramientas instalada. Un
resultado verde nunca significa «todo pasó»: significa «esto pasó, esto se
omitió».
`;
}

// -------------------------------------------------------------- índice parte

function indiceParte(parte) {
  const filas = parte.clases
    .map((c) => {
      const n = NIVELES[c.nivel];
      return `| [${String(c.n).padStart(3, "0")}](${c.slug}/README.md) | [${c.titulo}](${c.slug}/README.md) | ${n.icono} ${c.nivel} | \`${c.pista}\` | ${c.elenco.length} | ${ESTADOS[c.estado] ?? ESTADOS.esqueleto} |`;
    })
    .join("\n");

  const anterior = manifest.partes.find((p) => p.idx === parte.idx - 1);
  const siguiente = manifest.partes.find((p) => p.idx === parte.idx + 1);
  const nav = [
    anterior ? `[⬅️ Parte ${anterior.idx}](../${anterior.slug}/README.md)` : null,
    "[🎓 Todas las clases](../README.md)",
    siguiente ? `[Parte ${siguiente.idx} ➡️](../${siguiente.slug}/README.md)` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return `# Parte ${parte.idx} — ${parte.titulo}

> ${nav}

${parte.subtitulo}

**Clases ${parte.inicio} a ${parte.fin}** · ${parte.count} en total.

| # | Clase | Nivel | Pista | Elenco | Estado |
| --- | --- | --- | --- | --- | --- |
${filas}
`;
}

// ------------------------------------------------------------ clase (semilla)

function esqueletoClase(parte, clase) {
  const n = NIVELES[clase.nivel];
  const pista = manifest.pistas[clase.pista];
  const idx = parte.clases.indexOf(clase);
  const anterior = parte.clases[idx - 1];
  const siguiente = parte.clases[idx + 1];

  const nav = [
    anterior ? `[⬅️ ${String(anterior.n).padStart(3, "0")}](../${anterior.slug}/README.md)` : null,
    `[📚 Parte ${parte.idx}](../README.md)`,
    `[🎓 Clases](../../README.md)`,
    siguiente ? `[${String(siguiente.n).padStart(3, "0")} ➡️](../${siguiente.slug}/README.md)` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const filasElenco = clase.elenco
    .map((id) => {
      const e = porId.get(id);
      return `| [${nombre(id)}](${fichaDe(id)}) | \`${e?.kind ?? "?"}\` | ${e?.ecosystem ?? "?"} | \`implementaciones/${id}/\` |`;
    })
    .join("\n");

  return `# Clase ${String(clase.n).padStart(3, "0")} — ${clase.titulo}

> ${nav}
>
> Parte **${parte.idx} — ${parte.titulo}** · Nivel **${n.icono} ${clase.nivel}** · Pista **\`${clase.pista}\`** (${pista.titulo})
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

${clase.objetivo}

## 🧩 La situación

${clase.contrato}

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
${filasElenco}

## ✅ Verificación

\`\`\`bash
node scripts/run-class.mjs ${String(clase.n).padStart(3, "0")}
\`\`\`

Los casos están en [\`contrato.json\`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte ${parte.idx}](../README.md)
`;
}

function esqueletoPorque(parte, clase) {
  const filas = clase.elenco
    .map((id) => `| [${nombre(id)}](${fichaDe(id)}) | | | |`)
    .join("\n");

  return `# Por qué sí y por qué no — ${clase.titulo}

> [⬅️ Clase ${String(clase.n).padStart(3, "0")}](README.md) · [📚 Parte ${parte.idx}](../README.md)

🚧 **En esqueleto.** La tabla está planteada; el juicio de cada fila se escribe
con su fuente al construir la clase.

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
${filas}
`;
}

function esqueletoContrato(clase) {
  return `${JSON.stringify(
    {
      clase: String(clase.n).padStart(3, "0"),
      titulo: clase.titulo,
      descripcion: clase.contrato,
      estado: "esqueleto",
      tipo: clase.pista === "frontend" || clase.pista === "movil" ? "interfaz" : "http",
      casos: [],
    },
    null,
    2,
  )}\n`;
}

// ------------------------------------------------------------------ ejecución

for (const parte of manifest.partes) {
  const dirParte = path.join(CLASSES, parte.slug);
  escribir(path.join(dirParte, "README.md"), indiceParte(parte));

  for (const clase of parte.clases) {
    const dir = path.join(dirParte, clase.slug);
    sembrar(path.join(dir, "README.md"), esqueletoClase(parte, clase));
    sembrar(path.join(dir, "porque-si-porque-no.md"), esqueletoPorque(parte, clase));
    sembrar(path.join(dir, "contrato.json"), esqueletoContrato(clase));
  }
}

escribir(path.join(CLASSES, "README.md"), indiceGeneral());

if (check) {
  if (desfasados.length) {
    console.error(`CLASSES_STALE: ${desfasados.length} archivos desfasados`);
    for (const f of desfasados.slice(0, 20)) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log("CLASSES_OK: árbol de clases al día");
} else {
  const total = manifest.partes.reduce((a, p) => a + p.clases.length, 0);
  console.log(
    `CLASSES_OK: ${manifest.partes.length} partes, ${total} clases, ${creados.length} archivos escritos`,
  );
}

export { elencoPlano };
