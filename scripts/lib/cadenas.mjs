/**
 * Catálogo de cadenas de herramientas del laboratorio.
 *
 * Una «cadena» es el conjunto de ejecutables que una implementación necesita
 * para arrancar. Cada `implementaciones/<framework>/ejecutar.json` la declara en
 * su campo `requiere`, y `run-class.mjs` omite la implementación cuando alguno
 * falta. Este módulo pone nombre a esas cadenas y añade lo único que el
 * `ejecutar.json` no puede saber: **cómo se instalan**.
 *
 * Las recetas apuntan al gestor de paquetes propio de cada sistema porque es el
 * que sabe actualizar y desinstalar después. Cada cadena declara la página
 * oficial de descarga —la fuente de verdad cuando la receta envejezca— y su
 * identificador en `sources/bibliography.json`.
 *
 * Regla: aquí NO se declara qué clases usan cada cadena. Eso se calcula
 * recorriendo los `ejecutar.json`, para que no pueda desincronizarse.
 */

/**
 * @typedef {object} Cadena
 * @property {string} id          identificador estable
 * @property {string[]} requiere  ejecutables tal y como los declara `ejecutar.json`
 * @property {string} titulo      nombre legible
 * @property {string} version     versión mínima con la que se verifica el repositorio
 * @property {string} porque      qué aporta al laboratorio, en una frase
 * @property {string} cita        identificador en el registro bibliográfico
 * @property {string} oficial     página oficial de instalación
 * @property {Record<string,string[]>} instalar  recetas por sistema
 * @property {string[]} comprobar comandos que confirman la instalación
 * @property {string} [nota]      trampa conocida al instalar
 */

