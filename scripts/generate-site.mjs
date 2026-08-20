#!/usr/bin/env node
/**
 * Generador del sitio estático. Sin dependencias: convierte el Markdown del
 * repositorio en un sitio navegable con portada, lector de documentos, índice
 * bibliográfico enlazado y búsqueda local.
 *
 *   node scripts/generate-site.mjs            genera en site/
 *   node scripts/generate-site.mjs --check    verifica que el resultado es completo
 *
 * El directorio `site/` no se versiona: lo construye la integración continua y
 * lo publica. Un artefacto generado en el historial se desincroniza del origen.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { root, markdownFiles, parseFrontMatter, loadBibliography, formatCitation } from "./lib/sources.mjs";
import { markdownToHtml, plainText, escapeHtml, slug } from "./lib/markdown.mjs";
import { ESTILOS, GUION_INICIO, GUION_TEMA, GUION_BUSQUEDA, GUION_MERMAID, SERVICE_WORKER, ICONO } from "./lib/plantillas.mjs";

const SALIDA = path.join(root, "site");
const REPO = "https://github.com/vladimiracunadev-create/framework-ecosystems-labs";
const BASE_PUBLICA = "https://vladimiracunadev-create.github.io/framework-ecosystems-labs/";
const TITULO = "Framework Ecosystems Labs";
const LEMA = "Un contrato, muchos ecosistemas, la misma prueba.";

const soloVerificar = process.argv.includes("--check");
const { bibliography, index: fuentes } = loadBibliography();

/** Rutas formativas declaradas en `curriculum/README.md`. */
const RUTAS = {
  frontend: ["00", "01", "02", "03", "04", "07", "08", "11", "12"],
  backend: ["00", "01", "02", "05", "06", "07", "08", "10", "11", "12"],
  fullstack: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
  legado: ["00", "01", "02", "05", "06", "07", "08", "10", "11", "12"],
};
const NOMBRE_RUTA = { frontend: "Frontend", backend: "Backend", fullstack: "Full stack", legado: "Modernización" };

// ---------------------------------------------------------------- recolección

