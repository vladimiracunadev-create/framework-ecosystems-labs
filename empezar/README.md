# Empezar — de una máquina vacía a tu primer verde

> [🏠 Repositorio](../README.md) · [🎓 Clases](../classes/README.md) · [📚 Programa](../curriculum/README.md)

Este documento es el **prólogo del programa**. No enseña ningún framework:
prepara la máquina y el vocabulario para que las 149 clases se puedan ejecutar
de verdad en vez de leerse como un artículo.

Está pensado para alguien que **nunca ha instalado un entorno de desarrollo**.
Si ya tienes Node, Python y Java funcionando, salta a
[«El primer verde»](#3-el-primer-verde) y tardarás dos minutos.

| Paso | Qué consigues | Tiempo |
| --- | --- | ---: |
| [1. Lo que hay que saber antes](#1-lo-que-hay-que-saber-antes) | Entender qué es un puerto, una petición y un gestor de paquetes | 30 min |
| [2. Las ocho cadenas de herramientas](#2-las-ocho-cadenas-de-herramientas) | Poder ejecutar las implementaciones de cada ecosistema | 20 min – 2 h |
| [3. El primer verde](#3-el-primer-verde) | Ver una clase ejecutarse contra su contrato | 5 min |
| [4. Cómo se lee una clase](#4-cómo-se-lee-una-clase) | Saber qué mirar y en qué orden | 10 min |
| [5. La ruta completa](#5-la-ruta-completa-de-cero-a-experto) | Saber por dónde seguir hasta el nivel experto | — |

---

## 1. Lo que hay que saber antes

El programa **no** exige experiencia previa con frameworks —de eso trata—, pero
sí da por sabidas seis cosas. Están explicadas, una por una y sin dar por
supuesto nada, en [**Conocimientos previos**](conocimientos-previos.md):

1. **La terminal** — abrir una, moverse por directorios, ejecutar un comando y
   leer su código de salida.
2. **Cliente, servidor y puerto** — qué proceso escucha, dónde, y por qué dos
   programas no pueden usar el mismo número a la vez.
3. **Petición y respuesta HTTP** — método, ruta, cabeceras, cuerpo, código de
   estado. Es el idioma común de todo el laboratorio [@rfc9110].
4. **JSON** — el formato en el que viajan los datos y en el que están escritos
   los contratos de cada clase [@rfc8259].
5. **Gestor de paquetes y dependencias** — qué es `pnpm install`, y por qué
   cada ecosistema tiene el suyo.
6. **Git** — clonar este repositorio y volver atrás cuando rompas algo.

Ninguna de las seis es un framework. Todas aparecen en la primera clase.

## 2. Las ocho cadenas de herramientas

Una **cadena de herramientas** es el conjunto de ejecutables que una
implementación necesita para arrancar. Cada implementación la declara en su
`ejecutar.json`, y el ejecutor de clases la comprueba antes de intentar nada:

```json
{ "framework": "spring-boot", "requiere": ["java", "mvn"] }
```

Si falta un ejecutable, esa implementación se declara **omitida** — nunca
fallida, y nunca aprobada en silencio. Por eso **no hace falta instalarlas
todas para empezar**: con Node ya puedes ejecutar una parte grande del
laboratorio, y cada cadena que añadas amplía lo que puedes ver.

Para saber en qué punto estás:

```bash
node scripts/doctor.mjs
```

```text
Cadenas de herramientas del laboratorio

  ✔ Node.js                3 impl ·   2 clases   v22.14.0
  ✔ Node.js + pnpm        86 impl ·  69 clases   10.15.0
  ✔ Python                86 impl ·  67 clases   Python 3.12.7
  ⊘ JDK + Apache Maven    65 impl ·  65 clases   falta `java` y `mvn`
  ...

RESUMEN: 197/353 implementaciones ejecutables en esta máquina (55 %)
```

Ese porcentaje es la métrica honesta: **no dice cuánto has aprendido, dice
cuánto puedes comprobar por ti mismo**. Lo que no puedas ejecutar en local se
ejecuta igualmente en la integración continua del repositorio, y su resultado
es público.

<!-- generado: cadenas -->

| Cadena | Qué desbloquea | Frameworks | Instalación oficial |
| --- | ---: | --- | --- |
| **Node.js** · 22 o superior | 12 impl. en 7 clases | alpinejs, htmx, nodejs | [nodejs.org](https://nodejs.org/en/download) [@nodejs-downloads] |
| **Node.js + pnpm** · Node 22 · pnpm 10 | 186 impl. en 97 clases | angular, astro, drizzle, express, fastify, lit, nestjs, nextjs, nuxt, prisma, react, remix, solid, svelte, sveltekit, typeorm, vue | [pnpm.io](https://pnpm.io/installation) [@pnpm-installation] |
| **Python** · 3.11 o superior | 92 impl. en 73 clases | django, fastapi, flask, sqlalchemy | [python.org](https://www.python.org/downloads/) [@python-downloads] |
| **JDK + Apache Maven** · JDK 21 · Maven 3.9 | 70 impl. en 70 clases | hibernate, spring-boot | [adoptium.net](https://adoptium.net/temurin/releases/) [@adoptium-temurin] |
| **.NET SDK** · 8 o superior | 65 impl. en 65 clases | aspnet-core, dapper, entity-framework-core | [dotnet.microsoft.com](https://dotnet.microsoft.com/download) [@dotnet-sdk-downloads] |
| **PHP + Composer** · PHP 8.2 · Composer 2 | 15 impl. en 15 clases | eloquent, laravel | [getcomposer.org](https://getcomposer.org/download/) [@composer-download] |
| **Ruby + Bundler** · Ruby 3.3 · Bundler 2 | 14 impl. en 14 clases | activerecord, rails | [ruby-lang.org](https://www.ruby-lang.org/en/documentation/installation/) [@ruby-installation] |
| **Go** · 1.22 o superior | 11 impl. en 11 clases | gin | [go.dev](https://go.dev/doc/install) [@go-downloads] |
| **Rust** · 1.80 o superior | 1 impl. en 1 clases | axum | [rust-lang.org](https://www.rust-lang.org/tools/install) [@rust-install] |

Ocho cadenas, **466 implementaciones**. Ninguna es obligatoria: el ejecutor corre las que encuentre y **declara** las que omitió.

### Node.js

Es el requisito del propio laboratorio: los verificadores, el generador del sitio y el ejecutor de clases son scripts de Node sin dependencias.

**Windows**

```bash
winget install OpenJS.NodeJS.LTS
```

**macOS**

```bash
brew install node
```

**Linux (Debian/Ubuntu)**

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Comprobación:

```bash
node --version
```

> ⚠️ El paquete `nodejs` de Debian y Ubuntu suele ir varias versiones por detrás; por eso la receta añade primero el repositorio oficial.

### Node.js + pnpm

Es el gestor de paquetes admitido para JavaScript y TypeScript. Instala una sola copia de cada dependencia y enlaza el resto, que es lo que hace viable tener decenas de implementaciones con `node_modules` propio.

**Cualquier sistema, con Node ya instalado**

```bash
corepack enable pnpm
```

Comprobación:

```bash
pnpm --version
```

> ⚠️ Corepack viene dentro de Node, así que no hace falta descargar nada aparte. Si `corepack` no está en el PATH, la alternativa oficial es `npm install -g pnpm`.

### Python

Ejecuta las implementaciones de Flask, Django, FastAPI y SQLAlchemy — el ecosistema con más clases del laboratorio junto a Node.

**Windows**

```bash
winget install Python.Python.3.12
```

**macOS**

```bash
brew install python@3.12
```

**Linux (Debian/Ubuntu)**

```bash
sudo apt-get install -y python3 python3-venv python3-pip python-is-python3
```

Comprobación:

```bash
python --version
```

> ⚠️ En Debian y Ubuntu el ejecutable se llama `python3`; el paquete `python-is-python3` crea el alias `python` que las recetas de arranque esperan.

### JDK + Apache Maven

Compila y ejecuta Spring Boot e Hibernate. Maven no es opcional: las implementaciones declaran sus dependencias en `pom.xml` y se empaquetan antes de arrancar.

**Windows**

```bash
winget install EclipseAdoptium.Temurin.21.JDK
winget install Apache.Maven
```

**macOS**

```bash
brew install temurin maven
```

**Linux (Debian/Ubuntu)**

```bash
sudo apt-get install -y default-jdk maven
```

Comprobación:

```bash
java -version
mvn --version
```

> ⚠️ Es la cadena más lenta en la primera ejecución: Maven descarga el árbol de dependencias entero antes de compilar. Por eso `ejecutar.json` le concede 60 s de espera y no 15.

### .NET SDK

Compila y ejecuta ASP.NET Core, Entity Framework Core y Dapper. Un único ejecutable —`dotnet`— restaura, compila y arranca.

**Windows**

```bash
winget install Microsoft.DotNet.SDK.8
```

**macOS**

```bash
brew install --cask dotnet-sdk
```

**Linux (Debian/Ubuntu)**

```bash
sudo apt-get install -y dotnet-sdk-8.0
```

Comprobación:

```bash
dotnet --version
```

> ⚠️ Hay que instalar el **SDK**, no el *runtime*: el runtime ejecuta binarios ya compilados y aquí se compila desde el código fuente.

### PHP + Composer

Ejecuta Laravel y Eloquent. Composer aporta además el autocargador PSR-4, que es lo que permite que el controlador frontal de la clase 011 encuentre las clases sin un solo `require`.

**Windows**

```bash
winget install PHP.PHP.8.3
winget install Composer.Composer
```

**macOS**

```bash
brew install php composer
```

**Linux (Debian/Ubuntu)**

```bash
sudo apt-get install -y php-cli php-xml php-mbstring php-sqlite3 composer
```

Comprobación:

```bash
php --version
composer --version
```

> ⚠️ Laravel necesita las extensiones `mbstring`, `xml` y `sqlite3`. En Windows vienen en la distribución oficial pero hay que descomentarlas en `php.ini`.

### Ruby + Bundler

Ejecuta Ruby on Rails y Active Record — el origen de casi todas las convenciones que el resto del catálogo copió después.

**Windows**

```bash
winget install RubyInstallerTeam.RubyWithDevKit.3.3
gem install bundler
```

**macOS**

```bash
brew install ruby
gem install bundler
```

**Linux (Debian/Ubuntu)**

```bash
sudo apt-get install -y ruby-full
gem install bundler
```

Comprobación:

```bash
ruby --version
bundle --version
```

> ⚠️ En Windows hace falta la variante *with DevKit*: algunas gemas de Rails se compilan al instalarse y sin compilador fallan a mitad.

### Go

Ejecuta Gin. Es la única cadena que no necesita paso de preparación: `go run` resuelve dependencias, compila y arranca en un solo comando.

**Windows**

```bash
winget install GoLang.Go
```

**macOS**

```bash
brew install go
```

**Linux (Debian/Ubuntu)**

```bash
# El paquete de la distribución suele ir por detrás; descarga desde go.dev/dl
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz
export PATH="$PATH:/usr/local/go/bin"
```

Comprobación:

```bash
go version
```

> ⚠️ `go version` no lleva guiones, a diferencia de casi todos los demás. Es un detalle, pero es el que hace fallar el primer intento.

### Rust

Ejecuta axum. Es la única cadena donde el modo de compilación cambia los números de rendimiento en un orden de magnitud: `cargo build` a secas compila sin optimizar, y medir eso no compara nada.

**Windows**

```bash
winget install Rustlang.Rustup
```

**macOS**

```bash
brew install rustup && rustup-init -y
```

**Linux (Debian/Ubuntu)**

```bash
# rustup instala la cadena en el directorio del usuario, sin tocar el sistema
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
```

Comprobación:

```bash
cargo --version
rustc --version
```

> ⚠️ La primera construcción descarga y compila el árbol entero de dependencias y tarda minutos. Las siguientes son rápidas porque `target/` guarda lo compilado — y por eso `target/` no se versiona.

<!-- fin generado: cadenas -->

## 3. El primer verde

Con Node instalado —y nada más— ya se puede recorrer el repositorio entero:

```bash
git clone https://github.com/vladimiracunadev-create/framework-ecosystems-labs.git
cd framework-ecosystems-labs
node scripts/doctor.mjs
```

El primer contrato completo no necesita instalar ninguna dependencia, porque la
implementación de referencia está escrita solo con la biblioteca estándar de
Node [@nodejs-docs]:

```bash
node scripts/run-acceptance.mjs reference-node
```

Y la primera clase:

```bash
node scripts/run-class.mjs 011
```

La salida distingue tres estados y **nunca los mezcla**:

| Símbolo | Significado |
| --- | --- |
| `✔` | la implementación arrancó y **pasó** todos los casos del contrato |
| `✘` | arrancó y **falló** un caso — hay algo que arreglar |
| `⊘` | **no se ejecutó**: falta una herramienta o el entorno no estaba listo |

Un informe que dijera «todo bien» habiendo ejecutado tres de diez estaría
mintiendo. Esa distinción es la que hace creíble el verde de este repositorio, y
es el mismo principio que Nygard aplica a la instrumentación de un sistema en
producción: un indicador que no puede estar en rojo no informa de nada
[@nygard-release-it].

## 4. Cómo se lee una clase

Cada clase es una carpeta con tres piezas y una constante:

```text
081-mejora-progresiva/
├── README.md               la clase: problema, contrato, código y comparación
├── contrato.json           los casos, ejecutables, idénticos para todos
├── porque-si-porque-no.md  dónde cada framework es natural y dónde es forzado
└── implementaciones/       un directorio por framework, código real
    ├── htmx/
    ├── alpinejs/
    ├── react/
    └── svelte/
```

El orden de lectura que funciona:

1. **El problema** — qué situación se plantea. Sin frameworks todavía.
2. **El contrato** — qué se va a exigir exactamente. Aquí es donde se decide si
   la comparación significa algo: es el mismo para todos y no se adapta a
   ninguno.
3. **El código** — la implementación de cada framework, en su forma idiomática,
   a la vista en la propia clase. No hay que abrir archivos para seguir la
   explicación.
4. **La comparación** — la tabla que pone las diferencias juntas, y el texto que
   explica de dónde vienen.
5. **Por qué sí y por qué no** — el juicio: para qué producto y qué equipo cada
   opción es la natural.

Y una regla que conviene conocer antes de la primera clase: **si un framework no
hace de verdad lo que la clase mide, sale del elenco con su explicación**. No se
simula. Una simulación enseñaría el comportamiento que le programamos, no el
real, y con eso el laboratorio entero dejaría de valer.

## 5. La ruta completa: de cero a experto

El programa está ordenado para que cada nivel dependa solo del anterior.

| Nivel | Dónde estás | Qué sabes hacer al salir |
| --- | --- | --- |
| **Instalación** | este documento | Ejecutar el laboratorio y leer su informe sin creerte un verde falso |
| **Fundamentos** | [Parte 0 — El método](../classes/parte-0-el-metodo/README.md) · [módulo 00](../curriculum/00-taxonomia-y-diagnostico.md) | Distinguir biblioteca de framework, y saber qué hace comparable una comparación |
| **Básico** 🟢 | [Partes 1–3](../classes/README.md) | Responder, encadenar middleware, validar y contratar una API |
| **Intermedio** 🟡 | [Partes 4–7](../classes/README.md) | Persistir sin contaminar el dominio, autenticar, renderizar donde toque |
| **Avanzado** 🔴 | [Partes 8–10](../classes/README.md) | Tiempo real, trabajo en segundo plano, móvil y escritorio, calidad y operación |
| **Experto** | [Parte 11](../classes/parte-11-legado-migracion-y-decision/README.md) · [módulo 11](../curriculum/11-seleccion-y-sostenibilidad.md) · [módulo 12](../curriculum/12-producto-final.md) | Migrar sistemas vivos sin pararlos, elegir con criterio declarado y saber salir |

El salto de «avanzado» a «experto» no es más tecnología: es **decidir bajo
restricciones y hacerse responsable de la decisión**. Hunt y Thomas lo formulan
como la diferencia entre saber usar una herramienta y saber cuándo no usarla
[@hunt-thomas-pragmatic].

## Qué hacer cuando algo falla

| Síntoma | Causa habitual | Qué hacer |
| --- | --- | --- |
| `⊘ falta la herramienta \`X\`` | la cadena no está instalada | `node scripts/doctor.mjs` y sigue la receta |
| `⊘ entorno no preparado` | la herramienta está, pero faltan las dependencias del proyecto | ejecuta el `preparar` de su `ejecutar.json` en ese directorio |
| El puerto sigue ocupado | un proceso de una ejecución anterior no murió | ciérralo; el ejecutor comprueba el puerto antes de arrancar y espera a que se libere |
| `pnpm: command not found` | Node está, Corepack no se ha activado | `corepack enable pnpm` |
| Errores de acentos en Windows | consola en una página de códigos antigua | usa Windows Terminal, que habla UTF-8 |

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@rfc8259] Bray, T. (ed.). *The JavaScript Object Notation (JSON) Data Interchange Format*, RFC 8259, IETF, 2017 — <https://www.rfc-editor.org/rfc/rfc8259>
- [@nodejs-docs] *Node.js API Documentation (v22 LTS)*. OpenJS Foundation — <https://nodejs.org/docs/latest-v22.x/api/>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@hunt-thomas-pragmatic] Hunt, Andrew; Thomas, David. *The Pragmatic Programmer*, 20.º aniversario. Addison-Wesley, 2019. ISBN 9780135957059 — <https://openlibrary.org/isbn/9780135957059>
- [@nodejs-downloads] *Download Node.js*. OpenJS Foundation — <https://nodejs.org/en/download>
- [@pnpm-installation] *Installation*. pnpm — <https://pnpm.io/installation>
- [@python-downloads] *Download Python*. Python Software Foundation — <https://www.python.org/downloads/>
- [@adoptium-temurin] *Eclipse Temurin Releases*. Eclipse Foundation — <https://adoptium.net/temurin/releases/>
- [@dotnet-sdk-downloads] *Download .NET*. Microsoft — <https://dotnet.microsoft.com/download>
- [@composer-download] *Composer — Download*. Composer — <https://getcomposer.org/download/>
- [@ruby-installation] *Installing Ruby*. Ruby — <https://www.ruby-lang.org/en/documentation/installation/>
- [@go-downloads] *Download and install Go*. Google — <https://go.dev/doc/install>
