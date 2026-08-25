# Clase 063 — Bases no relacionales

> [⬅️ 062](../062-cache-de-lectura/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [064 ➡️](../064-repositorio-y-dominio/README.md)
>
> Parte **4 — Datos** · Nivel **🟡 intermedio** · Pista **`datos`**
>
> ✅ **Clase construida** — 3 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Modelar el mismo caso **sin tablas** y ver qué cambia — lo que se gana, y lo que
se paga.

## ⚠️ Lo que esta clase NO es

Aquí no hay MongoDB ni Cassandra. El documento se guarda en una **columna de
texto** de SQLite o de H2, y las tres implementaciones lo tratan como un
documento: se escribe entero, se lee entero y se busca dentro de él.

Eso permite enseñar lo que de verdad decide el modelado —**incrustar o
referenciar**, y el esquema mudándose de la base al código— sin montar un
servidor.

Y deja fuera cosas que una base documental de verdad sí trae, y que conviene no
suponer:

- **Índices dentro del documento.** Mongo indexa un campo anidado; aquí una
  búsqueda recorre.
- **Reparto entre máquinas.** La clave de partición es la decisión de diseño más
  cara de un sistema documental, y aquí no existe.
- **Consistencia eventual.** Con réplicas, una lectura puede no ver la escritura
  que acaba de ocurrir. Aquí siempre la ve.
- **Atomicidad más allá del documento.** Es real en Mongo y aquí también, pero
  por motivos distintos.

Decirlo es parte del trato: **un verde aquí significa lo que se probó.**

## 🧩 La situación

Una tarea con sus etiquetas y su autor dentro. Un segundo documento **con otra
forma**. Y un cambio en el autor.

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Prisma ORM** | mapeador objeto-relacional de JavaScript/TypeScript (TypeScript) | 2021 | Apache-2.0 | proyecto independiente |
| **SQLAlchemy** | mapeador objeto-relacional de Python (Python) | 2006 | MIT | proyecto independiente |
| **Hibernate ORM** | mapeador objeto-relacional de JVM (Java) | 2001 | LGPL-2.1-or-later | proyecto independiente |

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
PORT=3000 java -jar target/clase-063-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |
| `src/main/resources/application.properties` | configuración de Spring Boot: lo que se ajusta sin tocar el código |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones

[Prisma](implementaciones/prisma/), [SQLAlchemy](implementaciones/sqlalchemy/) e
[Hibernate](implementaciones/hibernate/). Las tres declaran la misma tabla:

```prisma
model Documento {
  id        Int    @id @default(autoincrement())
  documento String
}
```

**Ese es todo el esquema.** Ni `titulo`, ni `etiquetas`, ni `autor`.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `POST /tareas` con etiquetas y autor | `201` |
| `GET /tareas/1` | **todo entero**, anidado |
| `GET /consultas` | **`1`** |
| `POST /tareas` con **otra forma** | `201` |
| `GET /tareas/2` | los campos que tenía |
| `GET /esquema` | `["documento", "id"]`, `campos_declarados: 0` |
| `GET /por-etiqueta?nombre=casa` | `[1]` |
| `GET /por-etiqueta?nombre=oficina` | `[]` |
| `POST /renombrar-autor` | **`documentos_tocados: 2`** |
| `GET /tareas/2` | el nombre nuevo |

## 📖 Lo que se gana: una lectura

En la [clase 055](../055-relaciones/README.md) esta misma tarea vivía en dos
tablas y leerla costaba una unión. Con un autor sería una tercera.

Aquí es **una consulta por clave primaria**, y devuelve el árbol entero. No hay
unión porque no hay nada que unir: lo que se lee junto está guardado junto.

Esa es la propuesta entera del modelo documental, y es una propuesta buena
cuando **la unidad de lectura y la unidad de escritura coinciden**.

## 📖 Lo que se paga: la duplicación

```javascript
POST /renombrar-autor  →  { documentos_tocados: 2 }
```

El autor está incrustado en cada tarea. Cambiarle el nombre no es un `UPDATE`
sobre una fila: es recorrer **todas** las tareas que lo llevan dentro.

Con dos documentos es anecdótico. Con dos millones, es un trabajo por lotes que
tarda y que puede quedarse a medias — porque, además, **no hay una transacción
que cubra todos los documentos**: la atomicidad de una base documental llega
hasta el borde del documento.

Ese es el equilibrio de esta clase, y se resume en una pregunta:

> **¿Este dato lo lees siempre con su padre, o también por su cuenta?**

- **Siempre con su padre** → incrústalo. Las etiquetas de una tarea.
- **También por su cuenta, y cambia** → refiérelo. El autor.

El ejemplo incrusta el autor **a propósito**, para que el último caso del
contrato muestre la factura.

## 📖 El esquema no desaparece: se muda

`campos_declarados: 0` no significa que no haya esquema. Los dos documentos
tienen forma, el código la espera, y una respuesta sin `titulo` rompería al
cliente igual que antes.

Lo que cambia es **quién lo hace cumplir**:

| | Relacional | Documental |
| --- | --- | --- |
| Dónde está | en la base | en el código |
| Quién lo aplica | el motor, en cada escritura | tú, al leer |
| Cambiar un campo | una migración (clase 058) | nada… y todo |
| Documentos viejos | no existen: la migración los tocó | **siguen ahí, con la forma vieja** |

La última fila es la consecuencia práctica que más sorprende. Añadir un campo es
gratis; **leer** pasa a serlo menos, porque hay que contar con documentos escritos
por versiones anteriores del código. Se llama *esquema en la lectura*, y significa
que el código de lectura acumula compatibilidad hacia atrás durante años
[@kleppmann-ddia].

No es mejor ni peor que una migración. Es la misma deuda, pagada en otro sitio y
a plazos.

## 🔬 Comparación

| | Prisma | SQLAlchemy | Hibernate |
| --- | --- | --- | --- |
| Cómo se declara | `String` en el esquema | tipo `JSON` de SQLAlchemy | `@Lob String` |
| Serializar | a mano, `JSON.stringify` | lo hace el ORM | a mano, con Jackson |
| Buscar dentro | `json_each` de SQLite | `json_each` de SQLite | **recorriendo en memoria** |
| Trampa propia | ninguna | no detecta cambios dentro del diccionario | ninguna |

La fila que importa es la tercera, y merece su propia sección.

## 🔬 Buscar dentro del documento: aquí no empatan

```sql
-- SQLite: json_each convierte el array del documento en filas
SELECT DISTINCT d.id FROM Documento d, json_each(d.documento, '$.etiquetas') e
 WHERE e.value = ?
```

```java
// H2: no hay equivalente. Se traen TODOS y se filtran en memoria.
for (Doc fila : documentos.findAll()) { ... }
```

**La misma clase, y una implementación escala y la otra no.** No es un descuido
del ejemplo: es lo que pasa cuando el motor no sabe mirar dentro de la columna.

Y explica por qué la elección aquí no es «relacional o documental», sino **qué
motor**: PostgreSQL con `jsonb` indexa campos anidados y compite de tú a tú con
una base documental; SQLite sabe recorrer pero no indexar dentro; H2 ni eso.

## ⚠️ Errores frecuentes

- **Incrustar lo que cambia por su cuenta.** El caso del autor.
- **Suponer que sin esquema no hay contrato.** Lo hay, y no lo protege nadie.
- **Filtrar en memoria porque el motor no sabe mirar dentro.** Es la clase 060.
- **Esperar transacciones entre documentos.** Llegan hasta el borde de uno.
- **Documentos que crecen sin límite.** Un array que se llena para siempre acaba
  siendo un documento de megas que se lee entero cada vez.
- **En SQLAlchemy, modificar el diccionario en su sitio.** Sin `MutableDict` el
  ORM no detecta el cambio y no lo guarda. En silencio.
- **Elegir documental para evitar migraciones.** Las migraciones no
  desaparecen: se convierten en `if` en el código de lectura.

## ✅ Verificación

```bash
node scripts/run-class.mjs 063
```

## 🧪 Reto de transferencia

Cambia el modelo para que el autor esté **referenciado** —un documento aparte y
su identificador dentro de la tarea— y vuelve a ejecutar. `renombrar-autor` pasará
a tocar **un** documento, y leer una tarea pasará a costar **dos** consultas. Has
recreado el modelo relacional, sin tablas y a mano: esa es la lección.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 055 — Relaciones](../055-relaciones/README.md)
- [Clase 058 — Migraciones](../058-migraciones/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@evans-ddd] Evans, Eric. *Domain-Driven Design*. Addison-Wesley, 2003. ISBN 9780321125217 — <https://openlibrary.org/isbn/9780321125217>
