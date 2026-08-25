# Clase 010 — El método de esta obra

> [⬅️ 009](../009-el-elenco-por-que-no-todos-resuelven-todo/README.md) · [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [Parte 1 ➡️](../../parte-1-responder/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> ✅ **Clase construida** — 2 implementaciones verificadas contra [`contrato.json`](contrato.json).

> 🎓 **Última clase de la parte 0.** Aquí se explica cómo leer las 139 que
> quedan, y se explica ejecutándolo: las implementaciones abren su propio
> directorio y cuentan lo que encuentran.

## 🎯 Objetivo

Saber leer una clase de este programa: **contrato, implementaciones, comparación
y decisión** — y reproducir su verificación en tu máquina.

El problema que resuelve esta clase es deliberadamente trivial. **Lo que enseña
no es el problema: es la anatomía.**

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Abrir cualquiera de las 149 clases** y saber qué es cada archivo antes de
  leer una línea.
- **Ejecutar** su verificación y leer el resumen sin malinterpretar ninguno de
  los tres estados.
- **Explicar** por qué el contrato se escribe antes que las implementaciones.
- **Detectar un verde falso**, que es la única cosa que este repositorio no se
  permite.

## 🧩 La situación

Llegas a una clase cualquiera —la 057, la 080, la 128— y te encuentras cinco
directorios y cuatro archivos. ¿Por dónde se empieza?

Siempre por el mismo sitio, y siempre en el mismo orden. Esta clase lo recorre, y
en lugar de describirlo lo **lee del disco**: sus dos implementaciones abren la
carpeta que las contiene y contestan con lo que hay dentro.

Incluido el número de casos de `contrato.json` — el mismo contrato que las está
ejecutando mientras responden.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /anatomia` | los cuatro archivos de toda clase, **leídos del disco** |
| 2 | `GET /contrato` | `clase: "010"`, `tipo: "http"`, **`casos: 5`** |
| 3 | `GET /implementaciones` | `total: 2`, elenco leído de los directorios |
| 4 | `GET /estados` | los tres estados y **`omitida_significa_paso: false`** |
| 5 | `GET /verificacion` | el comando exacto para reproducirlo |

**El caso 2 es un lazo, y está puesto a propósito.** El contrato tiene cinco
casos; uno de esos cinco comprueba que la implementación diga «cinco» tras
abrir el archivo y contarlos. Añadir un caso sexto sin tocar nada más **rompe la
clase** — que es exactamente lo que debe pasar cuando el contrato y lo que se
afirma sobre él dejan de coincidir.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Verde honesto**](../../../glosario/README.md#verde-honesto) | Un resultado que distingue tres estados y nunca los mezcla: **verificada** (se ejecutó y pasó), **fallo** (se ejecutó y falló) y **omitida** (no se ejecutó, y se dice por qué). Un informe que dijera «todo bien» habiendo ejecutado tres de diez estaría mintiendo. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |
| **FastAPI** | framework web de Python (Python) | 2018 | MIT | proyecto independiente |

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

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🗺️ La anatomía de una clase

Estos cuatro archivos están en las 149 clases, sin excepción, porque
[`scripts/verify-classes.mjs`](../../../scripts/verify-classes.mjs) los exige.

### 1. `contrato.json` — se lee primero, y se escribió primero

Los casos: peticiones y respuestas esperadas, **idénticas para todas las
implementaciones**.

Va primero por una razón que no es de estilo:

```javascript
    por_que_va_primero:
      "el contrato se escribe antes que cualquier implementación; si se escribiera después, describiría lo que una de ellas hace en vez de lo que todas deben hacer",
```

Un contrato escrito después de la primera implementación deja de ser un contrato
y pasa a ser una descripción. Y una descripción no compara nada: la segunda
implementación se limita a imitar a la primera.

### 2. `README.md` — la clase

El problema, el contrato explicado, **el código de todas las implementaciones a
la vista** y la comparación. Los extractos de código no son ilustrativos: son
literales, y [`verify-excerpts.mjs`](../../../scripts/verify-excerpts.mjs) falla
si alguno deja de coincidir con su archivo.

### 3. `implementaciones/` — un directorio por framework

Cada uno con su `ejecutar.json`: qué ejecutables hacen falta, cómo se prepara y
cómo arranca.

```javascript
    ninguna_tiene: "adaptadores: el verificador habla el mismo HTTP con todas",
```

**Esa línea es la regla que sostiene el repositorio.** No hay una capa que
traduzca entre el contrato y cada framework. Todas escuchan en un puerto y
reciben las mismas peticiones, así que la comparación es entre lo que hacen, no
entre lo que alguien escribió para adaptarlas.

### 4. `porque-si-porque-no.md` — el juicio

Dónde la solución es natural, dónde es forzada, y **qué no puede probar el
contrato**. Esa última sección es obligatoria en la práctica: un verde dice lo
que se probó, y decir lo que no se probó es parte del trato.

## 🌐 Las implementaciones — el código a la vista

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

**Dónde está la clase, vista desde dentro de una implementación:**

```javascript
/** `implementaciones/express` → la carpeta de la clase, dos niveles arriba. */
const RAIZ_DE_LA_CLASE = path.resolve(process.cwd(), "..", "..");
```

**La anatomía, comprobada contra el disco:**

```javascript
    todos_presentes: ANATOMIA.every(([nombre]) =>
      existsSync(path.join(RAIZ_DE_LA_CLASE, nombre.replace(/\/$/, ""))),
    ),
```

```javascript
    // Se comprueba que existan de verdad: una lista escrita a mano que no
    // corresponda con el disco es exactamente lo que este repositorio evita.
```

**El contrato leyéndose a sí mismo:**

```javascript
  const contrato = JSON.parse(
    readFileSync(path.join(RAIZ_DE_LA_CLASE, "contrato.json"), "utf8"),
  );
```

```javascript
    casos: contrato.casos.length,
    nombres: contrato.casos.map((c) => c.nombre),
```

**El elenco, que son los directorios que hay:**

```javascript
  const elenco = readdirSync(directorio, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
```

**Y los tres estados, con el que más se malinterpreta:**

```javascript
    omitida: "NO se ejecutó: falta su cadena de herramientas en esta máquina",
    omitida_significa_paso: false,
    por_que_importa:
      "un verde que incluya lo que no se ejecutó no es un verde: es una lista de deseos",
```

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

Lo mismo con las herramientas de Python, y sirve para ver la equivalencia:

```python
RAIZ_DE_LA_CLASE = Path.cwd().resolve().parent.parent
```

```python
    datos = json.loads((RAIZ_DE_LA_CLASE / "contrato.json").read_text(encoding="utf-8"))
```

```python
    elenco = sorted(d.name for d in directorio.iterdir() if d.is_dir())
```

Tres líneas contra cinco, y hacen lo mismo. **Ninguna de las dos es más
correcta**: son dos bibliotecas estándar con opiniones distintas sobre cuánto
azúcar poner encima del sistema de archivos.

Que esta diferencia sea visible con un problema tan pequeño es justo lo que hace
útil el método: cuando el problema es grande, las diferencias de este tamaño se
pierden.

## ✅ Verificación: cómo se ejecuta una clase

```bash
node scripts/run-class.mjs 010
```

Y lo que hace, en sus propias palabras:

```javascript
    que_hace: [
      "lee contrato.json",
      "por cada directorio del elenco, comprueba si su cadena está en el PATH",
      "si está: prepara, arranca en un puerto libre y le lanza los casos",
      "si no está: la declara omitida y sigue",
      "al final resume qué se verificó, qué falló y qué se omitió",
    ],
```

Un resumen real tiene esta pinta:

```
Clase 010 — El método de esta obra
  ✔ express              5 casos
  ✔ fastapi              5 casos

RESUMEN: 2 verificadas · 0 con fallo · 0 omitidas por falta de herramientas · 0 sin implementar
CLASS_RUN_OK
```

Y uno de una clase con más elenco del que hay instalado, así:

```
  ✔ express              8 casos
  ⊘ spring-boot          falta la herramienta `mvn`
  ⊘ rails                falta la herramienta `ruby`
```

**Ese `⊘` no es un aprobado.** Si te faltan cadenas de herramientas:

```bash
node scripts/doctor.mjs
```

dice cuáles faltan y con qué comando se instala cada una. No hace falta tenerlas
todas: hace falta **saber cuáles no tienes**.

## 🔬 Comparación

| | Express | FastAPI |
| --- | --- | --- |
| Localizar la clase | `path.resolve(cwd, "..", "..")` | `Path.cwd().resolve().parent.parent` |
| Leer un JSON | `JSON.parse(readFileSync(...))` | `json.loads(...read_text(...))` |
| Listar directorios | `readdirSync` + filtro + `map` | una comprensión con `iterdir()` |
| Líneas para el elenco | 5 | 1 |

La conclusión no es «Python es más corto». Es que **con un problema trivial las
diferencias que quedan son las del lenguaje y su biblioteca estándar**, y por eso
las clases del programa eligen problemas que no lo son: para que lo que se
compare sea el framework y no el azúcar sintáctico.

## ⚠️ Errores frecuentes

- **Leer el README antes que el contrato.** El contrato dice qué se exige; el
  README, cómo lo resuelve cada uno. En ese orden se entiende; al revés, no.
- **Tomar `⊘` por aprobado.** Es la confusión que el caso 4 existe para evitar.
- **Comparar dos implementaciones sin mirar el contrato.** Si no sabes qué se les
  pidió, cualquier diferencia parece una opinión.
- **Saltarse `porque-si-porque-no.md`.** Ahí está lo que el contrato **no** puede
  probar, y esa lista suele ser más útil que la comparación.
- **Empezar por la clase que te interesa.** Se puede, y funciona mejor si antes
  has hecho las tres primeras de esta parte: definen el vocabulario que usan las
  otras 146.

## 🧪 Reto de transferencia

1. **Abre la [clase 001](../001-que-hace-un-framework-que-una-biblioteca-no-hace/README.md)**
   y recórrela en el orden de esta: contrato, implementaciones, README,
   `porque-si-porque-no.md`. Ejecútala.
2. **Ejecuta `node scripts/doctor.mjs`** y decide qué cadenas quieres instalar.
   Con Node.js sola ya se ejecuta más de la mitad del programa.
3. **Añade un sexto caso** al contrato de esta clase y ejecútala. Se pondrá en
   rojo por el lazo del caso 2 — y arreglarlo te enseña más sobre el método que
   leer esta página entera.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué no puede probar este método
- [Empezar](../../../empezar/README.md) — instalar las cadenas de herramientas
- [Conocimientos previos](../../../empezar/conocimientos-previos.md) — lo que conviene saber antes de la clase 001
- [Glosario](../../../glosario/README.md) — las 138 palabras del programa
- [Índice de la parte 0](../README.md) · [Parte 1 ➡️](../../parte-1-responder/README.md)

## Fuentes

- [@wiggins-mctighe-ubd] Wiggins, G.; McTighe, J. *Understanding by Design*, 2.ª ed. ASCD, 2005. ISBN 9781416600350 — <https://openlibrary.org/isbn/9781416600350>
- [@meszaros-xunit] Meszaros, Gerard. *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley, 2007. ISBN 9780131495050 — <https://openlibrary.org/isbn/9780131495050>
- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*, 2.ª ed. Yaknyam Press, 2021. ISBN 9781732102217 — <https://openlibrary.org/isbn/9781732102217>
