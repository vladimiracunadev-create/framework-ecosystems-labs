# Clase 048 — ETags y caché condicional

> [⬅️ 047](../047-idempotencia/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [049 ➡️](../049-el-contrato-como-prueba/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🔴 avanzado** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Usar una **etiqueta de versión** para dos cosas distintas: ahorrar ancho de banda
al leer, y **evitar sobrescrituras ciegas** al escribir. La segunda es la
importante y la que casi nadie implementa.

## 📖 Una etiqueta, dos usos

Una `ETag` identifica una **versión** del recurso. Cambia cuando cambia el
contenido, y con eso bastan dos mecanismos:

| Cabecera | Pregunta | Si coincide |
| --- | --- | --- |
| `If-None-Match` | «¿sigue siendo esta versión?» | **304**, sin cuerpo |
| `If-Match` | «solo escribe si sigue siendo esta» | procede |

## ⚠️ El segundo uso: la actualización perdida

Sin `If-Match`, esto pasa todos los días:

```text
Ana lee la tarea      → {"titulo": "original"}
Bruno lee la tarea    → {"titulo": "original"}
Ana escribe           → {"titulo": "versión de Ana"}
Bruno escribe         → {"titulo": "versión de Bruno"}
```

**El cambio de Ana desapareció.** Nadie recibió un error, nadie se enteró, y Ana
seguirá creyendo que su edición se guardó hasta que vuelva a abrir la tarea.

Es la actualización perdida, uno de los problemas clásicos de concurrencia
[@kleppmann-ddia], y `If-Match` lo cierra: Bruno declara qué versión creía estar
editando, el servidor comprueba que sigue siendo esa, y si no, responde **412**.

Ese 412 no es un fallo: es información. El cliente puede recargar, mostrar el
conflicto y dejar que Bruno decida.

## 🧩 La situación

`GET /tareas/1` devuelve la tarea con su etiqueta. `PUT` **sin** declarar qué
versión esperas se rechaza; con una versión desactualizada, también.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /tareas/1` | `200`, cuerpo y `etag` |
| `PUT` **sin** `If-Match` | **`428`** · `PRECONDICION_REQUERIDA` |
| `PUT` con `If-Match` desactualizado | `412` · `PRECONDICION_FALLIDA` |
| `GET /tareas/1` | el recurso **no cambió** |

**El 428 es una decisión de diseño**, no del estándar. Exigir la precondición
convierte la protección en obligatoria: sin él, un cliente que se olvide de
enviar `If-Match` sobrescribe a ciegas y nadie se entera.

Es la misma lógica de la clase 021 con los límites: **una defensa que depende de
que el cliente se acuerde no es una defensa**.

<!-- generado: fichas -->

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
PORT=3000 java -jar target/clase-048-1.0.0.jar --server.port=3000
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
| `Clase048.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones

### De dónde sale la etiqueta

```javascript
function etiqueta(valor) {
  return `"${createHash("sha256").update(JSON.stringify(valor)).digest("hex").slice(0, 16)}"`;
}
```

Un resumen del contenido: siempre correcto y **caro con datos grandes**, porque
obliga a leer y resumir el recurso entero.

Las alternativas habituales:

| Origen | Coste | Cuidado |
| --- | --- | --- |
| Resumen del contenido | alto | ninguno |
| Número de versión de la fila | mínimo | hay que mantenerlo |
| Fecha de modificación | mínimo | **resolución de un segundo** |

La tercera tiene una trampa real: si dos escrituras ocurren en el mismo segundo,
la fecha no cambia y la protección desaparece justo en el caso de mayor
concurrencia — que es cuando hace falta.

### El 304 debe ir vacío

```java
return ResponseEntity.status(304).eTag(actual).build();
```

`build()` en Spring, `Response(status_code=304)` en FastAPI, `end()` en Express.
El estándar dice que no hay contenido [@rfc9110], y algunos clientes se atragantan
si llega.

## 🔬 Comparación

| Framework | Etiqueta | ¿Ayuda con el 304? |
| --- | --- | --- |
| Spring Boot | `.eTag()` en el constructor de respuesta | filtro de ETag automático disponible |
| ASP.NET Core | `Headers.ETag` | middleware para estáticos |
| Express | `.set("etag", ...)` | genera una para respuestas JSON |
| FastAPI | cabecera en la respuesta | no |

Express y Spring pueden generar la etiqueta por su cuenta, y conviene saber qué
implica: **el servidor hace todo el trabajo igual** —consulta la base, serializa—
y solo se ahorra el envío. El 304 automático ahorra ancho de banda, no cómputo.

Ahorrar el cómputo exige calcular la etiqueta **sin construir la respuesta**, que
es la razón de usar un número de versión de la fila.

## 🧭 Y una advertencia sobre el `If-Match` en formularios

Este mecanismo es correcto y **no basta solo** en interfaces donde el usuario
tarda minutos en editar. Si Bruno abre el formulario y lo envía media hora
después, recibirá un 412 casi seguro, y desde su punto de vista la aplicación
«falla».

La respuesta no es quitar la protección: es **manejar el 412 con una interfaz que
muestre el conflicto** y permita fusionar o elegir. La clase 120 lo trata en el
contexto de la sincronización sin conexión, donde el problema es el mismo con
horas de por medio.

## ⚠️ Errores frecuentes

- **304 con cuerpo.** El estándar lo prohíbe.
- **Etiqueta que cambia sin cambiar el contenido.** Serializar con orden de
  claves inestable la invalida en cada petición.
- **Fecha de modificación con resolución de un segundo.**
- **Aceptar escrituras sin precondición.** La protección se vuelve opcional.
- **Tratar el 412 como error del servidor.** Es información: hay un conflicto.
- **`ETag` sin `Cache-Control`.** El navegador decide por su cuenta cuándo
  revalidar.

## ✅ Verificación

```bash
node scripts/run-class.mjs 048
```

## 🧪 Reto de transferencia

Reproduce la actualización perdida: dos clientes leen, los dos escriben con el
mismo `If-Match`, y comprueba que **el segundo recibe 412**. Después quita la
comprobación y observa que el segundo pisa al primero sin error. Reproducir el
fallo es el ejercicio.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 016 — Cabeceras](../../parte-1-responder/016-cabeceras-leer-y-escribir/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@rfc9111] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Caching*, RFC 9111, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9111>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
