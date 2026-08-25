/**
 * Inventario de una implementación: qué es, qué versión, qué necesita y cómo se
 * arranca — todo leído de los archivos reales, nunca escrito a mano.
 *
 * Existe porque una clase que enseña un framework tiene que responder a las
 * preguntas de quien llega por primera vez: *¿qué es esto?, ¿qué versión estoy
 * mirando?, ¿qué tengo que instalar?, ¿qué hace cada archivo?* — y esas
 * respuestas envejecen. Escritas a mano, envejecen mal: el `package.json` sube
 * una versión y la prosa se queda diciendo la anterior.
 *
 * Las fuentes son tres, y las tres ya existían:
 *
 *   `catalog/frameworks.json`   qué es, quién lo mantiene, licencia, era
 *   el `ejecutar.json` de cada una      qué ejecutables hace falta y cómo arranca
 *   el manifiesto de cada ecosistema    la versión exacta que se está usando
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

/** Archivos que declaran dependencias, por ecosistema. */
const MANIFIESTOS = [
  "package.json",
  "requirements.txt",
  "pom.xml",
  "composer.json",
  "Gemfile",
  "go.mod",
  "Cargo.toml",
];

/**
 * Qué es cada archivo, para quien nunca ha visto uno.
 *
 * Las claves se comparan por nombre exacto y por extensión. No pretende ser
 * exhaustiva: pretende que nadie tenga que adivinar qué mira.
 */
const ROLES = new Map([
  ["ejecutar.json", "la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca"],
  ["package.json", "manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión"],
  ["pnpm-lock.yaml", "archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias"],
  ["pnpm-workspace.yaml", "raíz de instalación propia, y la prohibición de ejecutar scripts al instalar"],
  ["requirements.txt", "dependencias de Python, una por línea, con versión fijada"],
  ["pom.xml", "manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta"],
  ["composer.json", "manifiesto de Composer: la versión de PHP y las bibliotecas del proyecto"],
  ["composer.lock", "archivo de bloqueo de Composer: la versión exacta de todo el árbol"],
  ["Gemfile", "dependencias de Ruby"],
  ["Gemfile.lock", "archivo de bloqueo de Bundler"],
  ["go.mod", "módulo de Go: su nombre, la versión del lenguaje y sus dependencias"],
  ["Cargo.toml", "manifiesto de Rust: el paquete, sus dependencias y los perfiles de compilación"],
  ["Cargo.lock", "las versiones exactas que resolvió Cargo, para que la construcción se repita igual"],
  ["go.sum", "huellas criptográficas de cada dependencia de Go"],
  ["application.properties", "configuración de Spring Boot: lo que se ajusta sin tocar el código"],
  ["config.ru", "punto de entrada de Rack, el estándar de servidores de Ruby"],
  ["_ViewImports.cshtml", "directivas comunes a todas las páginas Razor, incluidos los ayudantes de etiqueta"],
  ["bootstrap/app.php", "arranque de Laravel: qué grupo de rutas, qué capas y qué manejo de errores"],
  ["public/index.php", "el controlador frontal: el único archivo que el servidor web expone"],
  ["tsconfig.json", "configuración del compilador de TypeScript"],
  ["nest-cli.json", "configuración de la herramienta de línea de comandos de NestJS"],
  ["schema.prisma", "esquema de Prisma: el modelo de datos del que se genera el cliente"],
  [".babelrc", "configuración de Babel: qué transformación se aplica al compilar"],
]);

const EXTENSIONES = new Map([
  [".mjs", "código JavaScript (módulo ES)"],
  [".js", "código JavaScript"],
  [".ts", "código TypeScript"],
  [".py", "código Python"],
  [".java", "código Java"],
  [".cs", "código C#"],
  [".go", "código Go"],
  [".rs", "código Rust"],
  [".php", "código PHP"],
  [".rb", "código Ruby"],
  [".csproj", "proyecto de .NET: el marco de destino y las dependencias"],
  [".svelte", "componente de Svelte"],
  [".jsx", "componente en JSX"],
  [".cshtml", "página Razor: marcado con código C# incrustado"],
  [".html", "plantilla o marcado"],
  [".ejs", "plantilla EJS"],
  [".erb", "plantilla ERB"],
  [".properties", "configuración en pares clave-valor"],
  [".json", "datos en JSON usados por la implementación"],
  [".yaml", "configuración en YAML"],
  [".yml", "configuración en YAML"],
  [".xml", "configuración en XML"],
  [".sql", "sentencias SQL"],
  [".db", "base de datos SQLite del laboratorio"],
  [".blade.php", "plantilla Blade de Laravel"],
]);

