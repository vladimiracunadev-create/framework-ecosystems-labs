# Clase 113 — Eventos de dominio

> [⬅️ Clase 112](../112-reintentos-e-idempotencia/README.md) · [📚 Parte 8](../README.md) · [🎓 Clases](../../README.md) · [114 ➡️](../../parte-9-movil-escritorio-y-sin-conexion/114-la-misma-pantalla-en-movil/README.md)
>
> Parte **8 — Tiempo real y segundo plano** · Nivel **🔴 avanzado** · Pista **`tiempo-real`** (Tiempo real y segundo plano)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).
>
> 🏁 **Última clase de la parte 8.**

## 🎯 Objetivo

El alta de un usuario acaba arrastrando cosas: mandar la bienvenida, contarlo en
las estadísticas, avisar a ventas, crear la carpeta.

Si todo eso se escribe dentro del manejador del alta, el alta pasa a saber de
correo, de métricas y de ventas; añadir una reacción obliga a tocarla; y **un
fallo en la cuarta reacción rompe un alta que ya estaba hecha**.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Montar un bus de eventos** en quince líneas, y saber que eso es todo lo que
  es.
- **Proteger a quien publica** del fallo de un consumidor, que es la línea que
  decide si esto sirve.
- **Reconocer las dos trampas de Spring**, el único que lo trae de serie.
- **Nombrar lo que falta** para que un consumidor que falla no se pierda.

## 🧩 La situación

Un alta. Dos consumidores independientes: uno manda la bienvenida y otro cuenta.
Ninguno sabe del otro, y el alta no sabe de ninguno.

Y un tercero que **revienta siempre**, para responder la pregunta que decide si
esto vale en producción.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `POST /usuarios` | el alta crea el usuario y contesta 201 |
| 2 | `GET /efectos` | los dos consumidores reaccionaron, cada uno lo suyo |
| 3 | `GET /eventos.json` | reaccionan sin conocerse |
| 4 | `GET /eventos.json` | **un consumidor roto no rompe a los demás ni a la petición** |
| 5 | `GET /eventos.json` | quitar un consumidor no obliga a tocar a quien publica |
| 6 | `GET /eventos.json` | cómo publica cada uno y qué pasa con un fallo |

El caso 4 es el que separa esta clase de una demostración de funciones que se
llaman entre sí. Publicar es fácil; **sobrevivir a un consumidor roto es lo que
hay que comprobar**.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Evento de dominio**](../../../glosario/README.md#evento-de-dominio) | Un hecho del negocio que ya ocurrió —«tarea completada»— publicado para que otros reaccionen. Desacopla a quien lo produce de quien lo consume, y hace más difícil seguir el flujo completo. |

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
PORT=3000 java -jar target/clase-113-1.0.0.jar --server.port=3000
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
| `Clase113.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### Express · quince líneas, y una de ellas es la importante

[`express/server.mjs`](implementaciones/express/server.mjs) — el problema:

```javascript
 *   - el alta pasa a saber de correo, de métricas y de ventas;
 *   - añadir una reacción obliga a tocar el alta;
 *   - y un fallo en la cuarta reacción rompe el alta, que ya estaba hecha.
```

Y el cambio de dirección, que es toda la idea:

```javascript
 * La alternativa es que el alta diga **qué pasó** —«se creó un usuario»— y que
 * quien tenga algo que hacer con eso se suscriba. Ese cambio de dirección es
 * todo: el emisor deja de conocer a los consumidores.
```

**La línea que decide si esto sirve:**

```javascript
 * El `try` de dentro del bucle es la línea más importante del archivo. Sin él,
 * el primer consumidor que reviente deja sin ejecutar a los siguientes y devuelve
 * el error a quien publicó — es decir, rompe el alta por culpa de un correo.
```

Y el problema nuevo que trae el desacoplamiento, dicho de frente:

```javascript
 * Y trae un problema nuevo que hay que mirar de frente: **si un consumidor
 * falla, ¿qué?**. Aquí está resuelto de la forma mínima —se captura y se sigue—
 * y eso tiene una consecuencia que se declara: el fallo se pierde. En un sistema
 * de verdad, un consumidor que falla se reintenta —clase 112— y para eso el
 * evento tiene que estar guardado en algún sitio, no solo en memoria.
```

### FastAPI · lo caro no es montarlo

[`fastapi/main.py`](implementaciones/fastapi/main.py):

```python
Y esa pequeñez es parte de la lección. Un bus de eventos no es una pieza de
infraestructura: es un cambio de dirección en las llamadas. Lo caro no es
montarlo, es decidir **qué pasa cuando un consumidor falla**, y eso no lo resuelve
ninguna biblioteca por ti.
```

### Spring Boot · el único con bus de serie, y sus dos trampas

[`spring-boot/src/main/java/labs/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java):

```java
 * Spring es **el unico de los cuatro con un bus de eventos dentro del
 * framework**: `ApplicationEventPublisher` para publicar y `@EventListener` para
 * suscribirse. No hay que escribir nada, y los consumidores se descubren solos
 * al arrancar.
```

**Y las dos trampas, que valen la clase entera:**

```java
 *   - **Es sincrono por omision.** El consumidor corre en el mismo hilo y dentro
 *     de la misma transaccion que quien publico. Eso puede ser exactamente lo que
 *     se quiere —que el correo no salga si la transaccion se deshace— o un
 *     desastre —que el alta espere a un proveedor lento—. Se cambia con `@Async`,
 *     y entonces cambia tambien lo que pasa con los errores.
 *   - **Si un consumidor lanza, el que publico se entera.** Por omision, la
 *     excepcion sube hasta `publishEvent` y rompe la peticion. Es lo contrario de
 *     lo que casi todo el mundo espera de un bus, y por eso aqui cada consumidor
 *     captura lo suyo — que es lo que las otras tres implementaciones hacen en el
 *     bucle de publicar.
```

