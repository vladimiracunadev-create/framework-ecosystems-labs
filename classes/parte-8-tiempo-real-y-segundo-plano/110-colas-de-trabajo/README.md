# Clase 110 — Colas de trabajo

> [⬅️ Clase 109](../109-estado-de-conexion-con-varias-instancias/README.md) · [📚 Parte 8](../README.md) · [🎓 Clases](../../README.md) · [111 ➡️](../111-tareas-programadas/README.md)
>
> Parte **8 — Tiempo real y segundo plano** · Nivel **🟡 intermedio** · Pista **`tiempo-real`** (Tiempo real y segundo plano)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Generar un informe, mandar un correo, redimensionar una imagen, llamar a un
proveedor lento. **Nada de eso tiene que pasar antes de contestar.**

Hacerlo dentro de la petición cuesta tres cosas a la vez: quien pide espera, un
fallo del proveedor se convierte en un error de la petición aunque lo importante
ya estuviera guardado, y no hay forma de reintentar sin repetir la petición
entera.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Contestar 202 con `Location`** y saber por qué un 200 aquí es mentira.
- **Demostrar que la petición no espera**, que es lo único que distingue esto de
  hacerlo dentro.
- **Reconocer las cuatro piezas** que cada ecosistema ofrece, y dónde acaba cada
  una.
- **Decir en voz alta lo que le falta a una cola en memoria**, que es todo.

## 🧩 La situación

Un informe que tarda cuatrocientos milisegundos. Se pide, se contesta **en
milisegundos**, y se consulta después.

El resultado final es el mismo con cola y sin ella. Lo único que las distingue es
el reloj, así que el reloj es lo que se mide.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `POST /tareas` | **202** con `Location`, y estado `encolada` |
| 2 | `GET /tareas/{id}` enseguida | **todavía no está hecho** |
| 3 | `GET /cola.json` | **la respuesta no espera al trabajo** |
| 4 | `GET /cola.json` | y el trabajo sí tarda, medido de verdad |
| 5 | `GET /tareas/{id}` después | ahora sí: `terminada`, con su resultado |
| 6 | `GET /cola.json` | cómo encola cada uno y qué le falta |

El caso 2 es la trampa que hace falta: sin él, una implementación que hiciera el
trabajo dentro de la petición pasaría los casos 1 y 5 sin despeinarse.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Cola de trabajo**](../../../glosario/README.md#cola-de-trabajo) | Sacar de la petición el trabajo que no tiene que ocurrir ahora: enviar el correo, generar el informe. La petición responde antes y el trabajo se ejecuta después, con reintentos. |

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
PORT=3000 java -jar target/clase-110-1.0.0.jar --server.port=3000
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
| `Clase110.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### Express · no esperar la promesa, y un `await` que no sobra

[`express/server.mjs`](implementaciones/express/server.mjs) — el encuadre:

```javascript
 * La respuesta es contestar **202 Aceptado**, decir dónde mirar y hacer el
 * trabajo después. El código de estado importa: un 200 significa «hecho», y esto
 * no está hecho. Es la clase 015 aplicada donde más se nota.
```

Y lo que en Node no es lo que parece:

```javascript
 * Y ahí está el detalle que confunde a mucha gente: esto NO es paralelismo. El
 * trabajo corre en el mismo bucle de eventos que atiende las peticiones. Sirve
 * porque lo que tarda es esperar —una consulta, una llamada de red— y no
 * calcular. Un trabajo que consuma procesador de verdad bloquea el servidor
 * igual, y entonces hace falta otro proceso.
```

**Y un fallo que encontró el contrato y se queda escrito:**

```javascript
    // Una función `async` **no empieza a ser asíncrona hasta su primer `await`**:
    // todo lo que haya antes corre síncrono, dentro de la petición que la lanzó.
    // Sin esta línea, el estado ya era «en curso» cuando la respuesta salía, y el
    // caso que exige «encolada» fallaba.
```

```javascript
    // Es un detalle pequeño con una consecuencia grande: si lo primero que hace
    // el trabajo es algo costoso y no hay un `await` antes, ese coste se lo come
    // la petición, y la cola no ha servido para nada.
```

### FastAPI · una pieza con nombre, y su límite

[`fastapi/main.py`](implementaciones/fastapi/main.py):

```python
FastAPI es el único de los cuatro que trae una pieza con nombre para esto:
`BackgroundTasks`. Se declara como un parámetro más del manejador y se le añade
lo que hay que hacer después; el framework lo ejecuta **cuando la respuesta ya se
ha enviado**.
```

```python
Es cómodo y hay que saber exactamente hasta dónde llega, porque su nombre invita
a confundirlo con una cola de verdad: la tarea vive en el proceso, no se
reintenta, no se puede consultar, y **si el proceso se reinicia desaparece**.
Para lo que sirve —mandar un correo después de contestar— es perfecta. Para lo
que no, la respuesta se llama Celery, y es otra pieza de infraestructura.
```

### Spring Boot · la anotación que más se usa mal

[`spring-boot/src/main/java/labs/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java):

