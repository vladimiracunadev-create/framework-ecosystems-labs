# Clase 007 — Cómo se mide (y cómo se miente) el rendimiento

> [⬅️ 006](../006-coste-total-aprender-mantener-contratar-salir/README.md) · [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [008 ➡️](../008-leer-la-documentacion-oficial-y-el-codigo-fuente/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟡 intermedio** · Pista **`backend`** (Backend y API)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

> ⚠️ **Esta clase no dice qué framework es más rápido, y no es por prudencia.**
> Un número de velocidad medido en la máquina de quien ejecuta describe esa
> máquina. Lo que sí se puede afirmar en cualquier ordenador está en el
> contrato — y son tres cosas.

## 🎯 Objetivo

Leer una comparativa de rendimiento **sin creértela**, y saber exactamente qué
le falta para poder creértela.

Tres formas de mentir con un número honesto: **no calentar**, **publicar solo la
media** y **medir código que el compilador ha borrado**. Las tres aparecen en el
código de esta clase, ejecutándose.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Señalar** los cuatro datos sin los cuales una medición no se puede
  reproducir, y descartar la comparativa que no los publique.
- **Explicar** por qué una media puede ser correcta y aun así engañar, con un
  número tuyo delante.
- **Reconocer** una medición sin calentamiento y otra donde el optimizador se
  llevó el trabajo por delante.
- **Distinguir** lo que una medición puede afirmar de lo que solo puede sugerir.

## 🧩 La situación

Encuentras una tabla. Cuatro frameworks, una columna de milisegundos, una
conclusión.

No dice cuántas veces se repitió. No dice en qué máquina. No dice si el proceso
estaba caliente. No dice si el binario de Rust se compiló optimizado. Y publica
una media, que es el único número que puede esconder que una de cada cien
peticiones tarda seis veces más.

Esta clase mide **el mismo trabajo determinista** de dos maneras —mal y bien— en
cuatro frameworks, y compara los métodos en lugar de las velocidades.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /trabajo` | hay una unidad de trabajo determinista: **400 vueltas de SHA-256** |
| 2 | `GET /medir-mal?n=100` | `calentamiento: 0`, `publica: "solo la media"` |
| 3 | `GET /medir-bien?n=100` | `publica: "percentiles"` |
| 4 | `GET /comparar` | **`la_media_oculta_la_cola: true`** |
| 5 | `GET /entorno` | los cuatro datos que hay que publicar |

**El caso 4 es la única afirmación de velocidad que este repositorio se permite**,
y se permite porque es cierta en cualquier ordenador: el percentil 99 siempre
está por encima de la media. Que un framework sea un 30 % más rápido que otro no
lo es, y por eso no está en el contrato.

El caso 5 exige que cada implementación declare **runtime, versión del framework,
núcleos y modo de compilación**. Una comparativa a la que le falte uno de los
cuatro no se puede reproducir, y lo que no se puede reproducir no es una
medición: es una anécdota.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Percentil**](../../../glosario/README.md#percentil) | El valor por debajo del cual queda un porcentaje de las mediciones. La media esconde a los usuarios lentos; el p95 y el p99 son los que describen lo que la gente sufre. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |
| **Fastify** | framework web de Node.js (JavaScript/TypeScript) | 2016 | MIT | OpenJS Foundation |
| **Gin** | framework web de Go (Go) | 2014 | MIT | proyecto independiente |
| **axum** | framework web de Rust (Rust) | 2021 | MIT | proyecto independiente |

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
| `medicion.mjs` | código JavaScript (módulo ES) |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 Fastify

Validación y serialización derivadas de JSON Schema, con un sistema de plugins con encapsulamiento explícito.

- **Documentación oficial:** <https://fastify.dev/docs/latest/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `fastify ^5.6.1`
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
| `medicion.mjs` | código JavaScript (módulo ES) |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 Gin

El framework HTTP más usado de Go: enrutado rápido y middleware, sobre la biblioteca estándar.

- **Documentación oficial:** <https://gin-gonic.com/en/docs/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `Go 1.24, github.com/gin-gonic/gin v1.11.0`
- **Necesita en el PATH:** `go`

Preparar sus dependencias, dentro de su directorio:

```bash
go mod tidy
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 go run .
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `go.mod` | módulo de Go: su nombre, la versión del lenguaje y sus dependencias |
| `main.go` | código Go |
| `medicion.go` | código Go |

### 🔧 axum

Construido sobre las abstracciones de servicio de Tower, lo que hace su middleware reutilizable fuera del framework.

- **Documentación oficial:** <https://docs.rs/axum/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `axum 0.8.7, tokio 1.48.0, serde_json 1.0.145`
- **Necesita en el PATH:** `cargo`

Preparar sus dependencias, dentro de su directorio:

```bash
cargo build --release --quiet
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 cargo run --release --quiet
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `Cargo.toml` | manifiesto de Rust: el paquete, sus dependencias y los perfiles de compilación |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `src/main.rs` | código Rust |
| `src/medicion.rs` | código Rust |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro miden **exactamente el mismo trabajo con exactamente el mismo
método**. Es a propósito y es media clase: si el método cambiara entre ellas, la
comparación no significaría nada.

### Express · [`express/medicion.mjs`](implementaciones/express/medicion.mjs) y [`express/server.mjs`](implementaciones/express/server.mjs)

**La unidad de trabajo:**

```javascript
export const VUELTAS = 400;

export function trabajo() {
  let dato = Buffer.from("clase-007");
  for (let i = 0; i < VUELTAS; i += 1) {
    dato = createHash("sha256").update(dato).digest();
  }
  return dato.toString("hex").slice(0, 16);
}
```

Determinista y con coste real. **Las dos cosas hacen falta**: sin coste no
habría cola que medir, y sin determinismo cada muestra mediría algo distinto.

**La medición mal hecha:**

```javascript
export function medirMal(n) {
  const tiempos = muestrear(n);
  return {
    muestras: n,
    calentamiento: 0,
    publica: "solo la media",
```

```javascript
 * Sin calentar y publicando solo la media. No está exagerada: es exactamente lo
 * que aparece en la mayoría de las comparativas que circulan.
```

**La bien hecha:**

```javascript
export function medirBien(n) {
  const calentamiento = Math.max(20, Math.floor(n / 5));
  muestrear(calentamiento);

  const tiempos = muestrear(n);
  const ordenados = [...tiempos].sort((a, b) => a - b);
```

```javascript
    p50_ms: redondear(percentil(ordenados, 50)),
    p90_ms: redondear(percentil(ordenados, 90)),
    p99_ms: redondear(percentil(ordenados, 99)),
    maximo_ms: redondear(ordenados[ordenados.length - 1]),
```

La media sigue ahí. **No es que sea falsa: es que sola no basta.**

**Y el percentil, calculado sin inventar:**

```javascript
function percentil(ordenados, p) {
  const indice = Math.max(0, Math.ceil((p / 100) * ordenados.length) - 1);
  return ordenados[indice];
}
```

Método del rango más cercano, **sin interpolar**. Interpolar produce un número
que nadie midió, y en una clase sobre cómo se miente con los números eso importa.

**Lo que se puede afirmar y lo que no:**

```javascript
    la_media_oculta_la_cola: bien.p99_ms > bien.media_ms,
    cuanto_la_oculta: `p99 es ${(bien.p99_ms / bien.media_ms).toFixed(1)}× la media`,
```

```javascript
    lo_que_no_se_puede_afirmar:
      "que un framework sea más rápido que otro: eso exige la misma máquina, el mismo trabajo y la distribución entera",
```

En una ejecución cualquiera de esta clase, con `n=200`:

```
media 0.99 ms · p50 0.71 ms · p90 1.36 ms · p99 6.08 ms · máximo 8.78 ms
```

**El percentil 99 es seis veces la media.** Una de cada cien peticiones tarda seis
veces más de lo que la tabla dice, y la tabla no miente: la media es esa.

### Fastify · [`fastify/server.mjs`](implementaciones/fastify/server.mjs)

Usa el **mismo archivo de medición**, copiado letra por letra. Lo único que
cambia es quién atiende la petición:

```javascript
app.get("/comparar", (peticion) => comparar(repeticiones(peticion)));
```

Y ese «lo único» es el aviso más útil de la clase:

```javascript
 * Y ese «lo único» es también el aviso: en una comparativa de frameworks, el
 * trabajo de la ruta suele dominar el tiempo. Lo que se está midiendo casi nunca
 * es el framework.
```

En un servicio real, la ruta consulta una base de datos, serializa y llama a otro
servicio. El coste del enrutado —lo único donde Express y Fastify se diferencian
de verdad— queda enterrado bajo todo lo demás.

### Gin · [`gin/medicion.go`](implementaciones/gin/medicion.go) y [`gin/main.go`](implementaciones/gin/main.go)

El mismo método en Go, y una decisión que merece la pena copiar:

```go
func versionDeGin() string {
	info, ok := debug.ReadBuildInfo()
	if !ok {
		return "desconocida"
	}
	for _, dep := range info.Deps {
		if dep.Path == "github.com/gin-gonic/gin" {
			return dep.Version
		}
	}
	return "desconocida"
}
```

```go
// La version de Gin no se escribe a mano: se lee de la informacion de
// construccion que el compilador incrusta en el binario. Un numero copiado a
// mano en un informe de rendimiento es el primer sitio por donde se cuela una
// mentira.
```

Y una lección de la receta de arranque que costó una vuelta de integración
continua: la implementación arranca con `go run .`, no con `go run main.go`.

**Con el nombre del archivo se compila solo ese archivo**, y `medicion.go` se
queda fuera con seis errores de «símbolo no definido». El punto significa «el
paquete entero de este directorio», que es casi siempre lo que se quiere.

Y el modo de compilación, declarado tal y como es:

```go
		"modo_de_compilacion":   "compilado a codigo maquina por `go run`, sin optimizaciones de enlazado",
```

### axum · [`axum/src/medicion.rs`](implementaciones/axum/src/medicion.rs) y [`axum/Cargo.toml`](implementaciones/axum/Cargo.toml)

Aquí aparecen **las dos formas de mentir que solo existen en lenguajes
compilados**, y por eso axum está en el elenco de esta clase.

**La primera: medir código que el compilador ha borrado.**

```rust
fn muestrear(n: usize) -> Vec<f64> {
    let mut tiempos = Vec::with_capacity(n);
    for _ in 0..n {
        let inicio = Instant::now();
        black_box(trabajo());
        tiempos.push(inicio.elapsed().as_nanos() as f64 / 1e6);
    }
    tiempos
}
```

```rust
// `black_box` le dice al compilador que no puede suponer nada sobre este valor.
//
// Sin el, un optimizador que ve que el resultado no se usa puede BORRAR EL
// TRABAJO ENTERO y dejar el bucle vacio. En Rust y en Go pasa de verdad, y el
// resultado son mediciones de cero coma nada que no miden nada.
```

Un microbanco de pruebas que da tiempos absurdamente buenos casi siempre está
midiendo un bucle vacío. Es la trampa más difícil de ver, porque el código
**parece** que hace el trabajo.

**La segunda: medir sin optimizar.**

```rust
    let modo = if cfg!(debug_assertions) {
        "depuracion, SIN optimizar: los numeros no valen para comparar"
    } else {
        "release, optimizado"
    };
```

```toml
# El perfil de release, explícito y a la vista.
#
# Medir Rust sin esto es el error más común de quien compara contra Rust: en modo
# depuración los números son hasta diez veces peores, y la culpa no es del
# lenguaje ni del framework.
[profile.release]
opt-level = 3
```

`cargo build` a secas compila **sin optimizar**. Quien mide eso y publica la
tabla no está mintiendo a propósito: está publicando un número real de algo que
nadie desplegaría.

Y la versión, leída del manifiesto en lugar de escrita a mano:

```rust
fn version_de_axum() -> String {
    let manifiesto = std::fs::read_to_string("Cargo.toml").unwrap_or_default();
    for linea in manifiesto.lines() {
        if let Some(resto) = linea.strip_prefix("axum = ") {
            return format!("axum {}", resto.trim().trim_matches('"'));
        }
    }
    "axum (version desconocida)".to_string()
}
```

## 🔬 Comparación

No de velocidades — de **métodos**. Esta es la tabla que hay que aplicarle a
cualquier comparativa que te encuentres:

| Pregunta | Mal hecha | Bien hecha |
| --- | --- | --- |
| ¿Cuántas repeticiones? | no lo dice | `muestras` publicado |
| ¿Calentó antes? | no | sí, `n/5` con un mínimo de 20 |
| ¿Qué publica? | la media | media, p50, p90, p99 y máximo |
| ¿En qué máquina? | no lo dice | runtime, núcleos, modo de compilación |
| ¿El compilador pudo borrar el trabajo? | no se sabe | no: `black_box` lo impide |

Y tres afirmaciones ordenadas de más a menos defendible:

1. **«El percentil 99 está por encima de la media.»** Cierto siempre, en
   cualquier máquina. Está en el contrato.
2. **«Este framework tarda X en esta máquina con este trabajo.»** Cierto aquí y
   ahora. Reproducible si publicas los cuatro datos del entorno.
3. **«Este framework es más rápido que aquel.»** No se sigue de lo anterior. Hace
   falta la misma máquina, el mismo trabajo, la distribución entera y varias
   ejecuciones — y aun así solo valdrá para ese trabajo.

**Casi todas las comparativas afirman la tercera con datos de la segunda.**

## ⚠️ Errores frecuentes

- **Publicar la media sola.** Es el error de esta clase, y el más extendido. Tus
  usuarios no viven en la media: viven en el percentil 99.
- **No calentar.** Las primeras muestras miden la compilación al vuelo y las
  cachés frías. En la JVM y en Node la diferencia es enorme.
- **Comparar un binario de depuración con uno optimizado.** Rust y .NET son las
  víctimas habituales. `cargo build --release`, no `cargo build`.
- **Medir un bucle que el compilador borró.** Si el número es sospechosamente
  bueno, comprueba que el resultado se use.
- **Medir un «hola mundo».** Enseña el coste del enrutado, que en un servicio real
  es una fracción minúscula del total.
- **Ejecutar una vez.** Una medición sin repetición no tiene varianza, y sin
  varianza no hay percentiles ni forma de saber si el número es estable.

## ✅ Verificación

```bash
node scripts/run-class.mjs 007
```

Con el servidor levantado, la comparación completa:

```bash
curl -s "http://127.0.0.1:4100/comparar?n=500"
```

Fíjate en `cuanto_la_oculta`. Ejecuta el mismo comando tres veces: **el número
cambia**, y esa inestabilidad es exactamente lo que una sola ejecución no te
enseña.

## 🧪 Reto de transferencia

1. **Coge la última comparativa que te haya convencido** y busca los cuatro datos
   del entorno. Si falta alguno, no puedes reproducirla.
2. **Mide una ruta tuya** con `n=1000` y compara la media con el p99. La
   diferencia es la que ven tus usuarios y no ve tu panel.
3. **Compila la implementación de axum sin `--release`** y vuelve a medir. El
   número que salga es el que aparece en la mitad de las tablas que comparan
   Rust con otras cosas.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué mide bien cada uno y qué no
- [Clase 004](../004-taxonomia-que-compite-de-verdad-con-que/README.md) — comparar cosas de la misma categoría, antes de medir nada
- [Empezar: las cadenas de herramientas](../../../empezar/README.md) — cómo instalar Rust y Go si te faltan
- [Índice de la parte 0](../README.md)

## Fuentes

- [@gregg-systems-performance] Gregg, Brendan. *Systems Performance*, 2.ª ed. Addison-Wesley, 2020. ISBN 9780136820154 — <https://openlibrary.org/isbn/9780136820154>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@rust-install] *Install Rust*. Rust Foundation — <https://www.rust-lang.org/tools/install>
- [@go-downloads] *Download and install Go*. Google — <https://go.dev/doc/install>
- [@klabnik-nichols-rust] Klabnik, S.; Nichols, C. *The Rust Programming Language*, 2.ª ed. No Starch Press, 2023. ISBN 9781718503106 — <https://openlibrary.org/isbn/9781718503106>
