# Clase 045 — Paginación

> [⬅️ 044](../044-versionado-de-api/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [046 ➡️](../046-filtrado-y-ordenacion/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Devolver muchos elementos **sin devolverlos todos**, y entender por qué la forma
fácil de hacerlo falla justo cuando más datos hay.

## 🧩 La situación

25 tareas con identificador ordenado. Dos rutas: una pagina por
**desplazamiento** y la otra por **cursor**.

## 📖 Las dos formas

### Por desplazamiento

```text
GET /tareas?desde=10&limite=2
```

«Sáltate 10, dame 2.» Es lo primero que se le ocurre a cualquiera, se traduce
directo a SQL y permite saltar a la página 47 sin pasar por las anteriores.

**Tiene dos problemas que solo aparecen con datos reales:**

**1. La página se desplaza.** Si alguien inserta un elemento mientras paginas,
todo se corre una posición: el último elemento de la página 1 aparece otra vez
como primero de la página 2. Con un borrado, un elemento **desaparece sin que lo
hayas visto**.

**2. El coste crece con la profundidad.** Para dar la página 1000, la base tiene
que **contar y descartar** los 20 000 elementos anteriores. La página 1 es
instantánea y la 1000 tarda segundos.

### Por cursor

```text
GET /tareas-cursor?limite=3&cursor=003
```

«Dame los 3 que vienen **después de este**.» El cursor apunta al último elemento
devuelto.

- **Insertar no desplaza nada**: la pregunta es «después de 003», no «a partir de
  la posición 10».
- **El coste no crece**: con un índice, «los siguientes después de 003» es igual
  de rápido en la página 1 que en la 1000.

**Lo que se pierde:** no puedes saltar a la página 47, y el total es caro de
calcular. Por eso el contrato devuelve `total` en la paginación por
desplazamiento y no en la de cursor — no es un descuido, es la diferencia.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /tareas` | primera página y `total: 25` |
| `?desde=10&limite=2` | elementos `011` y `012` |
| `?limite=1000` | **`422`** · `LIMITE_INVALIDO` |
| `/tareas-cursor?limite=3` | `001`,`002`,`003` y `siguiente: "003"` |
| `?limite=3&cursor=003` | `004`,`005`,`006` — sin solaparse |
| `?limite=3&cursor=022` | `siguiente: null` |
| `?cursor=999` | `422` · `CURSOR_INVALIDO` |

**El tercer caso es de seguridad**, no de comodidad. Sin tope, `?limite=1000000`
es una petición que carga la tabla entera en memoria — y hacerla cuesta un
segundo a quien la envía.

Y el sexto: **`siguiente: null` explícito** cuando no hay más. El cliente sabe
que terminó sin tener que comparar tamaños ni hacer una petición de más.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Paginación**](../../../glosario/README.md#paginación) | Devolver los resultados por tramos en lugar de todos. Por desplazamiento es fácil y se desordena cuando alguien inserta mientras paginas; por cursor es estable y no permite saltar a la página 37. |

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
- **Versión que ejecuta esta clase:** `fastapi==0.121.3, uvicorn==0.40.0`
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
PORT=3000 java -jar target/clase-045-1.0.0.jar --server.port=3000
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
| `Clase045.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones

```python
# FastAPI — el rango en la firma. El máximo NO es opcional.
def listar(
    desde: int = Query(default=0, ge=0),
    limite: int = Query(default=10, ge=1, le=50),
) -> JSONResponse:
```

Una línea por parámetro, con su valor por omisión y su rango. FastAPI rechaza por
su cuenta lo que se salga — y la implementación traduce su error al código del
contrato, porque **el código estable lo decide la API, no la biblioteca de
validación**.

```javascript
// Express — el cursor busca la posición del identificador
const inicio = cursor === undefined ? 0 : TAREAS.findIndex((t) => t.id === cursor) + 1;
```

Sobre un array es una búsqueda lineal; sobre una tabla con índice es
`WHERE id > ? ORDER BY id LIMIT ?`, que es la razón de que el cursor escale.

## 🔬 Comparación

| | Desplazamiento | Cursor |
| --- | --- | --- |
| Saltar a la página N | **sí** | no |
| Total conocido | **sí** | caro |
| Estable con inserciones | **no** | **sí** |
| Coste en profundidad | crece | constante |
| Complejidad | mínima | media |

**Ninguna gana siempre.** La pregunta que decide:

- **Interfaz con números de página y pocos datos** → desplazamiento.
- **Desplazamiento infinito, exportación, sincronización, muchos datos** →
  cursor.

Kleppmann sitúa esta diferencia en el mismo marco que otras decisiones de
acceso a datos: **lo que funciona con mil filas y lo que funciona con diez
millones no son lo mismo**, y el desajuste aparece tarde
[@kleppmann-ddia].

## 🔒 Y el cursor opaco

Este cursor es el identificador visible: `cursor=003`. Es simple y **filtra
información** — que los identificadores son secuenciales, cuántos hay, y permite
adivinar identificadores ajenos.

En una API pública conviene codificarlo, no por seguridad por oscuridad, sino
por dos razones prácticas:

1. **Puedes cambiar su significado** —de identificador a fecha+identificador—
   sin romper a nadie, porque el cliente lo trata como opaco.
2. **Puedes firmarlo** para que nadie fabrique uno que salte a datos que no le
   corresponden.

## ⚠️ Errores frecuentes

- **Sin límite máximo.** `?limite=1000000` como vía de agotamiento.
- **Sin límite por omisión.** «Sin parámetros» acaba devolviendo la tabla.
- **Paginar sin ordenar.** Sin un orden estable, las páginas se solapan y se
  saltan elementos aunque nadie escriba.
- **Ordenar por un campo no único.** Dos filas iguales rompen el cursor: hay que
  desempatar con el identificador.
- **Devolver el total en cursor.** Es la operación cara que el cursor evitaba.
- **Cursor transparente en API pública.**

## ✅ Verificación

```bash
node scripts/run-class.mjs 045
```

## 🧪 Reto de transferencia

Haz que el cursor ordene por `prioridad` en lugar de por identificador y
comprueba que **se rompe**: hay prioridades repetidas y el cursor no sabe por
cuál seguir. Después arréglalo con un cursor compuesto —prioridad más
identificador—. Es el problema real de la paginación por cursor y su solución
estándar.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 046 — Filtrado y ordenación](../046-filtrado-y-ordenacion/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@geewax-api-design-patterns] Geewax, JJ. *API Design Patterns*. Manning, 2021. ISBN 9781617295850 — <https://openlibrary.org/isbn/9781617295850>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