Y dónde se ve la segunda:

```java
     * Captura su propio fallo. Sin ese `try`, la excepcion subiria hasta
     * `publishEvent` y rompiria el alta: es la trampa numero dos de Spring, y
     * verla escrita es la unica forma de acordarse de ella.
```

### ASP.NET Core · el contenedor de dependencias como bus

[`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs):

```csharp
// .NET no trae bus de eventos de dominio en el framework web. Lo que hay es un
// contenedor de dependencias muy bueno, y con él la forma idiomática de montar
// esto: **registrar varios servicios que implementan la misma interfaz** y pedir
// la colección entera. `IEnumerable<IConsumidor>` inyecta a todos los que haya
// registrados, y añadir uno nuevo es una línea en el arranque.
```

```csharp
// Es un bus de eventos con otro nombre, y tiene una ventaja concreta sobre el
// diccionario de funciones de Express o FastAPI: cada consumidor es un tipo, con
// sus propias dependencias inyectadas. Y una desventaja simétrica: hay que
// declararlo en el arranque, no basta con escribirlo.
```

## 🔬 Comparación

| | Cómo se publica | Cómo se suscribe | ¿Lo trae el framework? |
| --- | --- | --- | :---: |
| **Express** | `publicar()` sobre un `Map` | `suscribir()` | ❌ quince líneas |
| **FastAPI** | igual, con un diccionario | igual | ❌ quince líneas |
| **Spring Boot** | `ApplicationEventPublisher` | `@EventListener` | ✅ **sí** |
| **ASP.NET Core** | recorriendo `IEnumerable<IConsumidor>` | registrando otro en el arranque | ❌ pero el contenedor lo hace natural |

Y lo comprobado, idéntico en los cuatro:

```text
dos consumidores  →  los dos reaccionan
un tercero roto   →  los dos siguen reaccionando, y el alta sigue dando 201
```

Cuatro lecturas:

- **Montar el bus no es el problema.** Son quince líneas en tres de los cuatro, y
  en Spring ninguna. Lo que hay que decidir es qué pasa con un consumidor que
  falla, y eso no lo resuelve nadie por ti.
- **Spring lo trae y por eso hay que conocer sus dos trampas.** Síncrono y en la
  misma transacción por omisión, y una excepción del consumidor rompe la petición.
  Las dos pueden ser lo que quieres; ninguna es lo que se espera por defecto.
- **El contenedor de .NET convierte esto en algo natural.** Registrar varios
  servicios de la misma interfaz y pedir la colección es un bus con otro nombre,
  y cada consumidor tiene sus dependencias inyectadas.
- **Las cuatro pierden el fallo, y las cuatro lo dicen.** Capturar y seguir es lo
  mínimo correcto, y deja un agujero: nadie reintenta. Para reintentar hace falta
  que el evento esté guardado antes de publicarse, y eso ya es una tabla y una
  decisión de arquitectura.

## ⚠️ Errores frecuentes

- **Publicar sin proteger a quien publica.** Un consumidor que lanza rompe el
  alta. Es exactamente lo que se quería evitar al desacoplar.
- **Creer que desacoplar es asíncrono.** En las cuatro implementaciones los
  consumidores corren en el mismo hilo y antes de contestar. Desacoplado no
  significa después.
- **Que el consumidor haga algo lento.** Si es síncrono, el alta espera. Aquí es
  donde se combina esta clase con la 110: el consumidor encola, no trabaja.
- **Perder el fallo sin decirlo.** Capturar y seguir está bien; capturar, seguir
  y no registrarlo en ninguna parte convierte un correo no enviado en un misterio.
- **Un evento con demasiado dentro.** Si el evento lleva el objeto entero, los
  consumidores acaban dependiendo de su forma, y se ha vuelto al acoplamiento por
  otra puerta.

## ✅ Verificación

```bash
node scripts/run-class.mjs 113
```

Para verlo tú:

```bash
curl -s http://127.0.0.1:4100/eventos.json
```

## 🧪 Reto de transferencia

1. **Abre tu manejador de alta más grande.** Cuenta cuántas cosas hace que no son
   el alta. Cada una es un consumidor.
2. **Prueba a romper uno.** Haz que una de esas cosas lance una excepción y mira
   qué le pasa a la petición. Si devuelve un error, el alta se está perdiendo por
   culpa de algo secundario.
3. **Pregunta qué pasa con lo que falló.** Si la respuesta es «nada», tienes un
   agujero silencioso; la clase 112 dice cómo se tapa.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 110](../110-colas-de-trabajo/README.md) — para que el consumidor no haga esperar al alta
- [Clase 112](../112-reintentos-e-idempotencia/README.md) — para que reintentar al consumidor no duplique
- [Índice de la parte 8](../README.md)

## Fuentes

- [@hohpe-woolf-eip] Hohpe, Gregor; Woolf, Bobby. *Enterprise Integration Patterns*. Addison-Wesley, 2003. ISBN 9780321200686 — <https://openlibrary.org/isbn/9780321200686>
- [@evans-ddd] Evans, Eric. *Domain-Driven Design*. Addison-Wesley, 2003. ISBN 9780321125217 — <https://openlibrary.org/isbn/9780321125217>
- [@spring-boot-docs] *Spring Boot — Documentación oficial* — <https://spring.io/projects/spring-boot>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
