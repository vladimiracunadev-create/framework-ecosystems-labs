# Clase 111 — Tareas programadas

> [⬅️ Clase 110](../110-colas-de-trabajo/README.md) · [📚 Parte 8](../README.md) · [🎓 Clases](../../README.md) · [112 ➡️](../112-reintentos-e-idempotencia/README.md)
>
> Parte **8 — Tiempo real y segundo plano** · Nivel **🟡 intermedio** · Pista **`tiempo-real`** (Tiempo real y segundo plano)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Ejecutar algo cada hora es fácil en cualquier framework. Lo que nadie enseña es
lo que pasa **cuando hay dos instancias**, que es lo normal.

Las dos tienen el mismo temporizador. A las tres de la mañana, las dos mandan el
mismo informe, cobran la misma cuota o cierran el mismo mes. Y nadie se entera
hasta que alguien recibe dos correos.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Demostrar la duplicación** en tu propio sistema, con dos programadores y una
  cuenta.
- **Escribir un cerrojo** de turno con caducidad, que son diez líneas.
- **Explicar por qué la caducidad no es opcional**, y qué pasa exactamente sin
  ella.
- **Nombrar la pieza** que tu ecosistema tiene para esto, y saber que **ninguno
  de los cuatro la trae de serie**.

## 🧩 La situación

Dos programadores independientes, cada uno con su temporizador, disparando cinco
veces. Igual que dos procesos del mismo servicio.

Se hace dos veces: sin cerrojo y con él. **Diez ejecuciones contra cinco.**

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | cada cuánto dispara y cuántas instancias hay |
| 2 | `GET /programadas.json` | **sin cerrojo: cinco disparos, diez ejecuciones** |
| 3 | `GET /programadas.json` | con cerrojo: cinco disparos, cinco ejecuciones |
| 4 | `GET /programadas.json` | el cerrojo **caduca** |
| 5 | `GET /programadas.json` | con qué programa cada uno y dónde iría su cerrojo |
| 6 | `GET /programadas.json` | qué haría falta para producción |

