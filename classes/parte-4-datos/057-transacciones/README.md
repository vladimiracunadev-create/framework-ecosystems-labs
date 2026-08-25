# Clase 057 — Transacciones

> [⬅️ 056](../056-el-problema-n-1/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [058 ➡️](../058-migraciones/README.md)
>
> Parte **4 — Datos** · Nivel **🟡 intermedio** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Agrupar operaciones para que ocurran **todas o ninguna** — y ver, en el mismo
contrato, qué pasa cuando no se hace.

## 🧩 La situación

Dos cuentas con 100 cada una. Transferir dinero de una a otra: cobrar del origen,
abonar al destino. Dos escrituras que tienen que valer como una.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Transacción**](../../../glosario/README.md#transacción) | Un grupo de operaciones que ocurren todas o ninguna. Su frontera es una decisión de diseño: demasiado estrecha deja estados a medias, demasiado ancha retiene bloqueos y conexiones. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Prisma ORM** | mapeador objeto-relacional de JavaScript/TypeScript (TypeScript) | 2021 | Apache-2.0 | proyecto independiente |
| **SQLAlchemy** | mapeador objeto-relacional de Python (Python) | 2006 | MIT | proyecto independiente |
| **Hibernate ORM** | mapeador objeto-relacional de JVM (Java) | 2001 | LGPL-2.1-or-later | proyecto independiente |
| **Entity Framework Core** | mapeador objeto-relacional de .NET (C#) | 2016 | MIT | proyecto independiente |

### 🔧 Prisma ORM

Esquema propio del que se genera un cliente tipado. Un lenguaje más que aprender, a cambio de tipos exactos.

- **Documentación oficial:** <https://www.prisma.io/docs>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `@prisma/client ^6.16.2, express ^5.1.0, prisma ^6.16.2`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
pnpm exec prisma generate
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
| `prisma/schema.prisma` | esquema de Prisma: el modelo de datos del que se genera el cliente |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 SQLAlchemy

Separa explícitamente el constructor de consultas del mapeador, de modo que se puede bajar de nivel sin abandonarlo.

- **Documentación oficial:** <https://docs.sqlalchemy.org/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `fastapi==0.121.3, uvicorn==0.40.0, sqlalchemy==2.0.44`
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

### 🔧 Hibernate ORM

El mapeador objeto-relacional de referencia en Java y el origen de buena parte del vocabulario del campo, incluido el problema de la consulta N+1.

- **Documentación oficial:** <https://hibernate.org/orm/documentation/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, spring-boot-starter-data-jpa, h2`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-057-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |
| `src/main/resources/application.properties` | configuración de Spring Boot: lo que se ajusta sin tocar el código |

### 🔧 Entity Framework Core

Mapeador con migraciones y consultas integradas en el lenguaje. El contraste con Dapper ilustra el compromiso entre abstracción y control.

- **Documentación oficial:** <https://learn.microsoft.com/ef/core/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `net10.0, Microsoft.EntityFrameworkCore.Sqlite 10.0.0`
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
| `Clase057.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro exponen **dos rutas con el mismo código dentro**: `/transferir`, que
lo envuelve en una transacción, y `/transferir-sin-transaccion`, que no.

Poder llamar a las dos con la misma petición es lo que convierte esta clase en
una medición: **mismo código, mismo error, y diez unidades evaporadas en una de
las dos**.

Y una decisión del montaje que hace visible la diferencia: **el cobro va
primero**, a propósito.

### Entity Framework Core · [`entity-framework-core/Program.cs`](implementaciones/entity-framework-core/Program.cs) — dónde está el hueco

```csharp
static async Task<Fallo?> Mover(Contexto contexto, Movimiento movimiento)
{
    var origen = await contexto.Cuentas.FindAsync(movimiento.De);
    if (origen is null) return new Fallo(404, "NO_EXISTE");
    if (origen.Saldo < movimiento.Monto) return new Fallo(409, "SALDO_INSUFICIENTE");

    // El cobro va PRIMERO, a propósito: es lo que hace visible la diferencia.
    origen.Saldo -= movimiento.Monto;
    await contexto.SaveChangesAsync();

    var destino = await contexto.Cuentas.FindAsync(movimiento.A);
    if (destino is null) return new Fallo(404, "NO_EXISTE");
```

**Los dos fallos posibles no son iguales.** `SALDO_INSUFICIENTE` se detecta
*antes* de escribir nada; `NO_EXISTE` sobre la cuenta destino se detecta *después*
de haber cobrado. **Solo el segundo necesita la transacción.**

Esa distinción es la clase entera: una transacción no protege de los errores —
protege de los errores que ocurren **a mitad**.

```csharp
    await using var transaccion = await contexto.Database.BeginTransactionAsync();
    var fallo = await Mover(contexto, movimiento);
    if (fallo is not null)
    {
        await transaccion.RollbackAsync();
```

Y una precisión que conviene tener: **EF Core ya envuelve cada `SaveChangesAsync`
en su propia transacción**. Eso es automático. Lo que no es automático es
**agrupar varios guardados**, y aquí hay dos con una lectura en medio.

El `RollbackAsync` explícito no es imprescindible —salir del `using` sin
confirmar también deshace—, y decirlo en voz alta es más honesto que confiar en
un comportamiento implícito.

### SQLAlchemy · [`sqlalchemy/main.py`](implementaciones/sqlalchemy/main.py) — `flush` frente a `commit`

```python
    # El cobro va PRIMERO, a proposito: es lo que hace visible la diferencia.
    origen.saldo -= monto
    s.flush()
```

```python
        with CrearSesion() as s, s.begin():
            mover(s, cuerpo)
```

**`flush` no es `commit`.** Envía la sentencia a la base para que la vea el resto
de la transacción, y **no confirma nada**: sigue siendo deshacible. Es la
distinción que más se confunde de SQLAlchemy.

`Session.begin()` abre la transacción explícita: al salir del bloque confirma, y
ante cualquier excepción **deshace**.

Y la versión rota cambia una sola palabra:

```python
    origen.saldo -= monto
    s.commit()  # <- aqui se pierde la garantia
```

Ese `commit` intermedio confirma el cobro **antes de saber si el abono es
posible**, y una vez confirmado ya no hay vuelta atrás. Una letra de diferencia
con la versión correcta, y diez unidades perdidas.

### Prisma · [`prisma/server.mjs`](implementaciones/prisma/server.mjs) — el detalle que lo decide todo

```javascript
    await prisma.$transaction((tx) => mover(tx, peticion.body ?? {}));
```

```javascript
    await mover(prisma, peticion.body ?? {});
```

Las dos rutas llaman a la **misma función**. La diferencia es qué cliente le
pasan: `tx` o `prisma`.

`$transaction` con una función recibe **un cliente atado a la transacción**, y ese
detalle es todo: si dentro se usara `prisma` en lugar de `tx`, las escrituras
saldrían fuera y la vuelta atrás no las alcanzaría.

Es un fallo especialmente traicionero porque **el código compila, se ejecuta y
parece transaccional**. Solo falla cuando algo falla.

### Hibernate · [`hibernate/…/Aplicacion.java`](implementaciones/hibernate/src/main/java/labs/Aplicacion.java) — la trampa más repetida

```java
        @Transactional
        public void transferir(Map<String, Object> cuerpo) {
            mover(cuerpo);
        }
```

```java
        @Transactional(propagation = Propagation.NEVER)
        public void transferirSinTransaccion(Map<String, Object> cuerpo) {
            mover(cuerpo);
        }
```

Una anotación, y el mismo cuerpo. `Propagation.NEVER` **prohíbe** que exista una
transacción envolvente, así que cada guardado se confirma por su cuenta.

Y esto es lo que hay que saber antes de usar `@Transactional` en producción:

```java
    public static class FalloDeNegocio extends RuntimeException {
```

**Spring solo deshace la transacción ante excepciones no comprobadas.** Con una
excepción comprobada —una que herede de `Exception` sin heredar de
`RuntimeException`— hace **commit** y la propaga.

Es la trampa más repetida de `@Transactional`, y produce exactamente el desastre
de esta clase: el código lanza, el desarrollador cree que deshizo, y la base
guardó la mitad. Que `FalloDeNegocio` extienda `RuntimeException` no es estilo:
es lo que hace que la transacción funcione.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /reiniciar` | `[100, 100]`, total `200` |
| `POST /transferir` 30 | `200` |
| `GET /cuentas` | `[70, 130]`, total `200` |
| `POST /transferir` 999 | `409 SALDO_INSUFICIENTE` |
| `GET /cuentas` | `[70, 130]`, total **`200`** |
| `POST /transferir` a la cuenta 99 | `404 NO_EXISTE` |
| `GET /cuentas` | `[70, 130]`, total **`200`** |
| `POST /transferir-sin-transaccion` a la cuenta 99 | `404 NO_EXISTE` |
| `GET /cuentas` | `[60, 130]`, total **`190`** |

**El último caso es la clase entera.** Mismo código, mismo error, misma respuesta
al cliente — y diez unidades que ya no existen.

## ⚠️ Los dos fallos no son iguales

El contrato provoca dos errores a propósito, y la diferencia entre ellos es lo
que explica para qué sirve una transacción:

| Fallo | Cuándo se detecta | ¿Necesita transacción? |
| --- | --- | --- |
| `SALDO_INSUFICIENTE` | **antes** de escribir nada | no |
| `NO_EXISTE` (destino) | **después** de haber cobrado | **sí** |

Un fallo que ocurre antes de la primera escritura queda bien sin ninguna ayuda:
no hay nada que deshacer. Por eso el caso del saldo insuficiente pasa igual en
las dos rutas, y **por eso es engañoso**: probar solo ese caso da la sensación de
que todo está protegido.

El fallo que importa es el que ocurre **a mitad**. Y a mitad no significa «se
deshizo el trabajo» —significa que **la mitad quedó hecha**.

## 📖 El detalle que casi siempre se escapa

Ninguna de las cuatro implementaciones «no tiene transacción» en la ruta rota.
Las cuatro tienen **dos**: una por escritura.

```python
origen.saldo -= monto
s.commit()          # <- transacción 1, confirmada
destino = s.get(Cuenta, a)
if destino is None:
    raise ...       # el abono nunca ocurre, y el cobro ya es definitivo
```

Los ORM confirman por su cuenta salvo que se les diga lo contrario, y eso es
cómodo hasta el momento en que dos escrituras dependen la una de la otra. **Lo
que la transacción añade no es «guardar»: es agrupar.**

De ahí que el arreglo se vea tan pequeño en las cuatro:

```javascript
// Prisma — `tx`, no `prisma`. Usar el cliente de fuera dejaría las escrituras
// FUERA de la transacción, y la vuelta atrás no las alcanzaría.
await prisma.$transaction((tx) => mover(tx, peticion.body));
```

```python
with CrearSesion() as s, s.begin():   # commit al salir, rollback ante excepción
    mover(s, cuerpo)
```

```java
@Transactional
public void transferir(Map<String, Object> cuerpo) { mover(cuerpo); }
```

```csharp
await using var transaccion = await contexto.Database.BeginTransactionAsync();
```

## ⚠️ La trampa de `@Transactional` en Spring

```java
public static class FalloDeNegocio extends RuntimeException { ... }
//                                        ^^^^^^^^^^^^^^^^ no es un detalle
```

**Spring solo deshace la transacción ante excepciones no comprobadas.** Ante una
excepción comprobada —una que hereda de `Exception` sin heredar de
`RuntimeException`— hace **commit** y la propaga.

El resultado es exactamente el fallo que esta clase persigue: el error llega al
cliente, parece manejado, y la mitad del trabajo quedó escrita. Se corrige con
`@Transactional(rollbackFor = ...)`, pero lo primero es saber que la regla existe.

## 🔬 Comparación

| ORM | Cómo se abre | Qué la deshace | Confirmación implícita |
| --- | --- | --- | --- |
| Prisma | `$transaction(async (tx) => …)` | cualquier excepción | por operación |
| SQLAlchemy | `Session.begin()` | cualquier excepción | al hacer `commit()` |
| Hibernate | `@Transactional` | solo excepciones **no comprobadas** | por método de repositorio |
| Entity Framework Core | `BeginTransactionAsync()` | `RollbackAsync()` o no confirmar | por `SaveChanges` |

Las tres primeras deshacen ante una excepción; **la de Spring lo hace con una
condición**, y esa condición es la fuente de casi todos los fallos reales de esta
categoría.

## 📖 Lo que una transacción no resuelve

Vale la pena decir qué queda fuera, porque es fácil pedirle de más:

- **No protege de lo que ocurre después de confirmar.** Una vez hecho el commit,
  el arreglo es una operación compensatoria, no una vuelta atrás.
- **No cruza servicios.** Si el abono lo hace otro sistema por HTTP, ninguna
  transacción de base de datos lo alcanza. Ese es el terreno de los patrones de
  compensación, y es un problema distinto y más caro.
- **No garantiza aislamiento por sí sola.** Dos transferencias a la vez sobre la
  misma cuenta pueden pisarse según el nivel de aislamiento —clase 061.
- **No hace la operación idempotente.** Reintentar una transferencia confirmada
  la ejecuta dos veces —clase 047.

## ⚠️ Errores frecuentes

- **Probar solo el fallo que ocurre antes de escribir.** Pasa sin transacción.
- **Usar el cliente de fuera dentro del bloque.** En Prisma, `prisma` en lugar de
  `tx` deja las escrituras fuera y la vuelta atrás no las alcanza.
- **Confiar en `@Transactional` con excepciones comprobadas.** Hace commit.
- **Llamar a un método `@Transactional` desde la misma clase.** La llamada no
  pasa por el proxy y la anotación no hace nada.
- **Dejar la transacción abierta durante una llamada de red.** Bloquea filas
  mientras se espera a un tercero.
- **Capturar la excepción dentro del bloque.** Sin excepción que salga, se
  confirma lo que había.

## ✅ Verificación

```bash
node scripts/run-class.mjs 057
```

## 🧪 Reto de transferencia

Cambia el orden en `mover`: comprueba que el destino existe **antes** de cobrar.
El contrato pasará entero incluso por la ruta sin transacción. Después añade una
tercera escritura al final y comprueba que vuelve a romperse. La conclusión es la
que importa: **ordenar las comprobaciones ayuda, pero no sustituye a agrupar**.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 056 — El problema N+1](../056-el-problema-n-1/README.md)
- [Clase 047 — Idempotencia](../../parte-3-validacion-y-contrato/047-idempotencia/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
