# Clase 112 — Reintentos e idempotencia

> [⬅️ Clase 111](../111-tareas-programadas/README.md) · [📚 Parte 8](../README.md) · [🎓 Clases](../../README.md) · [113 ➡️](../113-eventos-de-dominio/README.md)
>
> Parte **8 — Tiempo real y segundo plano** · Nivel **🔴 avanzado** · Pista **`tiempo-real`** (Tiempo real y segundo plano)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Las clases anteriores dejaron el sistema lleno de sitios donde algo se
reintenta: un cliente que reconecta, una cola que vuelve a coger un trabajo, un
temporizador que dispara dos veces.

Y hay uno más, el más común de todos: **una respuesta que se perdió**. El cobro
se hizo, la respuesta no llegó, y quien pidió no tiene forma de distinguir eso
de que no se hiciera. Va a reintentar. **Y con razón.**

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Separar las dos respuestas** —reintentar bien y que reintentar no haga daño—
  y saber cuál de las dos arregla el problema.
- **Implementar una clave de idempotencia** correctamente, que es más que
  recordar que la clave ya pasó.
- **Decir por qué la clave la pone quien pide** y no el servidor.
- **Saber qué no se debe reintentar**, que es tan importante como el resto.

## 🧩 La situación

Un cobro de treinta. Se pide **dos veces con la misma clave**, y el segundo tiene
que devolver lo mismo sin volver a cobrar.

Y para comparar, tres peticiones sin clave: **tres cobros**. Que eso pase no es
un fallo del servidor. Es lo correcto.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `POST /cobros` con clave | se cobra, y no viene marcado como repetido |
| 2 | `POST /cobros` con **la misma clave** | **no vuelve a cobrar**, y lo dice |
| 3 | `GET /cobros` | un solo cobro, de treinta |
| 4 | `GET /idempotencia.json` | **tres con clave: 1. Tres sin clave: 3.** |
| 5 | `GET /idempotencia.json` | lo que falla dos veces sale al tercer intento |
| 6 | `GET /idempotencia.json` | dónde guarda la clave y qué hace falta |

El caso 4 publica los dos números juntos a propósito:

```json
        "json_contiene": {
          "con_clave_peticiones": 3,
          "con_clave_cobros": 1,
          "sin_clave_peticiones": 3,
          "sin_clave_cobros": 3,
          "la_clave_evita_el_duplicado": true
        }
```

El `3` de abajo no es un defecto que haya que arreglar en el servidor: es la
demostración de por qué **la clave la tiene que poner quien pide**.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Reintento**](../../../glosario/README.md#reintento) | Volver a ejecutar un trabajo que falló. Solo es seguro si el trabajo es idempotente: reintentar un cobro no idempotente cobra dos veces. Y necesita espera creciente, o el reintento tumba lo que ya estaba caído. |

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
PORT=3000 java -jar target/clase-112-1.0.0.jar --server.port=3000
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
| `Clase112.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### Express · las dos respuestas, separadas

[`express/server.mjs`](implementaciones/express/server.mjs) — el caso que hay que
tener en la cabeza:

```javascript
 * Ese es el caso que hay que tener en la cabeza. El cobro se hizo, la respuesta
 * no llegó, y quien pidió no tiene forma de distinguir eso de que no se hiciera.
 * Va a reintentar. Y con razón.
```

**Y la distinción que ordena la clase entera:**

```javascript
 *   - **Reintentar bien**: espera creciente, un tope, y no reintentar lo que no
 *     tiene arreglo —un 400 no mejora por repetirlo—.
 *   - **Que reintentar no haga daño**: es lo de verdad importante, y consiste en
 *     que quien pide traiga una clave, y el servidor recuerde qué contestó a esa
 *     clave.
```

```javascript
 * Lo segundo se llama idempotencia y es la única de las dos que arregla el
 * problema. Reintentar bien sin ella solo reparte el daño mejor.
```

Y lo que casi todo el mundo implementa a medias:

```javascript
 * Guarda, por clave, **la respuesta que ya se dio**. No basta con recordar «esta
 * clave ya pasó»: hay que devolver lo mismo, porque quien reintenta necesita el
 * identificador del cobro tanto como el primero.
```

```javascript
 * Y tiene que caducar. Una clave guardada para siempre es una fuga de memoria
 * con forma de tabla; una que caduca demasiado pronto deja pasar un reintento
 * tardío. Un día suele ser el valor razonable, y hay que elegirlo a propósito.
```

Y por qué sin clave el servidor tiene que cobrar:

```javascript
  // SIN CLAVE NO HAY NADA QUE HACER. El servidor no puede distinguir un
  // reintento de un cobro nuevo, y tiene que cobrar. Es correcto y es el motivo
  // de que la clave la ponga QUIEN PIDE: solo él sabe si es lo mismo.
```

### FastAPI · por qué esto no lo trae ningún framework

[`fastapi/main.py`](implementaciones/fastapi/main.py):

```python
Ninguno de los cuatro frameworks de esta clase trae idempotencia. Y no es una
carencia: **la clave la tiene que poner quien pide**, porque solo él sabe si dos
peticiones son el mismo intento. Lo único que el servidor puede hacer es
recordar qué contestó a cada clave, y eso son diez líneas.
```

### Spring Boot · una anotación para la mitad del problema

[`spring-boot/src/main/java/labs/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java):