function relativo(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

/** Todo documento del repositorio que debe publicarse, con sus metadatos. */
function recolectar() {
  const documentos = [];
  const areas = ["curriculum", "docs", "assessments", "projects", "labs", "templates", "contracts", "sources", "atlas", "classes"];
  for (const file of markdownFiles(...areas)) {
    const bruto = fs.readFileSync(file, "utf8");
    const { data, body } = parseFrontMatter(bruto);
    const origen = relativo(file);
    const titulo = (/^#\s+(.*)$/m.exec(body)?.[1] ?? data?.titulo ?? path.basename(file, ".md")).trim();
    documentos.push({
      origen,
      destino: origen.replace(/\.md$/, ".html").replace(/README\.html$/, "index.html"),
      titulo,
      body,
      meta: data,
      area: origen.split("/")[0],
      esModulo: /^curriculum\/\d{2}-/.test(origen),
    });
  }
  for (const suelto of ["README.md", "PROMPT_MAESTRO.md", "CHANGELOG.md", "ROADMAP.md", "CONTRIBUTING.md", "SECURITY.md"]) {
    const file = path.join(root, suelto);
    if (!fs.existsSync(file)) continue;
    const body = fs.readFileSync(file, "utf8");
    documentos.push({
      origen: suelto,
      destino: suelto === "README.md" ? "programa.html" : suelto.replace(/\.md$/, ".html"),
      titulo: (/^#\s+(.*)$/m.exec(body)?.[1] ?? suelto).trim(),
      body,
      meta: null,
      area: "raiz",
      esModulo: false,
    });
  }
  return documentos.sort((a, b) => a.destino.localeCompare(b.destino, "es"));
}

const documentos = recolectar();
const modulos = documentos.filter((doc) => doc.esModulo).sort((a, b) => a.meta.modulo.localeCompare(b.meta.modulo));

// -------------------------------------------------------------------- armazón

const subir = (destino) => "../".repeat(destino.split("/").length - 1) || "./";

function citationHref(destino) {
  return (id) => (fuentes.has(id) ? `${subir(destino)}fuentes.html#${id}` : null);
}

const porOrigen = new Map(documentos.map((doc) => [doc.origen, doc]));

/**
 * Traduce los enlaces del Markdown al sitio publicado. Un `.md` apunta a la
 * página equivalente; cualquier otro archivo del repositorio —código, contrato,
 * registro— apunta a su versión en GitHub, porque el sitio publica documentos,
 * no el árbol de archivos.
 */
function resolveLink(doc) {
  const carpeta = path.posix.dirname(doc.origen);
  return (bruto) => {
    if (/^(https?:|mailto:|#)/.test(bruto)) return bruto;
    const [ruta, ancla = ""] = bruto.split("#");
    const sufijo = ancla ? `#${ancla}` : "";
    if (!ruta) return bruto;

    const origen = path.posix.normalize(path.posix.join(carpeta === "." ? "" : carpeta, ruta)).replace(/^\.\//, "");
    const candidatos = origen.endsWith("/") ? [`${origen}README.md`] : [origen, `${origen}/README.md`];

    for (const candidato of candidatos) {
      const objetivo = porOrigen.get(candidato);
      if (objetivo) return `${subir(doc.destino)}${objetivo.destino}${sufijo}`;
    }
    return `${REPO}/blob/main/${origen.replace(/\/$/, "")}${sufijo}`;
  };
}

function cabecera(destino, { activo = "" } = {}) {
  const raizRelativa = subir(destino);
  const enlace = (href, texto, clave) =>
    `<a href="${raizRelativa}${href}"${activo === clave ? ' aria-current="page"' : ""}>${texto}</a>`;
  return `<a class="saltar" href="#contenido">Saltar al contenido</a>
<header class="barra">
  <a class="marca" href="${raizRelativa}index.html">
    ${ICONO.replace("<svg ", '<svg aria-hidden="true" ').split("\n").slice(0, 8).join("")}
    <span>${TITULO}<small>${LEMA}</small></span>
  </a>
  <nav aria-label="Principal">
    ${enlace("index.html", "Portada", "inicio")}
    ${enlace("curriculum/index.html", "Programa", "curriculum")}
    ${enlace("atlas/index.html", "Atlas", "atlas")}
    ${enlace("fuentes.html", "Fuentes", "fuentes")}
    ${enlace("docs/LEARNING-MODEL.html", "Modelo", "modelo")}
    ${enlace("labs/index.html", "Laboratorios", "labs")}
    <a href="${REPO}" target="_blank" rel="noopener noreferrer">GitHub</a>
    <button class="tema" type="button" aria-pressed="false" onclick="alternarTema()">Tema</button>
  </nav>
</header>`;
}

function pie(destino) {
  const raizRelativa = subir(destino);
  return `<footer class="pie">
  <span>MIT · Sin rastreo · El progreso se guarda solo en tu navegador.</span>
  <span>
    <a href="${raizRelativa}fuentes.html">${bibliography.entries.length} fuentes verificadas</a> ·
    <a href="${REPO}" target="_blank" rel="noopener noreferrer">Repositorio</a>
  </span>
</footer>`;
}

function pagina({ destino, titulo, descripcion, cuerpo, activo, guiones = [] }) {
  const raizRelativa = subir(destino);
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="description" content="${escapeHtml(descripcion)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(titulo)}">
<meta property="og:description" content="${escapeHtml(descripcion)}">
<meta property="og:url" content="${BASE_PUBLICA}${destino}">
<title>${escapeHtml(titulo)}</title>
<link rel="icon" type="image/svg+xml" href="${raizRelativa}assets/icono.svg">
<link rel="manifest" href="${raizRelativa}manifest.webmanifest">
<link rel="stylesheet" href="${raizRelativa}assets/estilos.css">
<script>${GUION_TEMA}</script>
</head>
<body>
${cabecera(destino, { activo })}
${cuerpo}
${pie(destino)}
${guiones.map((guion) => `<script type="module">${guion}</script>`).join("\n")}
<script>if("serviceWorker" in navigator)navigator.serviceWorker.register("${raizRelativa}service-worker.js");</script>
</body>
</html>
`;
}

// -------------------------------------------------------------------- portada

function tarjetaDeModulo(doc) {
  const meta = doc.meta;
  const rutas = Object.entries(RUTAS)
    .filter(([, lista]) => lista.includes(meta.modulo))
    .map(([clave]) => clave);
  const resumen = (/^>\s(.*(?:\n>.*)*)/m.exec(doc.body)?.[1] ?? "").replace(/\n>\s?/g, " ").trim();
  // Se cuentan solo los objetivos declarados, no toda lista numerada del texto.
  const seccionObjetivos = /## Objetivos observables\n([\s\S]*?)\n## /.exec(doc.body)?.[1] ?? "";
  const objetivos = (seccionObjetivos.match(/^\s*(?:\d+\.|\| \d+ \|)/gm) ?? []).length;
  const buscar = `${meta.titulo} ${resumen} ${meta.fuentes.join(" ")} ${rutas.join(" ")}`.toLowerCase();
  return `<article class="tarjeta" data-modulo="${meta.modulo}" data-nivel="${meta.nivel}" data-rutas="${rutas.join(",")}" data-buscar="${escapeHtml(buscar)}">
  <div class="meta"><span>Módulo ${meta.modulo}</span><span>${meta.horas} h</span></div>
  <h3><a href="${doc.destino}">${escapeHtml(meta.titulo)}</a></h3>
  <p>${escapeHtml(resumen.slice(0, 190))}${resumen.length > 190 ? "…" : ""}</p>
  <div class="etiquetas">
    <span class="etiqueta nivel-${meta.nivel}">${meta.nivel}</span>
    <span class="etiqueta">${meta.fuentes.length} fuentes</span>
    ${objetivos ? `<span class="etiqueta">${objetivos} objetivos</span>` : ""}
    ${meta.prerrequisitos.length ? `<span class="etiqueta">requiere ${meta.prerrequisitos.join(", ")}</span>` : '<span class="etiqueta">sin requisitos</span>'}
  </div>
  <div class="pie-tarjeta">
    <label><input type="checkbox"> Completado</label>
    <a href="${doc.destino}">Abrir →</a>
  </div>
</article>`;
}

function portada() {
  const horas = modulos.reduce((total, doc) => total + Number(doc.meta.horas), 0);
  const catalogo = JSON.parse(fs.readFileSync(path.join(root, "catalog/frameworks.json"), "utf8"));
  const laboratorios = documentos.filter((doc) => doc.area === "labs" && doc.origen !== "labs/README.md").length;
  const familias = new Set(catalogo.entries.map((entry) => entry.family)).size;
  const fichas = documentos.filter((doc) => doc.origen.startsWith("atlas/fichas/")).length;
  const libros = bibliography.entries.filter((entry) => entry.type === "book").length;

  const cuerpo = `<section class="heroe">
  <span class="encima">Programa comparativo · verificado el ${bibliography.verified_on}</span>
  <h1>Deja de comparar <span class="degradado">frameworks</span> y empieza a comparar <span class="degradado">decisiones</span>.</h1>
  <p class="entradilla">${modulos.length} módulos que implementan <strong>el mismo contrato</strong> en ecosistemas distintos,
  con las mismas pruebas de aceptación y los mismos atributos de calidad. Cada afirmación del programa
  se apoya en un libro, un artículo, una norma o la documentación oficial: ${bibliography.entries.length} fuentes con
  localizador verificable, ninguna difusa.</p>
  <ul class="cifras">
    <li class="cifra"><strong>${modulos.length}</strong><span>módulos</span></li>
    <li class="cifra"><strong>${horas}</strong><span>horas</span></li>
    <li class="cifra"><strong>${bibliography.entries.length}</strong><span>fuentes verificadas</span></li>
    <li class="cifra"><strong>${libros}</strong><span>libros con ISBN</span></li>
    <li class="cifra"><strong>${catalogo.entries.length}</strong><span>tecnologías en el Atlas</span></li>
    <li class="cifra"><strong>${familias}</strong><span>ecosistemas</span></li>
    <li class="cifra"><strong>${laboratorios}</strong><span>laboratorios</span></li>
    <li class="cifra"><strong id="progreso">0/${modulos.length}</strong><span>tu progreso</span></li>
  </ul>
  <div class="acciones">
    <a class="boton boton-primario" href="curriculum/00-taxonomia-y-diagnostico.html">Empezar por el módulo 00</a>
    <a class="boton boton-fantasma" href="assessments/diagnostic.html">Hacer el diagnóstico</a>
    <a class="boton boton-fantasma" href="atlas/index.html">Explorar el Atlas</a>
    <a class="boton boton-fantasma" href="fuentes.html">Ver las ${bibliography.entries.length} fuentes</a>
  </div>
</section>

<main class="contenedor" id="contenido">
  <section class="bloque">
    <h2>El programa</h2>
    <p class="sub">Filtra por nivel o por ruta formativa. Marca lo que completes: el progreso se guarda
    en tu navegador y no sale de él.</p>
    <div class="barra-progreso" aria-hidden="true"><i></i></div>
    <div class="filtros">
      <input id="busqueda" type="search" placeholder="Buscar tema, concepto o fuente…" aria-label="Buscar módulo">
      <select id="nivel" aria-label="Filtrar por nivel">
        <option value="">Todos los niveles</option>
        <option value="introductorio">Introductorio</option>
        <option value="intermedio">Intermedio</option>
        <option value="avanzado">Avanzado</option>
      </select>
      <select id="ruta" aria-label="Filtrar por ruta">
        <option value="">Todas las rutas</option>
        ${Object.keys(RUTAS).map((clave) => `<option value="${clave}">${NOMBRE_RUTA[clave]}</option>`).join("\n        ")}
      </select>
    </div>
    <div class="rejilla">
      ${modulos.map(tarjetaDeModulo).join("\n")}
    </div>
    <p class="sin-resultados oculto" id="sin-resultados">Ningún módulo coincide con ese filtro.</p>
  </section>

  <section class="bloque">
    <h2>Cómo se sostiene lo que aquí se afirma</h2>
    <p class="sub">La regla es comprobable, no declarativa: <code>node scripts/verify-sources.mjs</code>
    deja el repositorio en rojo si alguna de estas condiciones deja de cumplirse.</p>
    <div class="rejilla">
      <article class="tarjeta"><h3>Libros con ISBN</h3><p>${libros} obras. Cada una enlaza al registro
      de su ISBN-13 concreto, con dígito de control validado.</p></article>
      <article class="tarjeta"><h3>Artículos con DOI</h3><p>${bibliography.entries.filter((e) => e.type === "paper").length}
      artículos con revisión por pares; los metadatos se contrastan contra Crossref.</p></article>
      <article class="tarjeta"><h3>Normas y especificaciones</h3><p>${bibliography.entries.filter((e) => e.type === "standard").length}
      documentos de IETF, W3C, WHATWG, NIST, OWASP y OpenSSF, enlazados a su fuente.</p></article>
      <article class="tarjeta"><h3>Sin bibliografía decorativa</h3><p>Una fuente que nadie cita hace
      fallar la validación. Las ${bibliography.entries.length} se usan en el texto.</p></article>
    </div>
  </section>

  <section class="bloque">
    <h2>El Atlas</h2>
    <p class="sub">La segunda capa: ${catalogo.entries.length} tecnologías situadas en su ecosistema y en su era.
    El núcleo enseña un contrato en cinco ecosistemas; el Atlas enseña a reconocer la familia entera.</p>
    <div class="rejilla">
      ${Object.entries(
        catalogo.entries.reduce((acumulado, entry) => {
          (acumulado[entry.family] ??= []).push(entry);
          return acumulado;
        }, {}),
      )
        .sort((a, b) => b[1].length - a[1].length)
        .map(([familia, lista]) => {
          const pagina = documentos.find((doc) => doc.origen === `atlas/ecosistemas/${familia}.md`);
          const titulo = pagina ? pagina.titulo : familia;
          const eras = ["pionero", "clasico", "vigente", "emergente"]
            .map((era) => [era, lista.filter((entry) => entry.era === era).length])
            .filter(([, total]) => total > 0);
          return `<article class="tarjeta">
        <div class="meta"><span>${lista.length} tecnologías</span></div>
        <h3>${pagina ? `<a href="${pagina.destino}">${escapeHtml(titulo)}</a>` : escapeHtml(titulo)}</h3>
        <div class="etiquetas">${eras.map(([era, total]) => `<span class="etiqueta">${total} ${era}</span>`).join("")}</div>
      </article>`;
        })
        .join("\n")}
    </div>
  </section>

  <section class="bloque">
    <h2>Documentos del programa</h2>
    <p class="sub">Fundamentos, criterios de decisión y material de evaluación.</p>
    <div class="rejilla">
      ${documentos
        .filter((doc) => ["docs", "assessments", "projects"].includes(doc.area))
        .map(
          (doc) => `<article class="tarjeta">
        <div class="meta"><span>${doc.area}</span></div>
        <h3><a href="${doc.destino}">${escapeHtml(doc.titulo)}</a></h3>
        <p>${escapeHtml(plainText(doc.body.replace(/^#\s+.*$/m, "")).slice(0, 150))}…</p>
      </article>`,
        )
        .join("\n")}
    </div>
  </section>
</main>`;

  return pagina({
    destino: "index.html",
    titulo: `${TITULO} — ${LEMA}`,
    descripcion: `${modulos.length} módulos, ${horas} horas y ${bibliography.entries.length} fuentes verificadas para aprender a comparar y elegir frameworks con evidencia.`,
    cuerpo,
    activo: "inicio",
    guiones: [GUION_INICIO],
  });
}

// --------------------------------------------------------- páginas de lectura

function barraLateral(actual) {
  const grupo = (titulo, lista) =>
    lista.length
      ? `<h2>${titulo}</h2><ul>${lista
          .map(
            (doc) =>
              `<li><a href="${subir(actual.destino)}${doc.destino}"${doc.destino === actual.destino ? ' aria-current="page"' : ""}>${escapeHtml(
                doc.meta?.modulo ? `${doc.meta.modulo} · ${doc.meta.titulo}` : doc.titulo,
              )}</a></li>`,
          )
          .join("")}</ul>`
      : "";

  return `<aside class="indice">
  <label class="visualmente-oculto" for="buscador-doc">Buscar en el programa</label>
  <input class="buscador" id="buscador-doc" type="search" placeholder="Buscar en todo el sitio…"
         data-indice="${subir(actual.destino)}datos/indice.json" data-base="${subir(actual.destino)}">
  <ul class="resultados" id="resultados-doc"></ul>
  ${grupo("Programa", modulos)}
  ${grupo("Atlas", documentos.filter((doc) => doc.area === "atlas"))}
  ${grupo("Clases", documentos.filter((doc) => doc.area === "classes"))}
  ${grupo("Fundamentos", documentos.filter((doc) => doc.area === "docs"))}
  ${grupo("Evaluación", documentos.filter((doc) => doc.area === "assessments"))}
  ${grupo("Proyectos", documentos.filter((doc) => doc.area === "projects"))}
  ${grupo("Laboratorios", documentos.filter((doc) => doc.area === "labs"))}
  ${grupo("Contrato y plantillas", documentos.filter((doc) => ["contracts", "templates", "sources"].includes(doc.area)))}
  ${grupo("Repositorio", documentos.filter((doc) => doc.area === "raiz"))}
</aside>`;
}

function fichaDeModulo(meta) {
  if (!meta?.modulo) return "";
  const rutas = Object.entries(RUTAS)
    .filter(([, lista]) => lista.includes(meta.modulo))
    .map(([clave]) => NOMBRE_RUTA[clave]);
  return `<ul class="ficha">
    <li><b>Módulo</b> ${meta.modulo}</li>
    <li><b>Nivel</b> ${meta.nivel}</li>
    <li><b>Duración</b> ${meta.horas} h</li>
    <li><b>Requiere</b> ${meta.prerrequisitos.length ? meta.prerrequisitos.join(", ") : "nada"}</li>
    <li><b>Fuentes</b> ${meta.fuentes.length}</li>
    <li><b>Rutas</b> ${rutas.join(", ")}</li>
    <li><b>Verificado</b> ${meta.verificado}</li>
  </ul>`;
}

function paginacion(doc) {
  if (!doc.esModulo) return "";
  const posicion = modulos.findIndex((otro) => otro.destino === doc.destino);
  const anterior = modulos[posicion - 1];
  const siguiente = modulos[posicion + 1];
  return `<nav class="paginacion" aria-label="Navegación entre módulos">
    ${anterior ? `<a href="${path.basename(anterior.destino)}"><span>Anterior</span>${escapeHtml(anterior.meta.titulo)}</a>` : "<span></span>"}
    ${siguiente ? `<a href="${path.basename(siguiente.destino)}" style="text-align:right"><span>Siguiente</span>${escapeHtml(siguiente.meta.titulo)}</a>` : "<span></span>"}
  </nav>`;
}

function paginaDeDocumento(doc) {
  const { html, indice } = markdownToHtml(doc.body, {
    citationHref: citationHref(doc.destino),
    resolveLink: resolveLink(doc),
  });
  const toc = indice.length
    ? `<aside class="toc" aria-label="Contenido de la página"><h2>En esta página</h2><ul>${indice
        .map((item) => `<li><a class="n${item.nivel}" href="#${item.id}">${escapeHtml(item.texto)}</a></li>`)
        .join("")}</ul></aside>`
    : "<aside class=\"toc\"></aside>";

  const cuerpo = `<div class="envoltura">
  ${barraLateral(doc)}
  <article id="contenido">
    ${fichaDeModulo(doc.meta)}
    ${html}
    ${paginacion(doc)}
  </article>
  ${toc}
</div>`;

  return pagina({
    destino: doc.destino,
    titulo: `${doc.titulo} — ${TITULO}`,
    descripcion: plainText(doc.body.replace(/^#\s+.*$/m, "")).slice(0, 180),
    cuerpo,
    activo: doc.esModulo ? "curriculum" : doc.area,
    guiones: [GUION_BUSQUEDA, GUION_MERMAID],
  });
}

// ------------------------------------------------------------ página de fuentes

function paginaDeFuentes() {
  const tipos = [
    ["book", "Libros", "Localizador: registro del ISBN-13 de la edición citada."],
    ["paper", "Artículos con revisión por pares", "Localizador: DOI resoluble, con metadatos en Crossref."],
    ["standard", "Normas y especificaciones", "Organismos y consorcios de acceso abierto."],
    ["reference", "Documentación oficial y referencias", "Publicada por quien mantiene la tecnología."],
  ];

  const secciones = tipos
    .map(([tipo, titulo, nota]) => {
      const entradas = bibliography.entries
        .filter((entry) => entry.type === tipo)
        .sort((a, b) => (a.authors?.[0] ?? a.publisher ?? "").localeCompare(b.authors?.[0] ?? b.publisher ?? "", "es"));
      return `<section class="bloque">
  <h2 id="${tipo}">${titulo} <span style="color:var(--tenue);font-weight:400">(${entradas.length})</span></h2>
  <p class="sub">${nota}</p>
  <div class="rejilla">
    ${entradas
      .map(
        (entry) => `<article class="tarjeta" id="${entry.id}">
      <div class="meta"><span><code>${entry.id}</code></span><span>${entry.published ?? ""}</span></div>
      <h3>${escapeHtml(entry.title)}</h3>
      <p>${escapeHtml(formatCitation(entry))}</p>
      <div class="etiquetas">${entry.topics.map((tema) => `<span class="etiqueta">${escapeHtml(tema)}</span>`).join("")}</div>
      <div class="pie-tarjeta">
        <span>${escapeHtml(entry.publisher ?? entry.container ?? "")}</span>
        <a href="${entry.locator}" target="_blank" rel="noopener noreferrer">Localizador →</a>
      </div>
    </article>`,
      )
      .join("\n")}
  </div>
</section>`;
    })
    .join("\n");

  const cuerpo = `<section class="heroe">
  <span class="encima">Trazabilidad</span>
  <h1>${bibliography.entries.length} fuentes, <span class="degradado">ninguna difusa</span>.</h1>
  <p class="entradilla">Cada afirmación del programa remite a una de estas entradas, y cada entrada declara
  un localizador que se puede abrir y comprobar. La validación del repositorio falla si una cita apunta a una
  fuente inexistente, si una lección cita menos de cuatro, o si una entrada del registro no se usa en ningún texto.</p>
  <div class="acciones">
    <a class="boton boton-fantasma" href="#book">Libros</a>
    <a class="boton boton-fantasma" href="#paper">Artículos</a>
    <a class="boton boton-fantasma" href="#standard">Normas</a>
    <a class="boton boton-fantasma" href="#reference">Documentación oficial</a>
    <a class="boton boton-fantasma" href="sources/index.html">Política de fuentes</a>
  </div>
</section>
<main class="contenedor" id="contenido">${secciones}</main>`;

  return pagina({
    destino: "fuentes.html",
    titulo: `Fuentes — ${TITULO}`,
    descripcion: `Bibliografía verificada del programa: ${bibliography.entries.length} entradas con localizador resoluble.`,
    cuerpo,
    activo: "fuentes",
  });
}

// ------------------------------------------------------------------- escritura

const escritos = [];
function escribir(destino, contenido) {
  const completo = path.join(SALIDA, destino);
  fs.mkdirSync(path.dirname(completo), { recursive: true });
  fs.writeFileSync(completo, contenido, "utf8");
  escritos.push(destino);
}

if (fs.existsSync(SALIDA)) fs.rmSync(SALIDA, { recursive: true, force: true });
fs.mkdirSync(SALIDA, { recursive: true });

escribir("index.html", portada());
escribir("fuentes.html", paginaDeFuentes());
for (const doc of documentos) escribir(doc.destino, paginaDeDocumento(doc));

// Índice de búsqueda: solo texto, sin marcado ni código.
escribir(
  "datos/indice.json",
  JSON.stringify(
    documentos.map((doc) => ({
      url: doc.destino,
      titulo: doc.meta?.modulo ? `${doc.meta.modulo} · ${doc.meta.titulo}` : doc.titulo,
      seccion: doc.area,
      texto: plainText(doc.body).toLowerCase().slice(0, 12_000),
    })),
  ),
);

escribir("assets/estilos.css", ESTILOS);
escribir("assets/icono.svg", ICONO);
escribir(
  "manifest.webmanifest",
  JSON.stringify(
    {
      name: TITULO,
      short_name: "FrameworkLabs",
      description: LEMA,
      start_url: "./index.html",
      scope: "./",
      display: "standalone",
      background_color: "#0b0f16",
      theme_color: "#0b5fd0",
      lang: "es",
      icons: [{ src: "assets/icono.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
    },
    null,
    2,
  ),
);

const armazon = ["./index.html", "./fuentes.html", "./assets/estilos.css", "./assets/icono.svg", "./datos/indice.json"];
escribir(
  "service-worker.js",
  SERVICE_WORKER.replace("__VERSION__", bibliography.verified_on)
    .replace("__ARMAZON__", JSON.stringify(armazon))
    .replace("__BASE__", "./"),
);

escribir(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${escritos
    .filter((destino) => destino.endsWith(".html"))
    .map((destino) => `  <url><loc>${BASE_PUBLICA}${destino}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
);
escribir("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${BASE_PUBLICA}sitemap.xml\n`);
escribir(".nojekyll", "");
escribir(
  "404.html",
  pagina({
    destino: "404.html",
    titulo: `Página no encontrada — ${TITULO}`,
    descripcion: "La dirección solicitada no existe en este sitio.",
    cuerpo: `<main class="contenedor" id="contenido"><section class="bloque">
      <h2>404 — esa página no existe</h2>
      <p class="sub">Puede que el documento se haya renombrado. Vuelve a la
      <a href="./index.html">portada</a> o entra directamente al
      <a href="./curriculum/00-taxonomia-y-diagnostico.html">módulo 00</a>.</p>
    </section></main>`,
  }),
);

// ------------------------------------------------------------- comprobaciones

const problemas = [];
const paginasHtml = escritos.filter((destino) => destino.endsWith(".html"));
if (paginasHtml.length < documentos.length + 3) problemas.push(`solo ${paginasHtml.length} páginas generadas`);
for (const obligatorio of ["index.html", "fuentes.html", "assets/estilos.css", "datos/indice.json", "sitemap.xml", ".nojekyll"]) {
  if (!escritos.includes(obligatorio)) problemas.push(`falta ${obligatorio}`);
}
const rotas = [];
for (const destino of paginasHtml) {
  const contenido = fs.readFileSync(path.join(SALIDA, destino), "utf8");
  if (contenido.includes("cita-rota")) problemas.push(`${destino}: contiene una cita sin fuente`);
  // Enlaces internos: se resuelven contra lo realmente escrito.
  for (const enlace of contenido.matchAll(/href="(?!https?:|mailto:|#)([^"]+)"/g)) {
    const objetivo = enlace[1].split("#")[0];
    if (!objetivo) continue;
    const resuelto = path.posix.normalize(path.posix.join(path.posix.dirname(destino), objetivo));
    if (!fs.existsSync(path.join(SALIDA, resuelto))) rotas.push(`${destino} -> ${enlace[1]}`);
  }
}
if (rotas.length) problemas.push(`${rotas.length} enlaces internos rotos: ${rotas.slice(0, 6).join("; ")}`);

const conDiagrama = paginasHtml.filter((destino) =>
  fs.readFileSync(path.join(SALIDA, destino), "utf8").includes('class="mermaid"'),
).length;

if (problemas.length) {
  console.error(`SITE_FAILED: ${problemas.length} problemas`);
  for (const problema of problemas) console.error(`  - ${problema}`);
  process.exitCode = 1;
} else {
  console.log(`SITE_OK: ${paginasHtml.length} páginas, ${modulos.length} módulos, ${bibliography.entries.length} fuentes, ${conDiagrama} páginas con diagrama.`);
  if (soloVerificar) console.log("  (--check: el sitio se generó y se verificó; el directorio site/ no se versiona)");
}

void slug;