El caso 2 es otro de los pocos de esta obra que **exige que algo salga mal**. Sin
él, la clase enseñaría a poner un cerrojo sin haber demostrado nunca que hace
falta.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Tarea programada**](../../../glosario/README.md#tarea-programada) | Trabajo que se ejecuta a una hora, no ante una petición. Con varias instancias hace falta decidir quién la ejecuta, o se ejecuta tantas veces como instancias haya. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |
| **FastAPI** | framework web de Python (Python) | 2018 | MIT | proyecto independiente |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |
| **ASP.NET Core** | framework web de .NET (C#) | 2016 | MIT | Microsoft y .NET Foundation |

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
- **Versión que ejecuta esta clase:** `fastapi==0.121.3, uvicorn==0.40.0, httpx==0.28.1`
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
PORT=3000 java -jar target/clase-111-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |

### 🔧 ASP.NET Core

Reescritura multiplataforma y de código abierto de la pila web de Microsoft. Sus API mínimas trajeron el estilo de los microframeworks al ecosistema .NET.

- **Documentación oficial:** <https://learn.microsoft.com/aspnet/core/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `net10.0`
- **Necesita en el PATH:** `dotnet`

Preparar sus dependencias, dentro de su directorio:

```bash
dotnet build -c Release --nologo -v quiet
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 dotnet run -c Release --no-build --urls http://127.0.0.1:3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `Clase111.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### Express · el problema y el cerrojo, en el mismo archivo

[`express/server.mjs`](implementaciones/express/server.mjs):

```javascript
 * Ejecutar algo cada hora es fácil en cualquier framework. Lo que nadie enseña
 * es lo que pasa cuando hay dos instancias del servicio, que es lo normal: **las
 * dos tienen el mismo temporizador**, y a las tres de la mañana las dos mandan el
 * mismo informe, cobran la misma cuota o cierran el mismo mes.
```

**Y la propiedad del cerrojo que se olvida siempre:**

```javascript
 * La respuesta es un cerrojo: antes de trabajar, cada instancia intenta quedarse
 * con el turno, y solo trabaja quien lo consigue. Y ese cerrojo tiene una
 * propiedad que se olvida siempre: **tiene que caducar**. Si quien lo tiene se
 * muere sin soltarlo, sin caducidad la tarea no se vuelve a ejecutar jamás.
```

```javascript
 * `duenio` dice quién lo tiene y `hasta` cuándo lo suelta solo. La caducidad es
 * la parte que convierte un cerrojo en algo operable: sin ella, una instancia
 * que muera con el turno cogido deja la tarea parada para siempre, y nadie se
 * entera hasta que alguien pregunta por el informe que no llegó.
```

Y qué se comparte a propósito y qué no:

```javascript
 * Dos programadores independientes, cada uno con su propio temporizador, como
 * tendrían dos procesos. Comparten el cerrojo, que es lo que en producción sería
 * una fila de una tabla o una clave de Redis: eso es lo que hace falta que sea
 * común, y por eso aquí es lo único que se comparte a propósito.
```

### FastAPI · no hay programador, y hay que decirlo

[`fastapi/main.py`](implementaciones/fastapi/main.py):

```python
FastAPI **no tiene programador**, y conviene decirlo antes que nada: no hay
decorador de calendario ni nada parecido. Lo que hay en su ecosistema son piezas
aparte —APScheduler para el temporizador, Celery beat cuando ya hay una cola— y
la elección entre ellas es una decisión de arquitectura, no de estilo.
```

```python
Aquí se usan tareas de `asyncio` a pelo, por el mismo motivo que en las otras
tres implementaciones: **lo que esta clase enseña no es cómo se programa, es el
cerrojo**. Programar es fácil en todas partes; que dos instancias no hagan lo
mismo dos veces, no.
```

### Spring Boot · el mejor en la mitad fácil, y nada en la difícil

[`spring-boot/src/main/java/labs/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java):

```java
 * Spring es el que mejor resuelve la mitad facil: `@Scheduled` con una expresion
 * de calendario, `@EnableScheduling` para encenderlo, y ya esta. Es la pieza mas
 * completa de los cuatro y la que menos codigo pide.
```

```java
 * Y **no resuelve nada de la mitad dificil**. Dos instancias con la misma
 * anotacion disparan las dos. La respuesta de este ecosistema tiene nombre
 * propio —ShedLock, o Quartz con su almacen en base de datos— y hay que
 * anadirla: el framework no la trae.
```

### ASP.NET Core · un temporizador que no se solapa

[`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs):

```csharp
// .NET no trae un programador de calendario en el framework web: trae
// `PeriodicTimer` y `BackgroundService`, que es «cada tanto» y no «los martes a
// las tres». Para calendarios de verdad, la respuesta de este ecosistema se
// llama Quartz.NET o Hangfire, y las dos traen ya resuelto el cerrojo del que va
// esta clase.
```

**Y una diferencia técnica que merece conocerse:**

```csharp
// `PeriodicTimer` merece un comentario aparte porque es notablemente mejor que
// el temporizador clásico: **no se solapa**. Si la tarea tarda más que el
// intervalo, el siguiente tic espera en lugar de arrancar encima, que es
// exactamente el fallo que produce trabajos duplicados en la misma instancia.
// Aquí el problema es el otro —dos instancias— y ese no lo resuelve nadie por ti.
```

## 🔬 Comparación

| | Cómo se programa | ¿Trae cerrojo? | La pieza que hace falta |
| --- | --- | :---: | --- |
| **Express** | `setInterval`: no hay programador, hay temporizadores | ❌ | `node-cron` + un cerrojo propio |
| **FastAPI** | ninguno en el framework | ❌ | APScheduler, o Celery beat |
| **Spring Boot** | `@Scheduled` con calendario, lo más completo | ❌ | **ShedLock**, o Quartz con almacén |
| **ASP.NET Core** | `PeriodicTimer` + `BackgroundService`, sin solape | ❌ | **Hangfire** o Quartz.NET |

Y lo medido, idéntico en los cuatro:

```text
sin cerrojo:  5 disparos × 2 instancias = 10 ejecuciones
con cerrojo:  5 disparos × 2 instancias =  5 ejecuciones
```

Cuatro lecturas:

- **Ninguno de los cuatro trae el cerrojo.** Los cuatro resuelven programar y
  ninguno resuelve no duplicar. Es la brecha más constante de esta parte, y la
  que hace que este fallo llegue a producción una y otra vez.
- **Spring gana en la mitad fácil por bastante.** Una anotación con expresión de
  calendario contra un `setInterval`. Y eso hace que su brecha sea la más
  peligrosa: lo cómodo que es programar invita a no preguntarse lo otro.
- **`PeriodicTimer` resuelve un problema parecido y distinto.** Evita que los
  tics se solapen **dentro de la misma instancia**. Es útil, se agradece, y no
  tiene nada que ver con dos instancias.
- **El cerrojo son diez líneas.** Lo difícil no es escribirlo: es acordarse de
  que hace falta, y ponerle caducidad.

## ⚠️ Errores frecuentes

- **Probar con una instancia.** El fallo no existe con una. Aparece el día que se
  escala, y el síntoma —«a algunos les llegan dos correos»— tarda semanas en
  llegar a quien puede arreglarlo.
- **Un cerrojo sin caducidad.** Si la instancia que lo tiene se muere, la tarea
  no se vuelve a ejecutar nunca. Es peor que el problema original, porque no
  falla: deja de pasar.
- **Una caducidad más corta que la tarea.** Si el cerrojo caduca a los treinta
  segundos y la tarea tarda un minuto, la segunda instancia lo coge a medias y
  vuelve a estar duplicado.
- **Confiar en que solo hay una instancia «por ahora».** El despliegue sin corte
  arranca la nueva antes de parar la vieja: durante ese minuto hay dos, aunque
  nadie haya escalado nada.
- **Poner el cerrojo en memoria.** Como aquí. Sirve para enseñarlo y no sirve
  para nada más: dos procesos no comparten memoria.

## ✅ Verificación

```bash
node scripts/run-class.mjs 111
```

Para verlo tú:

```bash
curl -s http://127.0.0.1:4100/programadas.json
```

Y en tu proyecto, la prueba que lo destapa: arranca dos copias del servicio con
la tarea programada cada minuto y cuenta cuántas veces se ejecuta.

## 🧪 Reto de transferencia

1. **Cuenta tus tareas programadas.** Para cada una, pregunta qué pasa si se
   ejecuta dos veces. Las que dan igual no necesitan nada; las demás, sí.
2. **Mira tu despliegue.** Si es sin corte, ya has tenido dos instancias a la vez
   en cada despliegue de este año.
3. **Pon caducidad y compárala con la duración.** La caducidad tiene que ser
   mayor que lo que tarda la tarea en su peor día, no en el mejor.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 109](../109-estado-de-conexion-con-varias-instancias/README.md) — el mismo problema con las conexiones
- [Clase 110](../110-colas-de-trabajo/README.md) — el trabajo que no depende del reloj
- [Clase 112](../112-reintentos-e-idempotencia/README.md) — qué hacer cuando algo sí se repite
- [Índice de la parte 8](../README.md)

## Fuentes

- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@spring-boot-docs] *Spring Boot — Documentación oficial* — <https://spring.io/projects/spring-boot>
- [@hohpe-woolf-eip] Hohpe, Gregor; Woolf, Bobby. *Enterprise Integration Patterns*. Addison-Wesley, 2003. ISBN 9780321200686 — <https://openlibrary.org/isbn/9780321200686>
