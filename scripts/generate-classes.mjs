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

/**
 * Las palabras que cada clase define, tomadas del glosario.
 *
 * El índice de una parte enumera el vocabulario que enseña sin copiarlo: la
 * definición vive una sola vez, en `glosario/conceptos.json`.
 */
const glosario = JSON.parse(fs.readFileSync(path.join(root, "glosario/conceptos.json"), "utf8"));
const conceptosPorClase = new Map();
for (const concepto of glosario.conceptos) {
  if (concepto.clase === undefined) continue;
  if (!conceptosPorClase.has(concepto.clase)) conceptosPorClase.set(concepto.clase, []);
  conceptosPorClase.get(concepto.clase).push(concepto);
}

/** El ancla que GitHub genera para un encabezado: conserva los acentos. */
const anclaGlosario = (texto) =>
  texto
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");

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

> [⬅️ Repositorio](../README.md) · [🚀 Empezar](../empezar/README.md) · [🗺️ Atlas](../atlas/README.md) · [📚 Programa](../curriculum/README.md)

${manifest.tagline}

**${total} clases** en **${manifest.partes.length} partes**, de lo más simple a lo más
avanzado. ${construidas} construidas, ${total - construidas} en esqueleto.

Antes de la primera: [**empezar/**](../empezar/README.md) instala las cadenas de
herramientas y explica los conocimientos previos que estas clases dan por
sabidos. \`node scripts/doctor.mjs\` dice cuántas implementaciones puedes
ejecutar hoy en tu máquina.

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
      return `| [${String(c.n).padStart(3, "0")}](${c.slug}/README.md) | [${c.titulo}](${c.slug}/README.md) | ${c.objetivo} | ${n.icono} ${c.nivel} | ${ESTADOS[c.estado] ?? ESTADOS.esqueleto} |`;
    })
    .join("\n");

  const anterior = manifest.partes.find((p) => p.idx === parte.idx - 1);
  const siguiente = manifest.partes.find((p) => p.idx === parte.idx + 1);
  const nav = [
    anterior ? `[⬅️ Parte ${anterior.idx}](../${anterior.slug}/README.md)` : null,
    "[🎓 Todas las clases](../README.md)",
    "[📖 Glosario](../../glosario/README.md)",
    siguiente ? `[Parte ${siguiente.idx} ➡️](../${siguiente.slug}/README.md)` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const construidas = parte.clases.filter((c) => c.estado === "construida").length;
  const parrafo = (texto) => (Array.isArray(texto) ? texto.join("\n\n") : texto ?? "");
  const lista = (elementos) => (elementos ?? []).map((e) => `- ${e}`).join("\n");

  // Los frameworks de la parte: la unión de los elencos de sus clases, con su
  // categoría y su ecosistema tomados del catálogo. Nadie los escribe a mano, y
  // por eso no pueden discrepar del elenco real de ninguna clase.
  const apariciones = new Map();
  for (const clase of parte.clases) {
    for (const id of clase.elenco ?? []) {
      apariciones.set(id, (apariciones.get(id) ?? 0) + 1);
    }
  }
  const elenco = [...apariciones.entries()]
    .map(([id, veces]) => ({ ficha: porId.get(id), veces, id }))
    .filter((e) => e.ficha)
    .sort((a, b) => b.veces - a.veces || a.ficha.name.localeCompare(b.ficha.name, "es"));

  const porEcosistema = new Map();
  for (const e of elenco) {
    const clave = e.ficha.ecosystem ?? "Otros";
    if (!porEcosistema.has(clave)) porEcosistema.set(clave, []);
    porEcosistema.get(clave).push(e);
  }
  const filasElenco = [...porEcosistema.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(
      ([ecosistema, lista]) =>
        `| **${ecosistema}** | ${lista
          .map((e) => `[${e.ficha.name}](../../atlas/fichas/${e.id}.md) (${e.veces})`)
          .join(", ")} |`,
    )
    .join("\n");

  // Las palabras que la parte define, tomadas del glosario.
  const palabras = parte.clases
    .flatMap((c) => conceptosPorClase.get(c.n) ?? [])
    .map((c) => `[**${c.termino}**](../../glosario/README.md#${anclaGlosario(c.termino)})`);

  const secciones = [];

  secciones.push(`# Parte ${parte.idx} — ${parte.titulo}`);
  secciones.push("");
  secciones.push(`> ${nav}`);
  secciones.push("");
  secciones.push(`**${parte.subtitulo}**`);
  secciones.push("");
  secciones.push(
    `**Clases ${parte.inicio} a ${parte.fin}** · ${parte.count} en total · ${construidas} construidas · ${elenco.length} tecnologías en juego.`,
  );

  if (parte.introduccion?.length) {
    secciones.push("");
    secciones.push("## 🧭 De qué va esta parte");
    secciones.push("");
    secciones.push(parrafo(parte.introduccion));
  }

  if (parte.da_por_sabido?.length) {
    secciones.push("");
    secciones.push("## 🎒 Qué da por sabido");
    secciones.push("");
    secciones.push(lista(parte.da_por_sabido));
  }

  if (parte.al_terminar?.length) {
    secciones.push("");
    secciones.push("## 🎯 Qué sabrás hacer al terminarla");
    secciones.push("");
    secciones.push(lista(parte.al_terminar));
  }

  if (parte.hilo?.length) {
    secciones.push("");
    secciones.push("## 🧵 Por qué en este orden");
    secciones.push("");
    secciones.push(parrafo(parte.hilo));
  }

  secciones.push("");
  secciones.push("## 📚 Las clases");
  secciones.push("");
  secciones.push("| # | Clase | Qué resuelve | Nivel | Estado |");
  secciones.push("| --- | --- | --- | --- | --- |");
  secciones.push(filas);

  if (filasElenco) {
    secciones.push("");
    secciones.push("## 🎬 Las tecnologías que aparecen");
    secciones.push("");
    secciones.push(
      "Entre paréntesis, en cuántas clases de esta parte interviene cada una. **Estar aquí no es una recomendación**: es que el problema de esa clase existe de verdad para esa tecnología.",
    );
    secciones.push("");
    secciones.push("| Ecosistema | Tecnologías |");
    secciones.push("| --- | --- |");
    secciones.push(filasElenco);
  }

  if (palabras.length) {
    secciones.push("");
    secciones.push("## 📖 Las palabras que esta parte define");
    secciones.push("");
    secciones.push(palabras.join(" · "));
    secciones.push("");
    secciones.push("Todas, con su definición, en el [glosario](../../glosario/README.md).");
  }

  secciones.push("");
  secciones.push("## ✅ Cómo se ejecuta una clase de esta parte");
  secciones.push("");
  secciones.push("```bash");
  secciones.push(`node scripts/run-class.mjs ${String(parte.inicio).padStart(3, "0")}`);
  secciones.push("```");
  secciones.push("");
  secciones.push(
    "El verificador arranca cada implementación, la somete a su `contrato.json` y **declara cuáles omitió** por no encontrar su cadena de herramientas. Si te faltan cadenas, `node scripts/doctor.mjs` dice cuáles y cómo se instalan.",
  );

  if (parte.despues?.length) {
    secciones.push("");
    secciones.push("## ➡️ Y después");
    secciones.push("");
    secciones.push(parrafo(parte.despues));
  }

  secciones.push("");
  return `${secciones.join("\n")}`;
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