/** Directorios que no forman parte de la implementación. */
const IGNORADOS = new Set([
  "node_modules", "vendor", "target", "bin", "obj", "dist", "__pycache__", ".venv", "cache",
]);

/** La versión declarada del framework, sacada del manifiesto de su ecosistema. */
function versionDeclarada(dir, framework) {
  const leer = (nombre) => {
    const ruta = path.join(dir, nombre);
    return fs.existsSync(ruta) ? fs.readFileSync(ruta, "utf8") : null;
  };

  const paquete = leer("package.json");
  if (paquete) {
    const datos = JSON.parse(paquete);
    const deps = { ...datos.dependencies, ...datos.devDependencies };
    const entradas = Object.entries(deps ?? {});
    if (entradas.length) {
      return entradas.map(([nombre, version]) => `${nombre} ${version}`).join(", ");
    }
    return "sin dependencias: solo la biblioteca estándar";
  }

  const requisitos = leer("requirements.txt");
  if (requisitos) {
    const lineas = requisitos.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
    if (lineas.length) return lineas.join(", ");
  }

  const pom = leer("pom.xml");
  if (pom) {
    const padre = pom.match(/<artifactId>spring-boot-starter-parent<\/artifactId>\s*<version>([^<]+)</);
    const java = pom.match(/<java\.version>([^<]+)</);
    const partes = [];
    if (padre) partes.push(`spring-boot ${padre[1]}`);
    if (java) partes.push(`Java ${java[1]}`);
    // Solo lo que hay dentro de <dependencies>: fuera queda el propio proyecto,
    // que se llama `clase-0NN` y no informa de nada.
    const bloque = pom.match(/<dependencies>([\s\S]*?)<\/dependencies>/);
    const artefactos = bloque
      ? [...bloque[1].matchAll(/<artifactId>([^<]+)<\/artifactId>(?:\s*<version>([^<]+)<)?/g)]
      : [];
    for (const [, artefacto, version] of artefactos.slice(0, 4)) {
      partes.push(version ? `${artefacto} ${version}` : artefacto);
    }
    if (partes.length) return partes.join(", ");
  }

  const compositor = leer("composer.json");
  if (compositor) {
    const datos = JSON.parse(compositor);
    const entradas = Object.entries(datos.require ?? {});
    if (entradas.length) return entradas.map(([n, v]) => `${n} ${v}`).join(", ");
  }

  const gemas = leer("Gemfile");
  if (gemas) {
    const encontradas = [...gemas.matchAll(/gem\s+"([^"]+)"(?:,\s*"([^"]+)")?/g)];
    if (encontradas.length) {
      return encontradas.map(([, n, v]) => (v ? `${n} ${v}` : n)).join(", ");
    }
  }

  const modulo = leer("go.mod");
  if (modulo) {
    const go = modulo.match(/^go\s+([\d.]+)/m);
    const requeridas = [...modulo.matchAll(/^\s*(?:require\s+)?([\w./-]+)\s+(v[\w.+-]+)/gm)];
    const partes = [];
    if (go) partes.push(`Go ${go[1]}`);
    for (const [, nombre, version] of requeridas.slice(0, 3)) partes.push(`${nombre} ${version}`);
    if (partes.length) return partes.join(", ");
  }

  // Rust: el paquete y sus dependencias directas, en el orden del manifiesto.
  const cargo = leer("Cargo.toml");
  if (cargo) {
    const dependencias = cargo.slice(cargo.indexOf("[dependencies]"));
    const declaradas = [...dependencias.matchAll(/^([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]+)"|\{[^}]*version\s*=\s*"([^"]+)")/gm)];
    const partes = declaradas.slice(0, 3).map(([, nombre, suelta, dentro]) => `${nombre} ${suelta ?? dentro}`);
    if (partes.length) return partes.join(", ");
  }

  // .NET: el marco de destino y los paquetes explícitos.
  const proyecto = fs.readdirSync(dir).find((n) => n.endsWith(".csproj"));
  if (proyecto) {
    const texto = fs.readFileSync(path.join(dir, proyecto), "utf8");
    const marco = texto.match(/<TargetFramework>([^<]+)</);
    const paquetes = [...texto.matchAll(/<PackageReference Include="([^"]+)" Version="([^"]+)"/g)];
    const partes = [];
    if (marco) partes.push(marco[1]);
    for (const [, nombre, version] of paquetes) partes.push(`${nombre} ${version}`);
    if (partes.length) return partes.join(", ");
  }

  return `${framework}: la versión la fija la cadena de herramientas`;
}

