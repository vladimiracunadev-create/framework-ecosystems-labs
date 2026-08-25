#!/usr/bin/env node
/**
 * La ficha técnica de cada implementación, dentro de su clase.
 *
 * Quien llega por primera vez a una clase tiene cuatro preguntas antes de poder
 * leer una línea de código: **qué es esto, qué versión estoy mirando, qué
 * necesito instalar y qué hace cada archivo**. Este generador las contesta en la
 * propia clase, y las contesta desde los archivos reales — el catálogo, el
 * `ejecutar.json` y el manifiesto de dependencias de cada ecosistema.
 *
 * Se genera y no se escribe a mano por la razón de siempre: una versión escrita
 * en prosa envejece en cuanto alguien toca el `package.json`, y nadie se entera.
 *
 *   node scripts/generate-fichas.mjs           regenera todas las clases construidas
 *   node scripts/generate-fichas.mjs --check   falla si alguna está desactualizada
 *
 * El bloque se inserta entre marcas HTML. Si una clase no las tiene, se añaden
 * justo antes de la sección de implementaciones — el sitio donde hacen falta.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { inventarioDe } from "./lib/inventario.mjs";

const root = path.resolve(import.meta.dirname, "..");
const CLASSES = path.join(root, "classes");

const INICIO = "<!-- generado: fichas -->";
const FIN = "<!-- fin generado: fichas -->";

const manifest = JSON.parse(fs.readFileSync(path.join(CLASSES, "_manifest.json"), "utf8"));
const catalogoCrudo = JSON.parse(fs.readFileSync(path.join(root, "catalog/frameworks.json"), "utf8"));
const catalogo = new Map((catalogoCrudo.entries ?? catalogoCrudo).map((e) => [e.id, e]));

/** Nombre legible de la categoría del catálogo. */
const CATEGORIAS = new Map([
  ["web-framework", "framework web"],
  ["application-framework", "framework de aplicación"],
  ["metaframework", "metaframework"],
  ["ui-library", "biblioteca de interfaz"],
  ["ui-framework", "framework de interfaz"],
  ["orm", "mapeador objeto-relacional"],
  ["query-builder", "constructor de consultas"],
  ["micro-orm", "micro-ORM"],
  ["runtime", "entorno de ejecución"],
  ["library", "biblioteca"],
  ["template-engine", "motor de plantillas"],
  ["build-tool", "herramienta de construcción"],
  ["mobile-framework", "framework móvil"],
  ["desktop-framework", "framework de escritorio"],
  ["platform", "plataforma"],
]);

const normalizar = (texto) => texto.replaceAll("\r\n", "\n");
const comando = (partes) => (partes ?? []).join(" ").replaceAll("${PUERTO}", "3000");

