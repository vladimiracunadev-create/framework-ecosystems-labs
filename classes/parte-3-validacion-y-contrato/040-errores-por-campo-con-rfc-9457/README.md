# Clase 040 — Errores por campo con RFC 9457

> [⬅️ 039](../039-validar-la-entrada/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [041 ➡️](../041-esquemas/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Decir **qué campo falló y por qué**, en formato estándar, y **todos a la vez**.

## 🧩 La situación

Un cuerpo con dos campos mal produce **un solo 422 con los dos errores dentro**,
cada uno con su campo y su código estable.

## 📖 Por qué todos a la vez

Un servidor que informa solo del primer error obliga a un viaje por campo. Con un
formulario de cinco campos mal rellenados: cinco envíos, cinco esperas, y una
persona que corrige a ciegas.

Es un fallo de producto más que de código, y se arregla en el servidor:
**acumular** en lugar de devolver al primer fallo.

## 📖 El formato, y por qué `code` importa más que `title`

```json
{
  "type": "about:blank",
  "title": "la entrada no es válida",
  "status": 422,
  "code": "VALIDACION",
  "errors": [
    { "campo": "titulo", "codigo": "REQUERIDO", "detalle": "no puede estar vacío" },
    { "campo": "prioridad", "codigo": "VALOR", "detalle": "debe ser 1, 2 o 3" }
  ]
}
```

`type`, `title` y `status` son del estándar [@rfc9457]; `code` y `errors` son
extensiones, que el propio estándar contempla.

La distinción clave está entre `title`/`detalle` y `code`/`codigo`:

| Campo | Para quién | ¿Estable? |
| --- | --- | --- |
| `title`, `detalle` | personas | **no**: cambia de redacción y de idioma |
| `code`, `codigo` | programas | **sí**: es el contrato |

Un cliente que hace `if (error.detalle === "no puede estar vacío")` se rompe en
cuanto alguien mejora la frase o traduce la API. Con `codigo === "REQUERIDO"`, no.

## 🔍 Lo que el contrato de esta clase decidió no comprobar

La primera versión exigía también el texto de `detalle`. **FastAPI falló**, y con
razón: Pydantic redacta sus mensajes en inglés —«String should have at least 1
character»— y traducirlos uno a uno sería reescribir la biblioteca.

La conclusión es la misma que enseña el estándar: **el texto legible es de cada
framework; el código es del contrato**. El contrato comprueba ahora `campo` y
`codigo`, y deja que cada implementación redacte el detalle en sus palabras.

Fue necesaria una aserción nueva en el verificador —comparación por
subconjunto— para poder exigir parte de un objeto sin exigirlo entero.

## 🧮 El contrato

| Cuerpo | Respuesta |
| --- | --- |
| `{"titulo":"válida"}` | `201` |
| `{"titulo":""}` | `422` en `application/problem+json` |
| igual | `errors[0]` = campo `titulo`, código `REQUERIDO` |
| título de 129 caracteres | código `LONGITUD` — **no** `REQUERIDO` |
| `{"titulo":"","prioridad":9}` | **dos** errores, en orden |

El cuarto caso separa dos motivos que suelen colapsarse en «inválido». Un cliente
que recibe `LONGITUD` puede recortar; uno que recibe «inválido» solo puede
adivinar.

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
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, spring-boot-starter-validation`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-040-1.0.0.jar --server.port=3000
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
| `Clase040.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones

### FastAPI — los errores ya vienen acumulados

```python
for detalle in error.errors():
    ubicacion = [str(x) for x in detalle["loc"] if x != "body"]
    errores.append({"campo": ".".join(ubicacion) or "cuerpo",
                    "codigo": CODIGOS.get(detalle["type"], "INVALIDO")})
```

Pydantic devuelve **todos** los errores con su ubicación exacta y un tipo
identificable. Lo único que hay que hacer es traducir su vocabulario al tuyo — el
diccionario `CODIGOS` de cinco entradas.

Para estructuras anidadas, `loc` da la ruta completa: `("body","items",0,"nombre")`
se convierte en `items.0.nombre`. Ningún otro de los cuatro lo da tan hecho.

### Spring Boot — y la limitación de las anotaciones estándar

```java
@NotBlank(message = "REQUERIDO|no puede estar vacio")
```

`getFieldErrors()` devuelve todos los campos que fallaron. Pero las anotaciones
de validación estándar **solo tienen un hueco para el mensaje**: no hay un campo
para un código de error.

De ahí el apaño de codificarlo dentro del propio mensaje. Funciona y es feo, y
decirlo importa: en un proyecto real se define una anotación propia con su campo
de código, que es más trabajo del que parece.

### Express y ASP.NET Core — acumular a mano

```javascript
const errores = [];
if (...) errores.push({ campo: "titulo", codigo: "REQUERIDO", ... });
if (...) errores.push({ campo: "prioridad", codigo: "VALOR", ... });
```

Sin mecanismo que acumule por ti, el patrón es explícito: **una lista, y `push`
en lugar de `return`**. Es la diferencia de una letra entre informar de un error e
informar de todos, y es el error más común de esta clase.

## 🔬 Comparación

| Framework | ¿Acumula solo? | ¿Ubicación anidada? | Código estable |
| --- | --- | --- | --- |
| FastAPI | **sí** | **sí**, ruta completa | traduciendo el tipo |
| Spring Boot | **sí** | sí, por campo | dentro del mensaje |
| ASP.NET Core | con `Validator` | limitada | a mano |
| Express | no | no | a mano |

## ⚠️ Errores frecuentes

- **Devolver solo el primer error.** Un viaje por campo.
- **Comparar el texto legible en el cliente.** Se rompe al reescribir la frase.
- **Un solo código para todo.** «Inválido» no le dice al cliente qué corregir.
- **Filtrar el nombre interno del campo.** `usr_tbl_ttl` le dice al atacante cómo
  se llama tu columna.
- **Usar 400 en vez de 422.** El cuerpo se entendió: lo que falla es su contenido.

## ✅ Verificación

```bash
node scripts/run-class.mjs 040
```

## 🧪 Reto de transferencia

Acepta un array de tareas y devuelve errores con la posición dentro:
`errors[0].campo === "tareas.2.titulo"`. En FastAPI sale casi solo; en los otros
tres hay que construir la ruta. Compara cuánto código cuesta en cada uno.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 031 — Manejo centralizado de errores](../../parte-2-la-tuberia/031-manejo-centralizado-de-errores/README.md)
- [Módulo 05 — Backend y API](../../../curriculum/05-backend-y-api.md)

## Fuentes

- [@rfc9457] Nottingham, M.; Wilde, E.; Dalal, S. *Problem Details for HTTP APIs*, RFC 9457, IETF, 2023 — <https://www.rfc-editor.org/rfc/rfc9457>
- [@jin-sahni-designing-web-apis] Jin, Brenda; Sahni, Saurabh; Shevat, Amir. *Designing Web APIs*. O'Reilly Media, 2018. ISBN 9781492026921 — <https://openlibrary.org/isbn/9781492026921>
- [@geewax-api-design-patterns] Geewax, JJ. *API Design Patterns*. Manning, 2021. ISBN 9781617295850 — <https://openlibrary.org/isbn/9781617295850>