/**
 * Los archivos de la implementación **que están en el repositorio**.
 *
 * Se pregunta a git y no al disco, y la razón salió de un CI en rojo: en la
 * máquina de quien desarrolla hay artefactos que git ignora —una base SQLite
 * creada al ejecutar, un componente compilado, un `__pycache__`— y en un
 * checkout limpio no. Listar el disco producía una ficha distinta en cada sitio.
 *
 * Lo que se quiere describir es el contenido del repositorio, así que la fuente
 * correcta es el índice de git.
 */
function seguidosPorGit(dir) {
  const r = spawnSync("git", ["ls-files", "--", "."], { cwd: dir, encoding: "utf8" });
  if (r.status !== 0) return null;
  return r.stdout
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Archivos de la implementación, con lo que es cada uno. */
/**
 * Orden por unidades de código, no por reglas de idioma.
 *
 * `localeCompare` ordena distinto según el idioma de la máquina: en algunas
 * configuraciones la barra y el punto pesan y en otras se ignoran. Con un límite
 * de ocho archivos, un orden distinto no cambia solo la tabla — cambia QUÉ
 * archivos entran en ella, y la ficha generada en Windows dejaba de coincidir
 * con la generada en integración continua.
 */
const porRuta = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

export function archivosDe(dir, limite = 8) {
  const seguidos = seguidosPorGit(dir);
  if (seguidos) {
    return seguidos
      .filter((ruta) => !ruta.split("/").some((parte) => IGNORADOS.has(parte)))
      .filter((ruta) => !/\.(lock|sum|gitkeep|gitignore)$/i.test(ruta))
      .filter((ruta) => !path.basename(ruta).startsWith(".git"))
      .sort(porRuta)
      .slice(0, limite)
      .map((ruta) => ({
        ruta,
        rol:
          ROLES.get(ruta) ??
          ROLES.get(path.basename(ruta)) ??
          EXTENSIONES.get(path.extname(ruta)) ??
          "archivo del proyecto",
      }));
  }

  const encontrados = [];
  const recorrer = (actual, prefijo) => {
    const entradas = fs
      .readdirSync(actual, { withFileTypes: true })
      .sort((a, b) => porRuta(a.name, b.name));
    for (const entrada of entradas) {
      if (IGNORADOS.has(entrada.name)) continue;
      const relativa = prefijo ? `${prefijo}/${entrada.name}` : entrada.name;
      if (entrada.isDirectory()) {
        recorrer(path.join(actual, entrada.name), relativa);
        continue;
      }
      if (/\.(lock|sum|gitkeep|gitignore)$/i.test(entrada.name) || entrada.name.startsWith(".git")) continue;
      const rol =
        ROLES.get(relativa) ??
        ROLES.get(entrada.name) ??
        EXTENSIONES.get(path.extname(entrada.name)) ??
        "archivo del proyecto";
      encontrados.push({ ruta: relativa, rol });
    }
  };
  recorrer(dir, "");
  return encontrados.slice(0, limite);
}

/** Todo lo que se sabe de una implementación, desde sus propios archivos. */
export function inventarioDe(dirImpl, framework, catalogo) {
  const dir = path.join(dirImpl, framework);
  const receta = path.join(dir, "ejecutar.json");
  const config = fs.existsSync(receta) ? JSON.parse(fs.readFileSync(receta, "utf8")) : {};
  const ficha = catalogo.get(framework);
  return {
    framework,
    nombre: ficha?.name ?? framework,
    kind: ficha?.kind,
    ecosistema: ficha?.ecosystem,
    lenguaje: ficha?.language,
    licencia: ficha?.license,
    gobernanza: ficha?.governance,
    desde: ficha?.first_release,
    estado: ficha?.status,
    documentacion: ficha?.official_docs,
    nota: ficha?.note,
    version: versionDeclarada(dir, framework),
    requiere: config.requiere ?? [],
    preparar: config.preparar ?? null,
    arrancar: config.arrancar ?? null,
    archivos: archivosDe(dir),
  };
}