```java
 * Spring tiene una pieza para la mitad del problema: `@Retryable`, de Spring
 * Retry, con espera creciente y tope declarados en la anotacion. Es la respuesta
 * mas completa de los cuatro para reintentar bien, y **no toca la otra mitad**.
```

```java
 * Y la otra mitad es la que importa. Reintentar bien reparte el dano mejor;
 * lo que lo evita es que reintentar no haga nada la segunda vez, y eso no lo
 * puede resolver ninguna anotacion: **la clave la tiene que poner quien pide**,
 * porque solo el sabe si dos peticiones son el mismo intento.
```

### ASP.NET Core · la mejor caja de herramientas para reintentar

[`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs):

```csharp
// .NET tiene la mejor pieza de los cuatro para la mitad de reintentar: la
// biblioteca de resiliencia —lo que antes se llamaba Polly— con espera creciente,
// fluctuación, tope y cortacircuitos, todo declarado. Está tan integrada que
// `AddStandardResilienceHandler` te la pone en un cliente HTTP con una línea.
```

```csharp
// Y no toca la otra mitad. Reintentar bien reparte el daño mejor; **lo que lo
// evita es que reintentar no haga nada la segunda vez**, y eso no lo puede
// resolver ninguna biblioteca de cliente: la clave la tiene que poner quien pide,
// porque solo él sabe si dos peticiones son el mismo intento.
```

## 🔬 Comparación

| | Para reintentar bien | Para que no haga daño |
| --- | --- | --- |
| **Express** | nada: a mano | nada, y son diez líneas |
| **FastAPI** | nada: a mano, o `tenacity` | nada, y son diez líneas |
| **Spring Boot** | **`@Retryable`**, con espera y tope declarados | nada |
| **ASP.NET Core** | **biblioteca de resiliencia**, con cortacircuitos | nada |

Y lo medido, idéntico en los cuatro:

```text
3 peticiones con la misma clave  →  1 cobro
3 peticiones sin clave           →  3 cobros
lo que falla dos veces           →  bien al tercer intento
```

Cuatro lecturas:

- **Los cuatro ayudan con la mitad fácil y ninguno con la difícil.** Y esta vez
  la ausencia está justificada: la clave la tiene que poner quien pide, porque
  solo él sabe si dos peticiones son el mismo intento. Un framework no puede
  adivinarlo.
- **Reintentar bien no arregla el problema.** Reparte el daño mejor: menos
  avalancha, menos presión sobre lo que se acaba de caer. Pero si el cobro se
  duplica, se duplica igual con espera creciente que sin ella.
- **La implementación a medias es la habitual.** Recordar «esta clave ya pasó» y
  contestar 409 deja a quien reintenta sin el identificador que necesitaba.
  Guardar la respuesta y devolverla es lo que hace que el reintento sea
  indistinguible del original.
- **Y hay que decidir la caducidad.** Sin ella, la tabla de claves crece para
  siempre. Con una demasiado corta, un reintento tardío se cuela. Un día suele
  ser razonable, y lo que no vale es no haberlo decidido.

## ⚠️ Errores frecuentes

- **Guardar solo la clave y contestar 409.** El reintento se queda sin el
  identificador del cobro, y quien pidió no tiene forma de recuperarlo.
- **Que la clave la genere el servidor.** Entonces cada reintento trae una clave
  distinta y no sirve para nada. La tiene que poner quien pide, y tiene que ser
  la misma en el reintento.
- **Reintentar un 400.** No mejora por repetirlo. Reintentar solo tiene sentido
  con errores de red y con 5xx, y conviene declararlo explícitamente.
- **Reintentar sin tope.** Tres o cinco veces y se para. Un reintento infinito
  convierte un fallo pasajero en una tormenta.
- **Claves sin caducidad.** La tabla crece para siempre, y en algún momento pasa
  a ser el problema más caro del sistema.

## ✅ Verificación

```bash
node scripts/run-class.mjs 112
```

Para probarlo tú, la comprobación en dos líneas: manda el mismo cobro dos veces
con la misma clave y mira el libro.

```bash
curl -s -X POST -H "content-type: application/json" -H "idempotency-key: k1" -d '{"importe":30}' http://127.0.0.1:4100/cobros
```

Repite el comando tal cual y luego pide `/cobros`. Si el total es sesenta, no hay
idempotencia.

## 🧪 Reto de transferencia

1. **Busca tus escrituras que cobran, mandan o crean.** Para cada una, pregunta
   qué pasa si llega dos veces. Las que dan igual no necesitan nada.
2. **Mira si tus clientes mandan clave.** Si no la mandan, la idempotencia del
   servidor no sirve de nada: es un acuerdo entre los dos.
3. **Comprueba tu política de reintento.** Si reintenta un 400, estás gastando
   peticiones en algo que no va a funcionar nunca.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 108](../108-reconexion-y-mensajes-perdidos/README.md) — la espera creciente, del lado del cliente
- [Clase 110](../110-colas-de-trabajo/README.md) — el trabajo que se puede volver a coger
- [Clase 111](../111-tareas-programadas/README.md) — la duplicación que se evita con cerrojo
- [Índice de la parte 8](../README.md)

## Fuentes

- [@rfc9110] *RFC 9110 — HTTP Semantics*. IETF — <https://www.rfc-editor.org/rfc/rfc9110>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@hohpe-woolf-eip] Hohpe, Gregor; Woolf, Bobby. *Enterprise Integration Patterns*. Addison-Wesley, 2003. ISBN 9780321200686 — <https://openlibrary.org/isbn/9780321200686>