/** El bloque de fichas de una clase. */
function fichas(dir, elenco) {
  const dirImpl = path.join(dir, "implementaciones");
  if (!fs.existsSync(dirImpl)) return null;

  const presentes = fs
    .readdirSync(dirImpl, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((nombre) => elenco.includes(nombre))
    .sort((a, b) => elenco.indexOf(a) - elenco.indexOf(b));

  if (!presentes.length) return null;

  const inventarios = presentes.map((framework) => inventarioDe(dirImpl, framework, catalogo));
  const lineas = [];

  lineas.push("## 🧰 Las piezas de esta clase, una por una");
  lineas.push("");
  lineas.push(
    "Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.",
  );
  lineas.push("");
  lineas.push("| Framework | Qué es | Desde | Licencia | Quién lo mantiene |");
  lineas.push("| --- | --- | ---: | --- | --- |");
  for (const i of inventarios) {
    const categoria = CATEGORIAS.get(i.kind) ?? i.kind ?? "—";
    lineas.push(
      `| **${i.nombre}** | ${categoria} de ${i.ecosistema ?? "—"} (${i.lenguaje ?? "—"}) | ${i.desde ?? "—"} | ${i.licencia ?? "—"} | ${i.gobernanza ?? "proyecto independiente"} |`,
    );
  }
  lineas.push("");

  for (const i of inventarios) {
    lineas.push(`### 🔧 ${i.nombre}`);
    lineas.push("");
    if (i.nota) {
      lineas.push(`${i.nota}`);
      lineas.push("");
    }
    lineas.push(`- **Documentación oficial:** <${i.documentacion}>`);
    lineas.push(`- **Estado en el catálogo:** ${i.estado ?? "—"}`);
    lineas.push(`- **Versión que ejecuta esta clase:** \`${i.version}\``);
    lineas.push(
      `- **Necesita en el PATH:** ${i.requiere.length ? i.requiere.map((r) => `\`${r}\``).join(", ") : "nada más que lo ya instalado"}`,
    );
    lineas.push("");
    if (i.preparar) {
      lineas.push("Preparar sus dependencias, dentro de su directorio:");
      lineas.push("");
      lineas.push("```bash");
      lineas.push(comando(i.preparar));
      lineas.push("```");
      lineas.push("");
    }
    if (i.arrancar) {
      lineas.push("Arrancarla suelta, sin el verificador:");
      lineas.push("");
      lineas.push("```bash");
      lineas.push(`PORT=3000 ${comando(i.arrancar)}`);
      lineas.push("```");
      lineas.push("");
    }
    if (i.archivos.length) {
      lineas.push("Qué hay dentro de su directorio:");
      lineas.push("");
      lineas.push("| Archivo | Qué es |");
      lineas.push("| --- | --- |");
      for (const a of i.archivos) lineas.push(`| \`${a.ruta}\` | ${a.rol} |`);
      lineas.push("");
    }
  }

  lineas.push(
    "> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.",
  );

  return `${INICIO}\n\n${lineas.join("\n")}\n\n${FIN}`;
}

/** Dónde va el bloque si la clase todavía no lo tiene: justo antes del código. */
function insertar(contenido, bloque) {
  const anclas = ["\n## 🌐 Las implementaciones", "\n## 🔬 Comparación", "\n## 📊 Comparación", "\n## ✅ Verificación"];
  for (const ancla of anclas) {
    const posicion = contenido.indexOf(ancla);
    if (posicion !== -1) {
      return `${contenido.slice(0, posicion)}\n${bloque}\n${contenido.slice(posicion)}`;
    }
  }
  return `${contenido.trimEnd()}\n\n${bloque}\n`;
}

const argumentos = process.argv.slice(2);
const comprobar = argumentos.includes("--check");
const problemas = [];
let escritas = 0;
let alDia = 0;

for (const parte of manifest.partes) {
  for (const clase of parte.clases) {
    if (clase.estado !== "construida") continue;
    const dir = path.join(CLASSES, parte.slug, clase.slug);
    const readme = path.join(dir, "README.md");
    if (!fs.existsSync(readme)) continue;

    const bloque = fichas(dir, clase.elenco ?? []);
    if (!bloque) continue;

    const actual = fs.readFileSync(readme, "utf8");
    const inicio = actual.indexOf(INICIO);
    const fin = actual.indexOf(FIN);

    const nuevo =
      inicio === -1 || fin === -1
        ? insertar(actual, bloque)
        : actual.slice(0, inicio) + bloque + actual.slice(fin + FIN.length);

    if (normalizar(nuevo) === normalizar(actual)) {
      alDia++;
      continue;
    }
    if (comprobar) {
      problemas.push(`classes/${parte.slug}/${clase.slug}/README.md`);
      continue;
    }
    fs.writeFileSync(readme, nuevo);
    escritas++;
  }
}

if (problemas.length) {
  console.error(`FICHAS_FAILED: ${problemas.length} clases con la ficha técnica desactualizada`);
  for (const p of problemas) console.error(`  - ${p}`);
  console.error("  Ejecuta: node scripts/generate-fichas.mjs");
  process.exit(1);
}

console.log(
  comprobar
    ? `FICHAS_OK: ${alDia} clases con su ficha técnica al día`
    : `FICHAS_OK: ${escritas} escritas, ${alDia} ya estaban al día`,
);
