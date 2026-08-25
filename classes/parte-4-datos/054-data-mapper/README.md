# Clase 054 — Data Mapper

> [⬅️ 053](../053-active-record/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [055 ➡️](../055-relaciones/README.md)
>
> Parte **4 — Datos** · Nivel **🟡 intermedio** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Separar el dominio del almacenamiento: escribir reglas de negocio en una clase
que **no sabe que existe una base de datos**.

## 🧩 La situación

Exactamente la misma que la clase 053. **El mismo contrato, caso por caso.**

Esa igualdad es el argumento: si el comportamiento observable no cambia, la
elección entre los dos patrones no es sobre qué hace el sistema, sino sobre
**cómo se sostiene mientras crece**.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Data Mapper**](../../../glosario/README.md#data-mapper) | El patrón en que el objeto de dominio **no sabe nada** del almacenamiento y una pieza aparte lo traduce. Más ceremonia, y el dominio se puede instanciar y probar sin base de datos. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Hibernate ORM** | mapeador objeto-relacional de JVM (Java) | 2001 | LGPL-2.1-or-later | proyecto independiente |
| **SQLAlchemy** | mapeador objeto-relacional de Python (Python) | 2006 | MIT | proyecto independiente |
| **Entity Framework Core** | mapeador objeto-relacional de .NET (C#) | 2016 | MIT | proyecto independiente |
| **TypeORM** | mapeador objeto-relacional de JavaScript/TypeScript (TypeScript) | 2016 | MIT | proyecto independiente |

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
PORT=3000 java -jar target/clase-054-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |
| `src/main/resources/application.properties` | configuración de Spring Boot: lo que se ajusta sin tocar el código |

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
| `dominio.py` | código Python |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `main.py` | código Python |
| `requirements.txt` | dependencias de Python, una por línea, con versión fijada |

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
| `Clase054.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

### 🔧 TypeORM

Ofrece a la vez registro activo y mapeador de datos, lo que lo hace útil para comparar ambos patrones en un mismo proyecto.

- **Documentación oficial:** <https://typeorm.io/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `express ^5.1.0, reflect-metadata ^0.2.2, sql.js ^1.13.0, typeorm ^1.1.0`
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
| `dominio.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones

[Hibernate](implementaciones/hibernate/), [SQLAlchemy con mapeo imperativo](implementaciones/sqlalchemy/),
[Entity Framework Core](implementaciones/entity-framework-core/) y
[TypeORM en modo Data Mapper](implementaciones/typeorm/).

**TypeORM aparece en las dos clases**, y es la comparación más limpia que hay:
misma biblioteca, mismo contrato, y la diferencia se reduce a una línea.

```javascript
class Tarea extends BaseEntity { }   // 053: la entidad sabe guardarse
class Tarea { }                       // 054: no
```

## 🧮 El contrato

Idéntico al de la [clase 053](../053-active-record/contrato.json). Ver allí la
tabla.

## 📖 Qué es Data Mapper

Fowler otra vez: **una capa que mueve datos entre los objetos y la base de datos,
manteniéndolos independientes entre sí y del propio mapeador**
[@fowler-poeaa].

La palabra que hace el trabajo es **independientes**. El objeto de dominio no
tiene métodos de persistencia, no hereda de una clase base del ORM y no sabe de
qué tabla salió.

Mira el archivo [`dominio.py`](implementaciones/sqlalchemy/dominio.py) de la
implementación de SQLAlchemy: **no importa SQLAlchemy**. Es Python puro, se
puede instanciar en una prueba, y la regla del título vive ahí.

Y el mapeo está fuera, en una sola línea:

```python
mapeador.map_imperatively(Tarea, tabla_tareas)
```

Esa línea de `main.py` es **la única** que une el dominio con el almacenamiento.

Eso es mapeo imperativo, y es la forma más pura del patrón que existe en un ORM
de uso corriente.

## ⚠️ Cuánta separación consigue cada uno

Conviene ser exacto, porque «dominio limpio» se dice más de lo que se cumple:

| ORM | ¿La clase menciona el ORM? | Dónde vive el mapeo |
| --- | --- | --- |
| SQLAlchemy imperativo | **no, en absoluto** | en otro archivo |
| Entity Framework Core | **no** | en `OnModelCreating` |
| TypeORM con `EntitySchema` | **no** | en el esquema |
| Hibernate | **sí: las anotaciones** | en la propia clase |

**Hibernate es el caso honesto que hay que mirar.** La entidad no tiene
`guardar()` ni `buscar()` —eso sí lo separa—, pero lleva `@Entity`, `@Table` y
`@Column` encima. La separación de JPA es **de comportamiento, no de metadatos**.

Existe `orm.xml` para quitar también las anotaciones, y casi nadie lo usa: el
coste de mantener el mapeo en XML supera lo que se gana. Es una decisión
razonable, y conviene saber que se está tomando.

## 📖 Lo que el mapeador exige de tu dominio

Un descubrimiento de esta clase, encontrado al escribirla:

```javascript
// Esto rompe TypeORM al leer una fila
constructor(titulo) { if (!titulo) throw new TituloRequerido(); }
```

**El mapeador construye el objeto vacío y después le pone los campos.** Si el
constructor exige un título, esa construcción falla y no se puede leer nada.

Es la razón de que Hibernate y EF Core pidan un constructor sin argumentos, y de
que las reglas vayan en una **fábrica**:

```javascript
static crear(titulo) { const t = new Tarea(); t.renombrar(titulo); return t; }
```

Curiosamente, SQLAlchemy **no** impone esto: al cargar una fila salta el
`__init__` por completo, así que un constructor que valida sigue funcionando. Por
eso su implementación en esta clase valida en el constructor y las otras tres en
una fábrica — la diferencia es real y está a la vista.

## 📖 Qué se gana de verdad

**Probar sin base de datos.** La regla del título se comprueba instanciando un
objeto. Sin motor, sin transacción, sin limpiar tablas entre pruebas. Es el
argumento más fuerte, y es la clase 065.

**Cambiar el almacenamiento sin tocar el dominio.** La interfaz del repositorio
en la implementación de EF Core no menciona EF Core; detrás podría haber otra
base o un doble en memoria.

**Un modelo que refleja el negocio, no las tablas.** Un concepto puede vivir en
tres tablas o tres conceptos en una. Sin la restricción de *una clase, una
tabla*, el modelo puede parecerse al problema en lugar de al esquema
[@evans-ddd].

## ⚠️ Qué cuesta

**Más piezas.** Entidad, repositorio, mapeo, y a menudo un objeto de
transferencia. Para un CRUD de cuatro campos es burocracia pura.

**Un ciclo de vida que hay que entender.** Sesión, contexto, seguimiento de
cambios, objetos adjuntos y separados. En Active Record eso no existe.

**La tentación de fingir.** Un «repositorio» que solo reenvía llamadas al ORM y
una entidad con las mismas columnas que la tabla dan todo el coste del patrón sin
ninguna de sus ventajas. Si el dominio no tiene reglas propias, **Active Record
es la respuesta correcta**.

## 🔬 Comparación

| ORM | Cómo se guarda | Dónde está el mapeo | Constructor vacío |
| --- | --- | --- | --- |
| SQLAlchemy | `sesion.add(tarea)` | `map_imperatively`, aparte | **no hace falta** |
| Hibernate | `repositorio.save(tarea)` | anotaciones en la clase | obligatorio |
| EF Core | `contexto.Add` + `SaveChanges` | `OnModelCreating` | obligatorio |
| TypeORM | `repositorio.save(tarea)` | `EntitySchema`, aparte | obligatorio |

## ⚠️ Errores frecuentes

- **Validar en el constructor** con un ORM que construye vacío.
- **Un repositorio que devuelve consultas del ORM.** Filtra el detalle que
  querías esconder, y el dominio acaba dependiendo de él igual.
- **Usar la entidad como cuerpo de la respuesta.** Ata el contrato público al
  modelo interno — clase 050.
- **Adoptar el patrón para un CRUD.** Coste sin beneficio.
- **Creer que un dominio limpio se consigue con anotaciones.** JPA separa el
  comportamiento, no los metadatos.
- **Perder de vista el ciclo de vida de la sesión.** Es la clase 051.

## ✅ Verificación

```bash
node scripts/run-class.mjs 054
```

## 🧪 Reto de transferencia

Escribe una prueba de la regla del título **sin arrancar el servidor ni tocar la
base**: importa `dominio.py`, crea una tarea con título vacío y comprueba que
lanza. Después intenta lo mismo con cualquiera de las implementaciones de la
clase 053. Esa dificultad —no la elegancia— es el argumento entero de esta clase.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 053 — Active Record](../053-active-record/README.md) — el mismo contrato, el patrón opuesto
- [Clase 064 — Repositorio y dominio](../064-repositorio-y-dominio/README.md)
- [Clase 065 — Probar sin base de datos](../065-probar-sin-base-de-datos/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@evans-ddd] Evans, Eric. *Domain-Driven Design*. Addison-Wesley, 2003. ISBN 9780321125217 — <https://openlibrary.org/isbn/9780321125217>
- [@martin-clean-architecture] Martin, Robert C. *Clean Architecture*. Prentice Hall, 2017. ISBN 9780134494166 — <https://openlibrary.org/isbn/9780134494166>