/** @type {Cadena[]} */
export const CADENAS = [
  {
    id: "node",
    requiere: ["node"],
    titulo: "Node.js",
    version: "22 o superior",
    porque:
      "Es el requisito del propio laboratorio: los verificadores, el generador del sitio y el ejecutor de clases son scripts de Node sin dependencias.",
    cita: "nodejs-downloads",
    oficial: "https://nodejs.org/en/download",
    instalar: {
      Windows: ["winget install OpenJS.NodeJS.LTS"],
      macOS: ["brew install node"],
      "Linux (Debian/Ubuntu)": [
        "curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -",
        "sudo apt-get install -y nodejs",
      ],
    },
    comprobar: ["node --version"],
    nota: "El paquete `nodejs` de Debian y Ubuntu suele ir varias versiones por detrás; por eso la receta añade primero el repositorio oficial.",
  },
  {
    id: "node-pnpm",
    requiere: ["node", "pnpm"],
    titulo: "Node.js + pnpm",
    version: "Node 22 · pnpm 10",
    porque:
      "Es el gestor de paquetes admitido para JavaScript y TypeScript. Instala una sola copia de cada dependencia y enlaza el resto, que es lo que hace viable tener decenas de implementaciones con `node_modules` propio.",
    cita: "pnpm-installation",
    oficial: "https://pnpm.io/installation",
    instalar: {
      "Cualquier sistema, con Node ya instalado": ["corepack enable pnpm"],
    },
    comprobar: ["pnpm --version"],
    nota: "Corepack viene dentro de Node, así que no hace falta descargar nada aparte. Si `corepack` no está en el PATH, la alternativa oficial es `npm install -g pnpm`.",
  },
  {
    id: "python",
    requiere: ["python"],
    titulo: "Python",
    version: "3.11 o superior",
    porque:
      "Ejecuta las implementaciones de Flask, Django, FastAPI y SQLAlchemy — el ecosistema con más clases del laboratorio junto a Node.",
    cita: "python-downloads",
    oficial: "https://www.python.org/downloads/",
    instalar: {
      Windows: ["winget install Python.Python.3.12"],
      macOS: ["brew install python@3.12"],
      "Linux (Debian/Ubuntu)": [
        "sudo apt-get install -y python3 python3-venv python3-pip python-is-python3",
      ],
    },
    comprobar: ["python --version"],
    nota: "En Debian y Ubuntu el ejecutable se llama `python3`; el paquete `python-is-python3` crea el alias `python` que las recetas de arranque esperan.",
  },
  {
    id: "java-maven",
    requiere: ["java", "mvn"],
    titulo: "JDK + Apache Maven",
    version: "JDK 21 · Maven 3.9",
    porque:
      "Compila y ejecuta Spring Boot e Hibernate. Maven no es opcional: las implementaciones declaran sus dependencias en `pom.xml` y se empaquetan antes de arrancar.",
    cita: "adoptium-temurin",
    oficial: "https://adoptium.net/temurin/releases/",
    instalar: {
      Windows: [
        "winget install EclipseAdoptium.Temurin.21.JDK",
        "winget install Apache.Maven",
      ],
      macOS: ["brew install temurin maven"],
      "Linux (Debian/Ubuntu)": ["sudo apt-get install -y default-jdk maven"],
    },
    comprobar: ["java -version", "mvn --version"],
    nota: "Es la cadena más lenta en la primera ejecución: Maven descarga el árbol de dependencias entero antes de compilar. Por eso `ejecutar.json` le concede 60 s de espera y no 15.",
  },
  {
    id: "dotnet",
    requiere: ["dotnet"],
    titulo: ".NET SDK",
    version: "8 o superior",
    porque:
      "Compila y ejecuta ASP.NET Core, Entity Framework Core y Dapper. Un único ejecutable —`dotnet`— restaura, compila y arranca.",
    cita: "dotnet-sdk-downloads",
    oficial: "https://dotnet.microsoft.com/download",
    instalar: {
      Windows: ["winget install Microsoft.DotNet.SDK.8"],
      macOS: ["brew install --cask dotnet-sdk"],
      "Linux (Debian/Ubuntu)": ["sudo apt-get install -y dotnet-sdk-8.0"],
    },
    comprobar: ["dotnet --version"],
    nota: "Hay que instalar el **SDK**, no el *runtime*: el runtime ejecuta binarios ya compilados y aquí se compila desde el código fuente.",
  },
  {
    id: "php-composer",
    requiere: ["php", "composer"],
    titulo: "PHP + Composer",
    version: "PHP 8.2 · Composer 2",
    porque:
      "Ejecuta Laravel y Eloquent. Composer aporta además el autocargador PSR-4, que es lo que permite que el controlador frontal de la clase 011 encuentre las clases sin un solo `require`.",
    cita: "composer-download",
    oficial: "https://getcomposer.org/download/",
    instalar: {
      Windows: ["winget install PHP.PHP.8.3", "winget install Composer.Composer"],
      macOS: ["brew install php composer"],
      "Linux (Debian/Ubuntu)": [
        "sudo apt-get install -y php-cli php-xml php-mbstring php-sqlite3 composer",
      ],
    },
    comprobar: ["php --version", "composer --version"],
    nota: "Laravel necesita las extensiones `mbstring`, `xml` y `sqlite3`. En Windows vienen en la distribución oficial pero hay que descomentarlas en `php.ini`.",
  },
  {
    id: "ruby-bundler",
    requiere: ["ruby", "bundle"],
    titulo: "Ruby + Bundler",
    version: "Ruby 3.3 · Bundler 2",
    porque:
      "Ejecuta Ruby on Rails y Active Record — el origen de casi todas las convenciones que el resto del catálogo copió después.",
    cita: "ruby-installation",
    oficial: "https://www.ruby-lang.org/en/documentation/installation/",
    instalar: {
      Windows: ["winget install RubyInstallerTeam.RubyWithDevKit.3.3", "gem install bundler"],
      macOS: ["brew install ruby", "gem install bundler"],
      "Linux (Debian/Ubuntu)": ["sudo apt-get install -y ruby-full", "gem install bundler"],
    },
    comprobar: ["ruby --version", "bundle --version"],
    nota: "En Windows hace falta la variante *with DevKit*: algunas gemas de Rails se compilan al instalarse y sin compilador fallan a mitad.",
  },
  {
    id: "go",
    requiere: ["go"],
    titulo: "Go",
    version: "1.22 o superior",
    porque:
      "Ejecuta Gin. Es la única cadena que no necesita paso de preparación: `go run` resuelve dependencias, compila y arranca en un solo comando.",
    cita: "go-downloads",
    oficial: "https://go.dev/doc/install",
    instalar: {
      Windows: ["winget install GoLang.Go"],
      macOS: ["brew install go"],
      "Linux (Debian/Ubuntu)": [
        "# El paquete de la distribución suele ir por detrás; descarga desde go.dev/dl",
        "sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz",
        'export PATH="$PATH:/usr/local/go/bin"',
      ],
    },
    comprobar: ["go version"],
    nota: "`go version` no lleva guiones, a diferencia de casi todos los demás. Es un detalle, pero es el que hace fallar el primer intento.",
  },
  {
    id: "rust-cargo",
    requiere: ["cargo"],
    titulo: "Rust",
    version: "1.80 o superior",
    porque:
      "Ejecuta axum. Es la única cadena donde el modo de compilación cambia los números de rendimiento en un orden de magnitud: `cargo build` a secas compila sin optimizar, y medir eso no compara nada.",
    cita: "rust-install",
    oficial: "https://www.rust-lang.org/tools/install",
    instalar: {
      Windows: ["winget install Rustlang.Rustup"],
      macOS: ["brew install rustup && rustup-init -y"],
      "Linux (Debian/Ubuntu)": [
        "# rustup instala la cadena en el directorio del usuario, sin tocar el sistema",
        "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y",
        'source "$HOME/.cargo/env"',
      ],
    },
    comprobar: ["cargo --version", "rustc --version"],
    nota: "La primera construcción descarga y compila el árbol entero de dependencias y tarda minutos. Las siguientes son rápidas porque `target/` guarda lo compilado — y por eso `target/` no se versiona.",
  },
];

/** Índice por la firma de `requiere` tal y como aparece en `ejecutar.json`. */
export const CADENA_POR_FIRMA = new Map(CADENAS.map((c) => [c.requiere.join("+"), c]));

/** Todos los ejecutables mencionados por alguna cadena, sin repetir. */
export const EJECUTABLES = [...new Set(CADENAS.flatMap((c) => c.requiere))];
