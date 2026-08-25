# Clase 002 — Inversión de control, en concreto

> [⬅️ 001](../001-que-hace-un-framework-que-una-biblioteca-no-hace/README.md) · [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [003 ➡️](../003-el-contrato-como-unidad-de-comparacion/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Ver la inversión de control **en el código y en un número**, no en un diagrama.

La clase 001 dijo la frase: *si el suyo llama al tuyo, es un framework*. Esta la
convierte en algo que se puede medir desde fuera con `curl`.

## 📚 Resultados de aprendizaje

Al terminar podrás:

1. Demostrar que registrar un manejador **no** es llamarlo, sin leer el código
   del framework.
2. Reconocer el mismo mecanismo de registro escrito de cuatro formas — llamada,
   decorador, anotación y mapeo — y no confundir la sintaxis con el mecanismo.
3. Explicar por qué la inversión de control es lo que obliga a que exista un
   contenedor, y por qué eso reaparece en la clase 036.

## 🧩 La situación

Una aplicación con un manejador llamado `manejarTrabajo` que **en ningún sitio
del código se invoca**, y un contador de cuántas veces se ha ejecutado.

Si registrar fuera llamar, el contador valdría uno nada más arrancar. Si el
framework no llamara a nadie, valdría cero para siempre.

## 🧮 El contrato

| Petición | Respuesta esperada | Qué demuestra |
| --- | --- | --- |
| `GET /invocaciones` | `{"veces": 0}` | **registrar no es llamar** |
| `GET /trabajo` | `200`, `hecho`, `text/plain` | el manejador existe y responde |
| `GET /invocaciones` | `{"veces": 1}` | lo llamó **alguien**, y no fue el código |
| `GET /trabajo` | `200`, `hecho` | — |
| `GET /invocaciones` | `{"veces": 2}` | **una invocación por petición**, ni más ni menos |

La especificación ejecutable está en [`contrato.json`](contrato.json).

El primer caso es el que convierte esta clase en una medición. Un framework que
invocara el manejador al registrarlo —o al arrancar, para «calentarlo»— fallaría
ahí, y el fallo sería visible sin abrir un depurador.

Y el último cierra la otra puerta: **exactamente dos**. Un framework que
reintentara internamente, o que ejecutara la ruta dos veces por alguna
optimización, daría tres. El contrato no mide que el manejador se llame: mide
**cuántas veces**.

## 🌐 Las implementaciones — el código a la vista

Las cuatro hacen lo mismo con cuatro sintaxis de registro distintas. Lee las
cuatro seguidas: **la sintaxis cambia, el mecanismo no**.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — el registro como llamada

```javascript
function manejarTrabajo(peticion, respuesta) {
  veces += 1;
  respuesta.type("text/plain").send("hecho");
}
```

```javascript
app.get("/trabajo", manejarTrabajo);
```

La forma más desnuda de las cuatro, y por eso la mejor para empezar:
`manejarTrabajo` se **define** y después se **pasa como valor**. Los paréntesis
que la ejecutarían no están en ninguna parte del archivo.

Fíjate además en lo que la función *no* es: no hereda de nada, no implementa
ninguna interfaz y **no sabe que existe un framework**. Recibe dos argumentos y
devuelve. Esa independencia es lo que permite probarla sin servidor.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — el registro como decorador

```python
@app.get("/trabajo", response_class=PlainTextResponse)
def manejar_trabajo() -> str:
    estado["veces"] += 1
    return "hecho"
```

Un decorador **es** una llamada: `app.get("/trabajo")` devuelve una función que
recibe `manejar_trabajo`, la guarda en la tabla de rutas y la devuelve sin
tocarla. Escribirlo encima en vez de al lado es una convención del lenguaje.

Y aquí la inversión llega un paso más lejos que en Express:

```python
# Y una diferencia que esta clase saca a la luz: aquí no hay `listen`. El objeto
```

**No hay `listen`.** El objeto `app` se declara y lo ejecuta un servidor
externo, Uvicorn, desde fuera del archivo. En Express tu código todavía decide
cuándo empieza a escuchar; aquí ni eso.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — el registro como dato

```java
    @GetMapping(value = "/trabajo", produces = MediaType.TEXT_PLAIN_VALUE)
    public String manejarTrabajo() {
        veces.incrementAndGet();
        return "hecho";
    }
```

Aquí **no hay llamada de registro en absoluto**. `@GetMapping` es una
*anotación*: un dato adjunto al método, que no ejecuta nada. Quien construye la
tabla de rutas es el arranque, examinando las clases del *classpath* y leyendo
esos datos.

Es el grado máximo de inversión: el código del programador no participa
siquiera en el registro. Y tiene una consecuencia práctica que aparecerá muchas
veces: **si Spring no encuentra tu clase, no hay error — simplemente la ruta no
existe**, porque nunca hubo una línea que fallara.

```java
    private final AtomicInteger veces = new AtomicInteger();
```

Y un detalle que este contrato obliga a mirar por primera vez: **el contenedor
de servlets atiende en varios hilos**. Un `int` normal perdería cuentas bajo
carga, y el quinto caso del contrato —exactamente dos— es justo el tipo de
comprobación que lo destaparía.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — las dos fases explícitas

```csharp
var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();
```

```csharp
app.MapGet("/trabajo", () =>
{
    Interlocked.Increment(ref veces);
    return Results.Text("hecho", "text/plain");
});
```

```csharp
app.Run();
```

Lo que ASP.NET Core aporta a esta clase es que **el momento del traspaso está
escrito**. `CreateBuilder` y `Build` son la fase de configuración; `Run` es la
línea donde el control cambia de manos y ya no vuelve.

En Express las dos fases están fundidas en un archivo que se lee de arriba
abajo; aquí son objetos distintos, y esa separación es la que permite registrar
servicios antes de que exista la aplicación — que es la clase 036.

`Interlocked.Increment` cumple el mismo papel que el `AtomicInteger` de Java, y
por el mismo motivo.

## 🔬 Comparación

| | Express | FastAPI | Spring Boot | ASP.NET Core |
| --- | --- | --- | --- | --- |
| Cómo se registra | llamada a método | decorador | **anotación** (un dato) | llamada a método |
| ¿El registro ejecuta algo? | sí, guarda | sí, guarda | **no**: lo lee el arranque | sí, guarda |
| ¿Quién arranca el servidor? | tu código (`listen`) | **un proceso externo** (Uvicorn) | el arranque (`SpringApplication.run`) | tu código (`Run`) |
| Fases configurar/ejecutar | fundidas | fundidas | fundidas en `run` | **separadas y visibles** |
| Concurrencia visible | no (un hilo) | no (bucle de eventos) | **sí** (`AtomicInteger`) | **sí** (`Interlocked`) |
| Si el manejador no aparece | error al arrancar | error al arrancar | **silencio**: la ruta no existe |  error al arrancar |

Dos filas merecen que te pares:

**La penúltima.** Node y Python atienden en un solo hilo —bucle de eventos—, así
que un `+= 1` basta. La JVM y .NET atienden en varios, y el mismo contador
necesita una operación atómica. **El mismo contrato obliga a escribir código
distinto**, y no por gusto del framework sino por el modelo de ejecución del
runtime que hay debajo.

**La última es la más importante de toda la clase.** Cuando el registro es una
llamada, olvidarla produce un error o una ruta ausente que se descubre al
instante. Cuando el registro es una anotación que alguien tiene que *encontrar*,
olvidar poner la clase donde se busca produce **silencio**. Es el precio
concreto de la inversión máxima: menos código que escribir, y fallos que no
gritan.

## 🧠 Por qué esto obliga a un contenedor

Si el framework llama a tu función, tiene que **construirla** o al menos saber
cómo obtenerla. Y si tu función necesita una conexión a base de datos, alguien
tiene que dársela: tú ya no puedes, porque tú no la llamas.

De ahí salen los contenedores de inversión de control y la inyección de
dependencias que Fowler describió [@fowler-injection] y que se ven a fondo en
la clase 036. No son una moda de la JVM: son la consecuencia inevitable de que
el control esté invertido.

El patrón subyacente tiene nombre desde 1994 — **método plantilla**, con su
principio de Hollywood: *no nos llames, nosotros te llamamos*
[@gof-design-patterns]. Y la razón de que compense está en la misma idea que
Ousterhout llama módulo profundo [@ousterhout-philosophy]: una interfaz pequeña
—registrar una función— delante de mucha implementación.

## ⚠️ Errores frecuentes

- **Confundir el decorador con algo mágico.** Es una función que recibe otra
  función. Verlo así hace que FastAPI, Flask y Django dejen de parecer distintos
  de Express.
- **Llamar al manejador desde otro sitio del código.** Funciona, y salta el
  framework entero: sin middleware, sin validación, sin manejo de errores. Es
  el origen de un tipo de bug muy difícil de ver.
- **Guardar estado mutable en el ámbito del módulo** —como el contador de esta
  clase— y creer que es seguro. Aquí es deliberado y está declarado; en
  producción, con varios hilos o varios procesos, no lo es.
- **Suponer que «se registró» implica «se ejecutará».** En Spring, una clase
  fuera del ámbito de exploración se registra en ningún sitio y nadie avisa.
- **Medir invocaciones con registros de texto.** El contador es observable desde
  fuera; un `console.log` no lo es, y un contrato no puede comprobarlo.

## ✅ Verificación

```bash
node scripts/run-class.mjs 002
```

Salida real en una máquina sin JDK con Maven y sin .NET:

```text
Clase 002 — Inversión de control, en concreto
  ✔ express              5 casos
  ✔ fastapi              5 casos
  ⊘ spring-boot          falta la herramienta `mvn`
  ⊘ aspnet-core          falta la herramienta `dotnet`

RESUMEN: 2 verificadas · 0 con fallo · 2 omitidas por falta de herramientas
```

## 🧪 Reto de transferencia

Añade a **una** implementación una línea que llame a `manejarTrabajo`
directamente al arrancar, antes del `listen`. Vuelve a ejecutar el verificador.

Debe fallar el primer caso: `veces` valdrá 1 y el contrato espera 0. **Ese
fallo es el objetivo** — acabas de escribir, y medir, la diferencia entre una
biblioteca y un framework.

Después piensa qué habría pasado si el framework hiciera eso mismo por dentro
«para calentar la ruta», y por qué el contrato tiene que empezar contando cero.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — cuándo la inversión estorba
- [Clase 001 — Qué hace un framework que una biblioteca no hace](../001-que-hace-un-framework-que-una-biblioteca-no-hace/README.md)
- [Clase 036 — Inyección de dependencias](../../parte-2-la-tuberia/036-inyeccion-de-dependencias/README.md) — la consecuencia
- [Módulo 02 — Arquitectura de frameworks](../../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@fowler-injection] Fowler, Martin. *Inversion of Control Containers and the Dependency Injection pattern* — <https://martinfowler.com/articles/injection.html>
- [@gof-design-patterns] Gamma, E.; Helm, R.; Johnson, R.; Vlissides, J. *Design Patterns*. Addison-Wesley, 1994. ISBN 9780201633610 — <https://openlibrary.org/isbn/9780201633610>
- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*, 2.ª ed. Yaknyam Press, 2021. ISBN 9781732102217 — <https://openlibrary.org/isbn/9781732102217>
- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
