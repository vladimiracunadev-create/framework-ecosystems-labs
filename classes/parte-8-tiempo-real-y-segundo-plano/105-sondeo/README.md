# Clase 105 — Sondeo

> [⬅️ Parte 7](../../parte-7-renderizado-y-fullstack/README.md) · [📚 Parte 8](../README.md) · [🎓 Clases](../../README.md) · [106 ➡️](../106-eventos-enviados-por-el-servidor/README.md)
>
> Parte **8 — Tiempo real y segundo plano** · Nivel **🟡 intermedio** · Pista **`tiempo-real`** (Tiempo real y segundo plano)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Antes de abrir conexiones permanentes —las tres clases siguientes— conviene
medir la respuesta más antigua a «avísame cuando cambie»: **preguntar cada
cierto tiempo**.

Casi siempre es suficiente, y siempre es la más barata de operar: no hay
conexiones abiertas, no hay estado por cliente, y cualquier balanceador la
reparte sin saber nada de nada.

Lo que esta clase enseña no es el bucle de preguntar. Es que **preguntar bien es
preguntar con condición**.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Escribir un sondeo condicional** con `ETag` e `If-None-Match` en los cuatro.
- **Medir cuántas de tus preguntas sobran** y cuánto cuestan.
- **Decir en voz alta lo que el condicional no arregla**, que es la mitad honesta
  del asunto.
- **Elegir sondeo o conexión permanente** con un criterio: el retraso aceptable.

## 🧩 La situación

Un estado que cambia poco: una cifra de pedidos con un número de versión. Alguien
quiere enterarse cuando cambie, y lo único que tiene es HTTP.

Seis preguntas: **cinco sin novedad y una con ella**. Esa proporción no es del
ejercicio, es la de cualquier sondeo real.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /estado` | el estado con su `ETag` — y lo guarda |
| 2 | `GET /estado` con `If-None-Match` | **304, y sin cuerpo** |
| 3 | `POST /cambiar` | la versión sube |
| 4 | `GET /estado` con el mismo `If-None-Match` | ahora sí, 200 con el dato nuevo |
| 5 | `GET /sondeo.json` | **cinco de cada seis preguntas sobran** |
| 6 | `GET /sondeo.json` | cómo pone cada uno su marca, y qué no arregla |

El caso 2 lleva un `cuerpo_no_contiene` que es la comprobación de verdad:

```json
      "esperado": {
        "estado": 304,
        "cuerpo_no_contiene": ["version", "pedidos"]
      }
```

Un 304 con cuerpo es un error que pasa desapercibido: el navegador lo descarta y
el ancho de banda se gasta igual.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Sondeo**](../../../glosario/README.md#sondeo) *(Polling)* | Preguntar cada cierto tiempo si hay novedades. Simple, funciona en todas partes y desperdicia peticiones; el sondeo largo reduce el desperdicio manteniendo la petición abierta. |

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
PORT=3000 java -jar target/clase-105-1.0.0.jar --server.port=3000
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
| `Clase105.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### Express · la condición a la vista

[`express/server.mjs`](implementaciones/express/server.mjs) — y el encuadre de la
parte entera:

```javascript
 * Antes de las tres clases siguientes —eventos del servidor, WebSocket, y lo que
 * cuesta mantenerlos vivos— conviene medir esta, porque casi siempre es
 * suficiente y siempre es la más barata de operar: no hay conexiones abiertas,
 * no hay estado por cliente, y un balanceador cualquiera la reparte sin saber
 * nada.
```

La condición:

```javascript
  // Si quien pregunta ya tiene esta versión, se le dice que no hay nada nuevo y
  // se acabó: 304, sin cuerpo. Es la misma mecánica de la clase 048 con las
  // cachés, usada aquí para un fin distinto — no para evitar una consulta, sino
  // para abaratar una pregunta que se va a repetir cien veces.
```

Y dos detalles que se equivocan a menudo:

```javascript
/** El identificador de la versión actual, en el formato que pide HTTP: entre
 *  comillas. Sin las comillas, algunos intermediarios lo descartan. */
const marca = () => `"v${version}"`;
```

```javascript
  // `no-cache` no significa «no guardes»: significa «guárdalo, pero pregunta
  // antes de usarlo». Es exactamente lo que un sondeo necesita.
```

### FastAPI · el camino cómodo va en contra

[`fastapi/main.py`](implementaciones/fastapi/main.py):

```python
La misma mecánica que en Express, con una diferencia de forma que se nota al
escribirla: FastAPI no tiene un objeto respuesta al que ponerle cabeceras salvo
que se pida. Para devolver un 304 sin cuerpo hay que construir una `Response` a
mano, porque el camino cómodo del framework —devolver un diccionario— siempre
lleva cuerpo y siempre lleva 200.
```

```python
Es un ejemplo pequeño y claro de lo que la clase 005 llamaba idiomático frente a
traducido: el camino que el framework hace fácil es devolver datos, y aquí lo que
hace falta es devolver *ausencia* de datos.
```

### Spring Boot · el único con esto incorporado, y una trampa