```java
 *   - **Solo funciona a traves del proxy.** Llamar a un metodo `@Async` desde
 *     otro metodo de la MISMA clase no hace nada: se ejecuta igual de sincrono.
 *     Es el fallo numero uno con esta anotacion, y por eso aqui el trabajo vive
 *     en un `@Service` aparte.
 *   - **Hace falta `@EnableAsync`.** Sin ella, la anotacion se ignora en
 *     silencio: sin error, sin aviso, y todo sigue esperando.
 *   - **Usa un grupo de hilos.** Aqui si es paralelismo de verdad, al contrario
 *     que en Node o en Python, y eso significa que el grupo se puede agotar.
```

Y por qué el trabajador está en otra clase, dicho donde está:

```java
     * No es un capricho de organizacion: `@Async` funciona porque Spring
     * envuelve el objeto en un proxy, y una llamada dentro de la misma clase no
     * pasa por el proxy. Ponerlo aqui haria que no ocurriera nada de lo que
     * promete la anotacion.
```

### ASP.NET Core · el único con una cola de verdad en la biblioteca estándar

[`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs):

```csharp
// De los cuatro, es el único con **una cola de verdad en la biblioteca estándar**:
// `System.Threading.Channels`. No es una pieza del framework web, es del lenguaje,
// y hace exactamente lo que hace falta: una cola con un extremo por el que se
// escribe y otro por el que se lee, con espera sin bloquear.
```

```csharp
// Y el que lee es un `BackgroundService`: un servicio con ciclo de vida propio,
// que arranca con la aplicación y se para con ella. Eso es lo que en Node es «no
// esperar la promesa» y en Spring es `@Async`, aquí escrito como lo que de verdad
// es: **un consumidor separado del productor**.
```

Con la decisión que hay que tomar y casi nadie toma:

```csharp
// LA COLA. Sin límite aquí; en producción, un límite es obligatorio —si se
// encola más rápido de lo que se consume, sin límite se acaba la memoria y con
// límite se rechaza, que es mucho mejor sitio donde fallar.
```

Y el bucle del trabajador, bien escrito:

```csharp
        // `ReadAllAsync` espera sin gastar procesador y termina solo cuando se
        // cierra la cola o se cancela el testigo. Es la forma correcta de
        // escribir un bucle de trabajador, y la que evita el `while (true)` con
        // `sleep` que casi todo el mundo escribe la primera vez.
```

## 🔬 Comparación

| | Cómo se encola | ¿Es paralelismo? | Lo que ofrece la casa |
| --- | --- | :---: | --- |
| **Express** | una promesa que no se espera | ❌ mismo bucle de eventos | nada |
| **FastAPI** | `BackgroundTasks`, parámetro del manejador | ❌ mismo bucle | una pieza con nombre |
| **Spring Boot** | `@Async` en otra clase, con `@EnableAsync` | ✅ grupo de hilos | una anotación, con dos trampas |
| **ASP.NET Core** | `Channel` + `BackgroundService` | ✅ | **una cola de verdad, en el lenguaje** |

Y lo medido, que es lo mismo en los cuatro:

```text
202 en decenas de milisegundos   ·   trabajo terminado a los ~450
```

Cuatro lecturas:

- **Los cuatro contestan antes de trabajar, y ninguno tiene una cola.** Lo que
  tienen es una forma de aplazar dentro del proceso. La diferencia entre eso y
  una cola es lo que pasa cuando el proceso muere, y las cuatro declaran
  `se_pierde_al_reiniciar: true`.
- **Dos de los cuatro no son paralelismo.** En Node y en Python el trabajo corre
  en el mismo bucle que atiende peticiones: sirve para esperar, no para calcular.
  Un trabajo que consuma procesador bloquea el servidor igual.
- **La pieza de ASP.NET es de otra categoría.** `Channel` es una cola de verdad,
  con productor, consumidor y contrapresión, y viene en la biblioteca estándar.
  Que sea del lenguaje y no del framework web es lo que la hace tan reutilizable.
- **La trampa de Spring merece recordarse aparte.** `@Async` no hace nada si
  falta `@EnableAsync`, y no hace nada si se llama desde la misma clase. Las dos
  fallan en silencio, y son la causa número uno de «no entiendo por qué esto
  sigue tardando».

## ⚠️ Errores frecuentes

- **Contestar 200.** Significa «hecho», y no está hecho. El 202 existe para esto
  y además obliga a pensar dónde se consulta el resultado.
- **No dar `Location`.** Sin ella, quien pide tiene que construir la URL a mano,
  y a partir de ahí ya no puedes cambiarla.
- **Creer que aplazar es encolar.** Una cola en memoria pierde todo al
  reiniciarse, y eso incluye un despliegue rutinario.
- **Poner trabajo de procesador en el bucle de eventos.** En Node y en Python,
  aplazar sirve para esperar. Calcular hay que sacarlo a otro proceso.
- **Una cola sin límite.** Si se encola más rápido de lo que se consume, sin
  límite se acaba la memoria. Con límite se rechaza, que es un sitio mucho mejor
  donde fallar.

## ✅ Verificación

```bash
node scripts/run-class.mjs 110
```

Para verlo tú, la prueba de una línea que dice si tu alta espera o no:

```bash
curl -s -o /dev/null -w "%{http_code} %{time_total}\n" -X POST -H "content-type: application/json" -d '{"descripcion":"prueba"}' http://127.0.0.1:4100/tareas
```

Si el tiempo se parece al del trabajo, no hay cola: hay una promesa esperada.

## 🧪 Reto de transferencia

1. **Busca tu petición más lenta.** Mira qué hace y pregunta cuánto de eso tiene
   que ocurrir antes de contestar. Casi siempre es menos de lo que parece.
2. **Comprueba tus códigos de estado.** Si algo se hace después de contestar y
   contestas 200, estás mintiendo. Cambiarlo a 202 es una línea.
3. **Averigua qué pasa si reinicias con la cola llena.** Encola diez cosas, para
   el proceso y vuelve a arrancarlo. Si desaparecieron, ya sabes qué pieza te
   falta.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 111](../111-tareas-programadas/README.md) — trabajo por tiempo, y sin duplicarse
- [Clase 112](../112-reintentos-e-idempotencia/README.md) — reintentar sin causar daño
- [Clase 113](../113-eventos-de-dominio/README.md) — quién reacciona a qué
- [Índice de la parte 8](../README.md)

## Fuentes

- [@rfc9110] *RFC 9110 — HTTP Semantics*. IETF — <https://www.rfc-editor.org/rfc/rfc9110>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@hohpe-woolf-eip] Hohpe, Gregor; Woolf, Bobby. *Enterprise Integration Patterns*. Addison-Wesley, 2003. ISBN 9780321200686 — <https://openlibrary.org/isbn/9780321200686>
