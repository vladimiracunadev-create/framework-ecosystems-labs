# Clase 046 — Filtrado y ordenación

> [⬅️ 045](../045-paginacion/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [047 ➡️](../047-idempotencia/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Aceptar criterios del cliente **sin abrir un agujero**. Es la clase donde una
comodidad —«deja que el cliente ordene por lo que quiera»— se convierte en un
problema de seguridad si se implementa como parece natural.

## 🧩 La situación

`GET /tareas?completada=true&orden=-prioridad` filtra y ordena. Un campo que no
esté en la **lista blanca** responde 422.

## 🔒 La lista blanca no es una precaución: es el mecanismo

La forma «natural» de implementar esto es tomar el nombre del campo que envía el
cliente y usarlo:

```javascript
// NO HAGAS ESTO
resultado.sort((a, b) => a[campo] > b[campo] ? 1 : -1);
consulta += ` ORDER BY ${campo}`;   // y esto, menos todavía
```

Tres problemas, de menor a mayor gravedad:

**1. Ordenar por un campo interno.** `?orden=hash_contrasena` no expone el valor,
y **expone el orden**: comparando resultados se puede deducir información del
campo. Es una fuga por canal lateral.

**2. Filtrar por un campo que no debería ser filtrable.** `?rol=admin` sobre una
tabla de usuarios convierte una lista pública en un directorio de
administradores.

**3. Inyección.** Si el nombre del campo acaba concatenado en una consulta, el
cliente escribe SQL. Es el vector clásico, y OWASP lo mantiene entre los riesgos
principales precisamente porque sigue apareciendo [@owasp-top10].

**La lista blanca resuelve los tres a la vez**, y por eso las cuatro
implementaciones la tienen antes que cualquier otra cosa:

```javascript
const CAMPOS_ORDENABLES = new Set(["titulo", "prioridad"]);
const CAMPOS_FILTRABLES = new Set(["completada", "prioridad"]);
```

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Filtrado**](../../../glosario/README.md#filtrado) | Acotar una lista por criterios que llegan del cliente. El riesgo no es la sintaxis: es aceptar como campo de ordenación cualquier texto que llegue, que es una inyección con otro nombre. |

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
PORT=3000 java -jar target/clase-046-1.0.0.jar --server.port=3000
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
| `Clase046.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones

Las cuatro declaran la lista blanca **antes que ninguna otra cosa**, y las cuatro
la traducen a algo que tú escribiste. El código está en
[`implementaciones/`](implementaciones/).

## 📖 Y el paso que casi nadie da

Tener la lista blanca no basta si después usas el texto del cliente. Fíjate en
cómo la traducen Spring y ASP.NET:

```java
// La lista blanca se traduce a un comparador CONOCIDO
Comparator<Tarea> comparador = "titulo".equals(campo)
        ? Comparator.comparing(Tarea::titulo)
        : Comparator.comparingInt(Tarea::prioridad);
```

```csharp
Func<Tarea, object> clave = campo == "titulo" ? t => t.Titulo : t => t.Prioridad;
```

**El texto del cliente nunca llega a la consulta.** Solo decide qué comparador
—de los que tú escribiste— se usa. Con un ORM, lo equivalente es traducir a una
expresión construida por ti, no interpolar el nombre.

Es la diferencia entre validar la entrada y **no usar la entrada**, y la segunda
es estructuralmente más segura.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /tareas` | los tres |
| `?completada=true` | solo el `2` |
| `?orden=titulo` | alfa, beta, gamma |
| `?orden=-prioridad` | 3, 2, 1 |
| `?orden=id` | **`422`** · `CAMPO_NO_ORDENABLE` |
| `?titulo=alfa` | **`422`** · `CAMPO_NO_FILTRABLE` |
| `?completada=quizas` | `422` · `VALOR_INVALIDO` |

**El quinto caso es el importante.** `id` existe en el objeto y **no está en la
lista blanca**: se rechaza. Un filtro que solo comprobara «¿existe este campo?»
lo aceptaría.

## 🧭 El prefijo `-` para descendente

```text
?orden=titulo     ascendente
?orden=-titulo    descendente
```

Es una convención extendida y suficiente. Las alternativas —`orden=titulo&dir=desc`,
`sort=titulo:desc`— funcionan igual; lo que importa es **elegir una y
documentarla**, porque el cliente no la puede adivinar.

Y cuando hagan falta varios criterios, `?orden=-prioridad,titulo` se lee bien y
se analiza fácil. Geewax recomienda esa forma por ser la que menos ensucia la
cadena de consulta [@geewax-api-design-patterns].

## 🔬 Comparación

| Framework | Cómo traduce la lista blanca | ¿Puede el texto del cliente llegar a la consulta? |
| --- | --- | --- |
| Spring Boot | a un `Comparator` tipado | **no** |
| ASP.NET Core | a un selector tipado | **no** |
| FastAPI | a una clave de ordenación | solo si lo escribes mal |
| Express | a un índice del objeto | **sí**, si olvidas la lista |

Los dos primeros hacen incómodo lo inseguro. En los dos últimos, `a[campo]` es
una línea que funciona y parece razonable — y ahí la lista blanca no es una
precaución añadida: **es la única defensa**.

## ⚠️ Errores frecuentes

- **Interpolar el nombre del campo en la consulta.** Inyección directa.
- **Aceptar cualquier campo que exista en el objeto.** Fuga de campos internos.
- **Filtrar en memoria lo que debería filtrar la base.** Funciona con 3 filas y
  con 3 millones agota la memoria.
- **No validar el valor.** El campo está permitido; el valor puede no serlo.
- **Filtros sin índice.** Correcto y lentísimo — clase 056.
- **No documentar qué campos se admiten.** El cliente prueba a ciegas.

## ✅ Verificación

```bash
node scripts/run-class.mjs 046
```

## 🧪 Reto de transferencia

Añade `?titulo_contiene=al` como filtro de texto parcial. Después responde: ¿qué
pasa si el cliente envía `%`, `_` o una expresión regular? Es la misma pregunta
de la lista blanca aplicada al **valor** en lugar de al campo, y tiene la misma
respuesta: escapar o rechazar, nunca interpolar.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 074 — Inyección SQL](../../parte-5-identidad-y-seguridad/074-inyeccion-sql/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@owasp-top10] *OWASP Top 10*, OWASP Foundation — <https://owasp.org/www-project-top-ten/>
- [@geewax-api-design-patterns] Geewax, JJ. *API Design Patterns*. Manning, 2021. ISBN 9781617295850 — <https://openlibrary.org/isbn/9781617295850>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