[`spring-boot/src/main/java/labs/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java):

```java
 * Spring es el unico de los cuatro que trae la validacion condicional a mano
 * como parte del framework: `ResponseEntity` sabe lo que es un `ETag` y
 * `checkNotModified` sabe compararlo. Aqui se escribe el `if` a la vista, igual
 * que en los otros tres, para que la comparacion sea de la misma cosa — pero
 * conviene saber que existe `WebRequest.checkNotModified(etag)`, que hace lo
 * mismo en una linea y devuelve un booleano.
```

**Y la distinción que más se olvida de toda la clase:**

```java
 * Y hay un filtro que va todavia mas lejos: `ShallowEtagHeaderFilter` calcula el
 * ETag por su cuenta a partir del cuerpo. Ahorra el ancho de banda y no ahorra
 * NADA de trabajo, porque para calcularlo tiene que generar el cuerpo entero.
 * Es una distincion que se olvida a menudo y que aqui importa: una marca de
 * version barata —como la de esta clase— evita la consulta; una calculada del
 * cuerpo, no.
```

### ASP.NET Core · la misma incomodidad, por el mismo motivo

[`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs):

```csharp
// El detalle propio de esta implementación está en cómo se devuelve el 304.
// `Results.Json(...)` siempre lleva cuerpo y siempre lleva 200, así que para
// decir «no hay nada nuevo» hay que bajar al `HttpContext` y escribir la
// cabecera a mano. Es la misma incomodidad que en FastAPI y por el mismo motivo:
// **el camino cómodo de un framework de API es devolver datos**, y aquí lo que
// hace falta es devolver la ausencia de ellos.
```

## 🔬 Comparación

| | Cómo se pone la marca | ¿Tiene algo incorporado? |
| --- | --- | --- |
| **Express** | `respuesta.set("ETag", …)` y un `if` | un `etag` automático que calcula del cuerpo |
| **FastAPI** | construyendo una `Response` a mano | no |
| **Spring Boot** | `ResponseEntity` con `.header(ETAG, …)` | `checkNotModified` y `ShallowEtagHeaderFilter` |
| **ASP.NET Core** | bajando al `HttpContext` | middleware de `ResponseCaching` |

Y la medición, idéntica en los cuatro:

| | preguntas | sobran | cuerpo cuando sobra | cuerpo cuando hay novedad |
| --- | ---: | ---: | ---: | ---: |
| los cuatro | 6 | **5** | **0 B** | 33 B |

Cuatro lecturas:

- **Cinco de cada seis preguntas sobran, y eso no es un defecto del sondeo: es su
  definición.** Preguntar cuando no hay novedad es lo que se paga por no tener
  una conexión abierta.
- **Con condición, esas cinco no cuestan ni un byte de cuerpo.** Con un `ETag` de
  siete caracteres y un `if`, el 83 % del tráfico de este sondeo desaparece.
- **Lo que no desaparece es la ida y vuelta.** Cinco peticiones siguen siendo
  cinco conexiones, cinco entradas en el registro y cinco veces la latencia. El
  condicional abarata el sondeo, no lo elimina.
- **El ETag calculado del cuerpo es media solución.** Ahorra ancho de banda y no
  ahorra trabajo: para calcularlo hay que generar el cuerpo. Una marca de versión
  barata —un número, una fecha de modificación— evita también la consulta, y es
  la diferencia entre un sondeo que escala y uno que no.

## ⚠️ Errores frecuentes

- **Devolver un cuerpo con el 304.** El cliente lo descarta y el ancho de banda
  se gasta igual. Es un fallo invisible: todo funciona.
- **El `ETag` sin comillas.** La especificación las exige. Algunos
  intermediarios descartan la cabecera sin avisar y el condicional deja de
  funcionar sin que nadie se entere.
- **Confundir `no-cache` con `no-store`.** El primero dice «guárdalo y pregunta
  antes de usarlo», que es lo que un sondeo quiere. El segundo dice «no lo
  guardes», y desactiva justo lo que se estaba montando.
- **Calcular el ETag del cuerpo y creer que se ahorra trabajo.** Se ahorra la
  transferencia. La consulta se hace igual.
- **Sondear cada segundo «por si acaso».** El intervalo se elige a partir del
  retraso aceptable, y ese número lo da el producto. Un panel de ventas aguanta
  treinta segundos; un marcador deportivo, no.

## ✅ Verificación

```bash
node scripts/run-class.mjs 105
```

Para hacerlo tú, la prueba de dos líneas que dice si tu API soporta sondeo
barato:

```bash
curl -s -D - -o /dev/null http://127.0.0.1:4100/estado | grep -i etag
```

Y con esa marca:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -H 'If-None-Match: "v1"' http://127.0.0.1:4100/estado
```

Si sale `200`, cada pregunta te está costando el cuerpo entero.

## 🧪 Reto de transferencia

1. **Cuenta tus sondeos.** Busca en el registro del servidor la ruta más pedida.
   Si es la misma cada pocos segundos desde el mismo cliente, es un sondeo, lo
   hayas llamado así o no.
2. **Mira si devuelven 304.** Casi ninguno lo hace. Añadir la marca de versión y
   el `if` es media hora y quita la mayor parte del tráfico.
3. **Escribe tu retraso aceptable.** En segundos, para cada pantalla que se
   refresca sola. Ese número es el que decide las cuatro clases siguientes, y
   casi nunca está escrito en ningún sitio.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 048](../../parte-3-validacion-y-contrato/048-etags-y-cache-condicional/README.md) — de dónde sale el `ETag`
- [Clase 106](../106-eventos-enviados-por-el-servidor/README.md) — dejar de preguntar y que te avisen
- [Índice de la parte 8](../README.md)

## Fuentes

- [@rfc9110] *RFC 9110 — HTTP Semantics*. IETF — <https://www.rfc-editor.org/rfc/rfc9110>
- [@rfc9111] *RFC 9111 — HTTP Caching*. IETF — <https://www.rfc-editor.org/rfc/rfc9111>
- [@mdn-web-docs] *MDN Web Docs* — <https://developer.mozilla.org/>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
