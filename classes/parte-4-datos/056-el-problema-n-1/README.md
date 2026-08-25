# Clase 056 — El problema N+1

> [⬅️ 055](../055-relaciones/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [057 ➡️](../057-transacciones/README.md)
>
> Parte **4 — Datos** · Nivel **🔴 avanzado** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Reconocer la consulta que se multiplica, y **medirla** en lugar de sospecharla.

## ⚠️ Por qué este problema es distinto a los demás

El resultado es **correcto**. Los datos son los que pediste, la respuesta tiene el
código correcto, las pruebas pasan y nadie ve un error.

Lo único que falla es **cuánto costó obtenerlo**. Con tres tareas, cuatro
consultas en lugar de dos: nadie lo nota. Con mil tareas, **mil una consultas**, y
una página que tardaba 40 milisegundos tarda cuarenta segundos.

Por eso esta clase **cuenta las consultas**. Afirmar que hay un problema N+1 sin
medirlo sería exactamente el error que la clase enseña a evitar.

## 🧩 La situación

Tres tareas con dos etiquetas cada una. Dos rutas que devuelven **exactamente los
mismos datos**, y un contador de consultas.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Problema N+1**](../../../glosario/README.md#problema-n1) | Hacer una consulta para la lista y una más por cada elemento. No se detecta con diez filas y tumba el sistema con diez mil. Se resuelve con carga anticipada, y se **mide** por el crecimiento del número de consultas, no por su valor absoluto. |
| [**Carga perezosa**](../../../glosario/README.md#carga-perezosa) *(Lazy loading)* | Traer los datos relacionados solo cuando se acceden. Cómodo, y el origen habitual del problema N+1: la consulta extra ocurre dentro de un bucle donde nadie la ve. |
| [**Carga anticipada**](../../../glosario/README.md#carga-anticipada) *(Eager loading)* | Pedir los datos relacionados en la misma consulta o en una segunda planificada. Cada ORM la resuelve a su manera —una unión o dos consultas— y las dos son correctas: lo que importa es que el número no crezca con las filas. |

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
pnpm,install,--silent,--ignore-scripts pnpm,exec,prisma,generate
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
PORT=3000 java -jar target/clase-056-1.0.0.jar --server.port=3000
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
| `Clase056.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones

Las cuatro sirven las dos rutas y **cuentan sus propias consultas** con el
mecanismo que trae su ORM —ninguna cuenta líneas del registro a ojo. El código
está en [`implementaciones/`](implementaciones/).

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /reiniciar` | contador a cero, tres tareas |
| `GET /tareas-n1` | las tres tareas con sus etiquetas |
| `GET /consultas` | **`4`** |
| `GET /reiniciar` | cero |
| `GET /tareas-anticipada` | **exactamente lo mismo** |
| `GET /crecimiento?ruta=tareas-n1` | `con_3: 4`, `con_6: 7`, **`crecimiento: 3`** |
| `GET /crecimiento?ruta=tareas-anticipada` | **`crecimiento: 0`** |

Fíjate en que los casos 2 y 5 esperan **la misma respuesta**. Esa igualdad es la
tesis de la clase: **el resultado no distingue el problema**. Solo el contador lo
hace.

### Por qué el contrato mide el crecimiento y no un número

La primera versión de este contrato exigía **exactamente 2 consultas** a la forma
anticipada. Y estaba mal: Hibernate y EF Core la resuelven con **una** consulta
—una unión— mientras que SQLAlchemy y Prisma usan **dos**. Las cuatro son
correctas.

El contrato no describía un fallo de esos frameworks: describía una creencia
equivocada de quien lo escribió. Por eso ahora mide lo único que sí distingue el
problema, y que no depende de la estrategia:

| Tareas | Ingenua | Anticipada |
| --- | --- | --- |
| 3 | 4 | 1 o 2 |
| 6 | 7 | **las mismas** |
| 1000 | **1001** | **las mismas** |

`/crecimiento` ejecuta la misma ruta con tres tareas y con seis, y resta. Tres
para la ingenua; **cero** para la anticipada, sea cual sea su estrategia.

## 🌐 Cómo aparece, y por qué no se ve

```python
# SQLAlchemy — el bucle PARECE que solo lee memoria
tareas = s.scalars(select(Tarea)).all()
[{"etiquetas": [e.nombre for e in t.etiquetas]} for t in tareas]
#                              ^^^^^^^^^^^^ una consulta, aquí, por cada tarea
```

**Nada en ese código insinúa que haya consultas.** `t.etiquetas` se lee como el
acceso a una lista en memoria, y dispara una consulta a la base cada vez.

Es la razón de que el problema sea tan frecuente: la carga perezosa hace el código
cómodo de escribir **borrando la señal de que hay entrada/salida**.

En Prisma y EF Core no puede pasar así —no cargan solos— y a cambio el patrón
aparece con otra cara: un bucle que consulta explícitamente por elemento, que es
lo que hacen esas dos implementaciones para reproducirlo.

## 🌐 Cómo se arregla

```python
# SQLAlchemy — dos consultas, sea cual sea el número de tareas
select(Tarea).options(selectinload(Tarea.etiquetas))
```

```java
// Hibernate — el grafo declara qué traer de una vez
@EntityGraph(attributePaths = "etiquetas")
List<Tarea> findAllWithEtiquetasBy();
```

```csharp
// EF Core
contexto.Tareas.Include(t => t.Etiquetas)
```

```javascript
// Prisma
prisma.tarea.findMany({ include: { etiquetas: true } })
```

**Los cuatro dicen lo mismo: «tráete también las etiquetas».** Una línea.

## 📖 Las dos estrategias de carga anticipada

No todas hacen lo mismo por debajo, y la diferencia importa:

| Estrategia | Consultas | Quién la usa aquí | Problema |
| --- | --- | --- | --- |
| **Unión** (`JOIN`) | 1 | Hibernate (`@EntityGraph`), EF Core (`Include`) | duplica las filas del padre: una tarea con 10 etiquetas viene 10 veces |
| **Segunda consulta** (`WHERE id IN ...`) | 2 | SQLAlchemy (`selectinload`), Prisma (`include`) | ninguno relevante |

Con varias relaciones a la vez, la unión multiplica: 10 etiquetas × 5 comentarios
son **50 filas** para una sola tarea. Es el producto cartesiano, y convierte la
solución en un problema peor que el original.

Los dos que usan unión saben cambiar:

```csharp
contexto.Tareas.Include(t => t.Etiquetas).AsSplitQuery()   // EF Core: pasa a dos
```

```python
select(Tarea).options(joinedload(Tarea.etiquetas))          # SQLAlchemy: pasa a una
```

La regla práctica: **una relación, unión; varias relaciones a la vez, segunda
consulta**. Y en ninguno de los dos casos el número crece con las filas, que es
lo que esta clase mide.

## 🔬 Comparación

| ORM | Carga por omisión | Fallo al olvidarlo | Estrategia anticipada | Cómo cuenta consultas |
| --- | --- | --- | --- | --- |
| Prisma | ninguna | relación ausente | segunda consulta | evento `query` del cliente |
| Entity Framework Core | ninguna | relación ausente | **unión** | interceptor de comandos |
| SQLAlchemy | perezosa | una consulta por fila | segunda consulta | evento `before_cursor_execute` |
| Hibernate | perezosa | una consulta por fila —o excepción fuera de la sesión | **unión** | `getPrepareStatementCount()` |

Las cuatro filas dicen lo mismo desde ángulos distintos: **el problema no está en
el ORM, está en no mirar**. Y las cuatro traen con qué mirar.

## 🔍 Cómo detectarlo antes de producción

El contador de esta clase no es un truco del laboratorio: es el mecanismo nativo
de cada ORM, el de la última columna de la tabla de arriba. Con él se puede escribir una prueba que **falle si una ruta pasa de N consultas**.
Es lo más eficaz que existe contra este problema, porque lo convierte en un fallo
de compilación en lugar de un informe de lentitud seis meses después.

## ⚠️ Errores frecuentes

- **Suponer que no hay N+1 porque las pruebas pasan.** Pasan siempre.
- **Cargar todo anticipadamente «por si acaso».** Traer relaciones que no usas
  cuesta memoria y ancho de banda.
- **Usar unión con varias relaciones.** Producto cartesiano.
- **Arreglar el N+1 con caché.** Tapa el síntoma y añade invalidación —clase 062.
- **Mirar solo el tiempo total.** Cien consultas de 1 ms parecen aceptables en
  local y son inaceptables con 20 ms de latencia de red.
- **Fijar un número de consultas en la prueba.** Depende de la estrategia del
  ORM y cambia entre versiones. Lo que hay que fijar es que **no crezca**.
- **No mirar el SQL que genera el ORM.** Es la única forma de saber qué hace.

## ✅ Verificación

```bash
node scripts/run-class.mjs 056
```

## 🧪 Reto de transferencia

Sube la semilla a 100 tareas y vuelve a ejecutar. La ruta anticipada seguirá
donde estaba —una consulta o dos, según el ORM—; la ingenua estará en **101**. Después mide el tiempo de las dos
y observa que la diferencia crece más rápido de lo que sugiere el número, porque
cada consulta paga la latencia de ida y vuelta.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 055 — Relaciones](../055-relaciones/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@gregg-systems-performance] Gregg, Brendan. *Systems Performance*, 2.ª ed. Addison-Wesley, 2020. ISBN 9780136820154 — <https://openlibrary.org/isbn/9780136820154>
