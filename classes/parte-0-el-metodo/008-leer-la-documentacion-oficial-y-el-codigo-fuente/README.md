# Clase 008 — Leer la documentación oficial y el código fuente

> [⬅️ 007](../007-como-se-mide-y-como-se-miente-el-rendimiento/README.md) · [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [009 ➡️](../009-el-elenco-por-que-no-todos-resuelven-todo/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> ✅ **Clase construida** — 3 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Encontrar la respuesta en la **fuente primaria** antes que en un tutorial.

Y no como consejo: cada implementación de esta clase **abre el framework que
tiene instalado** y contesta cuatro preguntas sobre él con lo que encuentra
dentro. Ninguna respuesta está escrita a mano.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Averiguar qué versión estás ejecutando de verdad**, que rara vez es la que
  pone el archivo de dependencias.
- **Localizar en tu disco** el archivo del framework que se está cargando, sin
  suponer rutas.
- **Encontrar la documentación oficial de esa versión** preguntándole al propio
  paquete, no al buscador.
- **Saber si tu ecosistema te deja leer el código fuente**, y qué hacer cuando
  no.

## 🧩 La situación

Tienes una duda concreta sobre tu framework. Escribes la pregunta en un buscador
y el primer resultado es un artículo de hace cuatro años, escrito para la versión
anterior, con un ejemplo que ya no compila.

Mientras tanto, **el código que responde a tu pregunta está en tu disco**, a un
`cat` de distancia, y la documentación de tu versión exacta está enlazada desde
el propio paquete.

Esta clase hace esas cuatro consultas en tres frameworks y devuelve las
respuestas por HTTP. La cuarta separa los ecosistemas en dos grupos.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /preguntas` | las cuatro preguntas, iguales en las tres |
| 2 | `GET /pregunta/version` | `leida_del_paquete: true` |
| 3 | `GET /pregunta/documentacion` | `respondida: true` |
| 4 | `GET /pregunta/donde-vive` | `existe: true` |
| 5 | `GET /pregunta/codigo-fuente` | `respondida: true` |
| 6 | `GET /pregunta/cual-es-mas-rapido` | **`404 PREGUNTA_DESCONOCIDA`** |

Fíjate en lo que el contrato **no** exige.

En el caso 2 no exige que la versión instalada coincida con la declarada,
porque **muchas veces no coincide** y forzarlo obligaría a mentir. En el caso 3
no exige que la dirección salga del paquete, porque en la JVM no sale. Y en el 5
no exige que haya código fuente, porque en la JVM no lo hay.

Un contrato que exigiera esas tres cosas parecería más estricto y sería menos
verdadero. **Lo que el contrato exige es que cada implementación conteste con lo
que hay, incluido cuando lo que hay es un «no».**

Y el caso 6 cierra la puerta a lo contrario: preguntar algo que no está en la
lista devuelve un 404, no una aproximación.

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |
| **FastAPI** | framework web de Python (Python) | 2018 | MIT | proyecto independiente |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |

### 🔧 Express

Definió el modelo de middleware encadenado que copiaron casi todos los frameworks de Node.js. Minimalista no significa biblioteca: posee el bucle de peticiones.

- **Documentación oficial:** <https://expressjs.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `express ^5.1.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 FastAPI

Deriva validación, serialización y documentación OpenAPI de las anotaciones de tipo. Demostró que el tipado opcional de Python podía ser infraestructura, no adorno.

- **Documentación oficial:** <https://fastapi.tiangolo.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `fastapi==0.121.3, uvicorn==0.40.0`
- **Necesita en el PATH:** `python`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 python -m uvicorn main:app --host 127.0.0.1 --port 3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `main.py` | código Python |
| `requirements.txt` | dependencias de Python, una por línea, con versión fijada |

### 🔧 Spring Boot

Autoconfiguración y servidor incrustado sobre Spring. Convirtió un framework famoso por su configuración XML en uno de arranque inmediato.

- **Documentación oficial:** <https://spring.io/projects/spring-boot>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-008-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

**Cómo se localiza el framework, sin suponer nada:**

```javascript
const manifiestoDeExpress = require.resolve("express/package.json");
const raizDeExpress = path.dirname(manifiestoDeExpress);
const metadatos = JSON.parse(readFileSync(manifiestoDeExpress, "utf8"));
```

```javascript
 * `require.resolve` devuelve la ruta del archivo que Node cargaría de verdad.
 *
 * No es lo mismo que suponer `node_modules/express`: con enlaces simbólicos,
 * espacios de trabajo o versiones anidadas, el que se carga puede estar en otro
 * sitio. Preguntar al resolvedor es la única respuesta fiable.
```

En este repositorio la diferencia se ve: la ruta real es
`node_modules/.pnpm/express@5.2.1/node_modules/express`, no
`node_modules/express`. Quien la hubiera escrito a mano se habría equivocado.

**La versión que se pidió frente a la que hay:**

```javascript
const rangoDeclarado = JSON.parse(readFileSync("package.json", "utf8")).dependencies.express;
```

```javascript
    declarada_en_el_proyecto: rangoDeclarado,
    instalada: metadatos.version,
```

Declarado `^5.1.0`. Instalado **5.2.1**. Las dos cosas son correctas —el
acento circunflejo admite versiones menores nuevas— y solo una de las dos
identifica lo que se está ejecutando.

```javascript
    por_que_importa:
      "un rango no identifica lo que se ejecuta; en un informe de error solo vale la versión exacta",
```

**La documentación, tomada del paquete:**

```javascript
    sitio: metadatos.homepage ?? "no lo declara",
    repositorio: metadatos.repository?.url ?? metadatos.repository ?? "no lo declara",
    incidencias: metadatos.bugs?.url ?? "no lo declara",
    licencia: metadatos.license,
```

```javascript
    por_que_importa:
      "el buscador ordena por popularidad; el paquete declara dónde está la verdad de ESTA versión",
```

**Y la cuarta pregunta, que en Node tiene una respuesta cómoda:**

```javascript
   * En Node la respuesta es sí, y es fácil olvidar lo raro que es. El paquete
   * que se descarga TRAE EL CÓDIGO, no un compilado. Se puede abrir, poner un
   * `console.log` y volver a ejecutar.
```

Siete archivos de código, el primero `index.js`, en una ruta que la propia
respuesta te da hecha.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

La misma idea con las herramientas de Python:

```python
RAIZ = Path(fastapi.__file__).parent
```

```python
# No es lo mismo que suponer una ruta de `site-packages`: con entornos
# virtuales, instalaciones editables o varias versiones, el que se importa puede
# estar en otro sitio. Preguntarle al modulo es la unica respuesta fiable.
```

**Y aquí sale el hallazgo más incómodo de la clase.**

`requirements.txt` fija `fastapi==0.121.3`. La versión instalada en la máquina
donde se escribió esto era **0.135.3**:

```python
        "aviso": (
            "coinciden"
            if coincide
            else "NO COINCIDEN: `requirements.txt` pide una version y el entorno tiene otra"
        ),
```

```python
        "por_que_pasa": (
            "pip instala en un entorno COMPARTIDO y `requirements.txt` es un deseo, no un "
            "hecho: mientras nadie ejecute `pip install -r`, el archivo y la maquina "
            "pueden decir cosas distintas. Un archivo de bloqueo por proyecto —lo que hacen "
            "pnpm, Cargo o Bundler— cierra ese hueco"
        ),
```

Es una diferencia de ecosistema, no un descuido: **pnpm instala dentro del
proyecto y respeta un archivo de bloqueo; pip instala en un entorno compartido y
`requirements.txt` solo describe lo que se quería**. Por eso existen los entornos
virtuales, y por eso olvidarlos cuesta tan caro.

**La documentación, con la construcción moderna de Python:**

```python
    datos = metadata.metadata("fastapi")
    urls = {}
    for entrada in datos.get_all("Project-URL") or []:
        etiqueta, _, direccion = entrada.partition(",")
        urls[etiqueta.strip().lower()] = direccion.strip()
```

```python
    `Project-URL` es una lista de pares «etiqueta, direccion» y es donde los
    paquetes modernos de Python ponen su documentacion. `Home-page` es el campo
    antiguo, que muchos ya no rellenan.
```

**Y una ventaja que Python tiene sobre los otros dos:**

```python
        "ademas": "inspect.getsource(fastapi.FastAPI.get) devuelve el cuerpo del metodo sin salir del interprete",
```

No solo el código está en disco: el intérprete te lo entrega desde dentro, sin
abrir un editor.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — donde la respuesta cambia

Está en el elenco por la cuarta pregunta, y conviene leer las tres primeras para
llegar a ella.

**Localizar el framework, preguntándole a la máquina virtual:**

```java
    private static String origenDe(Class<?> clase) {
        try {
            return clase.getProtectionDomain().getCodeSource().getLocation().toString();
```

```java
     * `getProtectionDomain().getCodeSource()` devuelve el archivo del que se
     * cargo la clase. No hay que suponer rutas ni buscar en el disco: la JVM
     * sabe exactamente de donde vino cada cosa que ha cargado.
```

**La versión, publicada por el propio framework:**

```java
        String instalada = SpringBootVersion.getVersion();
```

```java
        // `SpringBootVersion` lo publica el propio framework leyendo el
        // manifiesto de su jar. Es la fuente mas fiable que existe: la escribe
        // quien construyo el artefacto, no quien lo usa.
```

**La documentación, que aquí el paquete no trae:**

```java
        salida.put("leida_del_paquete", false);
        salida.put("por_que_no",
                "el jar no publica una direccion consultable en ejecucion; en Node y en Python el manifiesto del paquete si la trae");
```

```java
        salida.put("por_que_importa",
                "cuando el paquete no lo dice, alguien tiene que mantener esa direccion a mano — y eso caduca");
```

**Y la cuarta pregunta, con la respuesta que separa los ecosistemas:**

```java
        salida.put("hay_codigo_fuente_en_disco", false);
        salida.put("que_viaja_en_el_paquete", "bytecode compilado, no el codigo original");
        salida.put("como_conseguirlo",
                "mvn dependency:sources, o el repositorio en github.com/spring-projects/spring-boot");
```

```java
     * En la JVM, NO. Lo que se descarga es bytecode: clases compiladas. Para
     * leer el original hay que pedir aparte el jar de fuentes —`-sources.jar`—
     * o ir al repositorio en la red.
     *
     * A cambio, la JVM ofrece algo que los otros dos no: la REFLEXION. No se
     * puede leer el cuerpo de un metodo, pero si su forma exacta, y sin
     * compilar nada ni abrir un archivo.
```

Y la reflexión, ejecutándose:

```java
        for (Method metodo : Arrays.stream(RequestMapping.class.getDeclaredMethods())
                .sorted((a, b) -> a.getName().compareTo(b.getName()))
                .toList()) {
            metodos.add(metodo.getName() + ": " + metodo.getReturnType().getSimpleName());
        }
```

`GET /pregunta/codigo-fuente` devuelve los atributos exactos de `@RequestMapping`
—`consumes`, `headers`, `method`, `name`, `params`, `path`, `produces`, `value`—
leídos de la clase cargada. **No es el código, pero es la verdad**, y no depende
de ningún tutorial.

## 🔬 Comparación

| Pregunta | Express | FastAPI | Spring Boot |
| --- | --- | --- | --- |
| ¿Versión, del paquete? | sí | sí | sí |
| ¿Coincide con lo declarado? | sí (`^5.1.0` → 5.2.1) | **no** (`==0.121.3` → 0.135.3) | sí |
| ¿Documentación en el paquete? | sí | sí | **no** |
| ¿Ruta real localizable? | sí | sí | sí |
| ¿Código fuente en disco? | **sí** | **sí** | **no** |
| Lo que sí se puede inspeccionar | el archivo | el archivo y `inspect.getsource` | la forma, por reflexión |

Tres cosas que se leen de la tabla:

- **Los tres saben decirte qué versión ejecutan.** Es la pregunta más fácil y la
  que menos gente hace antes de abrir un informe de error.
- **El único que no publica su documentación en el paquete es el de la JVM.** No
  es grave, pero significa que esa dirección la mantiene alguien a mano en algún
  sitio — y lo que se mantiene a mano caduca.
- **La diferencia grande es la cuarta.** En Node y en Python el código del
  framework es tuyo desde el momento en que lo instalas. En la JVM hay un paso
  más, y ese paso explica por qué en ese ecosistema se consulta menos el
  original y más la documentación.

Ninguna de las tres es mejor. Pero saber en cuál estás cambia cómo se contesta
una duda: **en Node abres el archivo; en la JVM lees la firma y buscas el
repositorio**.

## ⚠️ Errores frecuentes

- **Buscar en el buscador antes que en el paquete.** El buscador ordena por
  popularidad; el paquete declara la verdad de tu versión.
- **Confundir el rango con la versión.** `^5.1.0` no es una versión: es una
  promesa de compatibilidad. Lo que se ejecuta es otra cosa.
- **Suponer la ruta de instalación.** Con pnpm, con espacios de trabajo o con
  entornos virtuales, la ruta obvia suele ser la equivocada. Pregunta al
  resolvedor.
- **Leer la documentación de otra versión mayor.** Es el error que produce el
  ejemplo que no compila, y se evita mirando primero qué versión hay instalada.
- **No abrir nunca el código.** En dos de estos tres ecosistemas está a un `cat`
  de distancia, y contesta preguntas que la documentación ni se plantea.

## ✅ Verificación

```bash
node scripts/run-class.mjs 008
```

Con el servidor levantado:

```bash
curl -s http://127.0.0.1:4100/pregunta/version
```

Y lo mismo sobre cualquier proyecto tuyo, sin este repositorio:

```bash
node -p "require('express/package.json').version"
```

## 🧪 Reto de transferencia

1. **Averigua la versión exacta** de las tres dependencias más importantes de tu
   proyecto y compárala con lo que dice tu archivo de dependencias. Si alguna no
   coincide, ya sabes por dónde empezar el próximo informe de error.
2. **Abre el código de tu framework** y busca la función que atiende tu ruta.
   Pon un registro temporal, ejecuta y bórralo. Media hora bien invertida.
3. **Busca la respuesta a una duda tuya en tres sitios** —un tutorial, la
   documentación oficial de tu versión y el código— y compara las tres. La
   diferencia entre la primera y la tercera es el contenido de esta clase.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué te deja consultar cada ecosistema
- [Clase 006](../006-coste-total-aprender-mantener-contratar-salir/README.md) — los paquetes transitivos que también están en tu disco
- [Empezar](../../../empezar/README.md) — las cadenas de herramientas y sus gestores de paquetes
- [Índice de la parte 0](../README.md)

## Fuentes

- [@nodejs-docs] *Node.js API Documentation (v22 LTS)*. OpenJS Foundation — <https://nodejs.org/docs/latest-v22.x/api/>
- [@semver] Preston-Werner, Tom. *Semantic Versioning 2.0.0* — <https://semver.org/>
- [@python-packaging] *Python Packaging User Guide*. Python Packaging Authority — <https://packaging.python.org/>
- [@walls-spring-in-action] Walls, Craig. *Spring in Action*, 6.ª ed. Manning Publications, 2022. ISBN 9781617297571 — <https://openlibrary.org/isbn/9781617297571>
- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*, 2.ª ed. Yaknyam Press, 2021. ISBN 9781732102217 — <https://openlibrary.org/isbn/9781732102217>
