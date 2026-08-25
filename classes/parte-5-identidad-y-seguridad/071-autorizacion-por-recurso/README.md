# Clase 071 — Autorización por recurso

> [⬅️ 070](../070-autorizacion-por-rol/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [072 ➡️](../072-csrf/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🔴 avanzado** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Comprobar **la propiedad del dato, no solo el rol**. El fallo que esta clase
mide tiene nombre propio —IDOR, *Insecure Direct Object Reference*— y es la
forma más común del riesgo n.º 1 de OWASP: cambiar el `1` de la URL por un
`2` y leer lo que no es tuyo [@owasp-top10].

## 🧩 La situación

`ana` y `luis` tienen **el mismo rol**. La tarea 1 es de ella; la 2, de él.
Una comprobación por rol —la clase 070 entera— los deja pasar a los dos: el
rol responde «qué clase de usuario eres», y la pregunta aquí es **«¿es tuyo
este dato?»**.

## 🧮 El contrato

| Petición | Respuesta | Qué mide |
| --- | --- | --- |
| `GET /tareas/1` sin identidad | `401` | primero, quién eres |
| `ana` pide **su** tarea | `200` | el camino feliz |
| `luis` — mismo rol — pide la tarea de `ana` | **`404`** | la propiedad, no el rol |
| `luis` pide la tarea `999`, que no existe | **`404`** | …indistinguible de la anterior |
| `GET /tareas` como `luis` | `total: 1` | la lista también filtra |
| `luis` **borra** la tarea de `ana` | `404` | leer y escribir, la misma regla |
| `ana` vuelve a pedir su tarea | `200` | el borrado ajeno no ocurrió |

Los casos tercero y cuarto son la pareja fina: la tarea ajena responde
**exactamente igual** que la inexistente. Un `403` sería más «correcto»
semánticamente — y confirmaría al atacante que el identificador existe, que
con identificadores enumerables es media enumeración de tu base de datos
[@owasp-cheatsheets]. Para recursos privados, «no es tuyo» y «no existe»
deben ser la misma respuesta.

## 📖 La regla vive en la consulta

Las cuatro implementaciones comparten un gesto, y es el corazón de la clase:

```sql
-- no así:                       -- así:
SELECT * FROM tareas             SELECT * FROM tareas
WHERE id = ?                     WHERE id = ? AND propietaria = ?
-- …y luego if (t.duena != yo)
```

No es «buscar y luego comprobar»: es que para este usuario, la tarea ajena
**directamente no se encuentra**. La diferencia importa por tres razones:

1. **No hay ventana** entre buscar y comprobar en la que el dato ya salió
   del almacén hacia el código.
2. **No se puede olvidar**: si el repositorio solo ofrece
   `buscar(id, usuario)`, el handler no tiene forma de saltarse la regla.
3. **El 404 sale gratis**: no encontrado y no autorizado son, literalmente,
   el mismo camino de código.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Autorización por recurso**](../../../glosario/README.md#autorización-por-recurso) | Decidir si **este** dato concreto es tuyo. Ninguna configuración declarativa puede responderlo, porque la respuesta depende del dato: se resuelve poniendo al propietario **en la consulta**, no comprobando después. |

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
- **Versión que ejecuta esta clase:** `fastapi>=0.115, uvicorn>=0.30`
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
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, spring-boot-starter-security`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-071-1.0.0.jar --server.port=3000
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
| `Clase071.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

A diferencia de la 070, aquí los cuatro frameworks están **igual de desnudos**,
y eso es el hallazgo. La configuración declarativa —`hasRole`, políticas,
middleware— **no puede responder «¿es tuyo?»**, porque la respuesta depende del
dato y no de la ruta. Spring Security y las políticas de ASP.NET siguen ahí,
pero solo contestan la primera pregunta.

La segunda vive en una función de cuatro líneas que es casi idéntica en los
cuatro lenguajes. Léelas seguidas: la coincidencia es el argumento.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
function buscar(id, usuario) {
  const tarea = tareas.get(id);
  return tarea && tarea.propietaria === usuario ? tarea : null;
}
```

```javascript
  const tarea = buscar(peticion.params.id, peticion.usuario);
  if (!tarea) return respuesta.status(404).json({ error: "no-encontrada" });
```

**No es «buscar y luego comprobar»**: para este usuario, la tarea ajena
directamente *no se encuentra*. En una base de datos sería `WHERE id = ? AND
propietaria = ?`, el mismo gesto — y esa es la razón de que este patrón escale
y el otro no.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
def buscar(identificador: str, usuario: str) -> dict[str, str] | None:
```

```python
    tarea = tareas.get(identificador)
    return tarea if tarea and tarea["propietaria"] == usuario else None
```

```python
    mias = [t for t in tareas.values() if t["propietaria"] == usuario]
    return JSONResponse({"total": len(mias), "tareas": mias})
```

Y la lista es el otro lado de la misma moneda: **el filtro por propietaria está
en la consulta**, no después. Una lista que se trae todo y luego filtra en
memoria funciona con diez tareas y se cae con diez mil — y mientras tanto ya
sacó de la base datos que no debía salir.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
    private Tarea buscar(String id, String usuario) {
        Tarea tarea = tareas.get(id);
        return tarea != null && tarea.propietaria().equals(usuario) ? tarea : null;
    }
```

```java
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(reglas -> reglas.anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults());
```

Compara esa cadena de filtros con la de la clase 070: **ha adelgazado a una
sola regla**. Todo lo que Spring Security sabía decir sobre `/panel` no sirve
aquí, porque la pregunta ya no es sobre la ruta.

```java
        List<Tarea> mias = tareas.values().stream()
                .filter(t -> t.propietaria().equals(actual.getName())).toList();
```

`Principal` es la pieza que Spring sí aporta: el usuario autenticado llega como
argumento del método, sin buscarlo en ningún sitio.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
Tarea? Buscar(string id, string usuario) =>
    tareas.TryGetValue(id, out var tarea) && tarea.Propietaria == usuario ? tarea : null;
```

```csharp
        var tarea = Buscar(id, actual.Identity!.Name!);
        return tarea is null
            ? Results.Json(new { error = "no-encontrada" }, statusCode: 404)
            : Results.Json(tarea);
```

`RequireAuthorization()` sigue en todas las rutas —sin política, solo
autenticación— y `ClaimsPrincipal` cumple el papel del `Principal` de Spring.
La política con nombre de la clase anterior **no aparece**, y no por descuido:
no hay política que pueda expresar «suya».

### Por qué el 404 y no el 403

Los cuatro devuelven `404` para la tarea ajena, y es la decisión más discutida
de la clase:

```javascript
  // 404 y no 403: un 403 confirmaría que la tarea EXISTE, y los
```

Un `403` diría «existe, pero no es tuya». Con identificadores enumerables, eso
convierte el endpoint en un censo: se recorren los números y se anota cuáles
dan 403. **La tarea ajena y la inexistente tienen que ser indistinguibles.**

El precio está declarado: se pierde el matiz que ayudaría a diagnosticar un
error legítimo de permisos. Es el mismo trato que en la clase 068 —un solo 401
para «no existe» y «clave mala»—, y por la misma razón.

> Existen mecanismos declarativos para esta pregunta: `@PostAuthorize` en
> Spring, `IAuthorizationHandler` con requisitos de recurso en ASP.NET. Los dos
> comparten un defecto que los deja fuera del elenco de esta clase: comprueban
> **después de cargar** el dato, uno a uno. Sirven para el detalle; para la
> lista, la única respuesta que escala es el filtro en la consulta.

## 📊 Comparación

| Framework | Quién eres | Es tuyo | El mecanismo declarativo que existe |
| --- | --- | --- | --- |
| Express | middleware propio | en la consulta | — |
| FastAPI | `HTTPBasic` + `Depends` | en la consulta | — |
| Spring Boot | Spring Security | en la consulta | `@PostAuthorize` (tras cargar) |
| ASP.NET Core | esquema propio + `RequireAuthorization` | en la consulta | `IAuthorizationHandler` (tras cargar) |

## ⚠️ Errores frecuentes

- **Confiar en que el identificador es difícil de adivinar.** No es control
  de acceso; los UUID ayudan contra la enumeración pero no autorizan nada.
- **`403` para lo ajeno.** Confirma la existencia. Para recursos privados,
  `404`.
- **Filtrar la lista en el cliente.** La API devuelve todo y la interfaz
  esconde: el contrato de esta clase pega contra la API y lo ve.
- **Proteger la lectura y olvidar la escritura.** El sexto caso existe
  porque `DELETE`, `PUT` y `PATCH` sufren el mismo IDOR que `GET`.
- **Comprobar la propiedad en el handler, dato ya en mano.** Funciona hasta
  que alguien escribe el segundo handler y no copia el `if`. La regla va en
  el repositorio.
- **Un rol de soporte con acceso a todo, sin registro.** Existirá; la clase
  076 (auditoría) es su contrapeso.

## ✅ Verificación

```bash
node scripts/run-class.mjs 071
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Añade **compartir**: `POST /tareas/1/compartir` con `{"con": "luis"}` hace
que `luis` pueda **leer** (no borrar) la tarea 1. La propiedad deja de ser
una columna y se convierte en una relación — y `buscar(id, usuario)` tiene
que aprender la diferencia entre leer y escribir. Mide con el contrato que
compartir no le dio el `DELETE`.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 070 — Autorización por rol](../070-autorizacion-por-rol/README.md) —
  la primera mitad de la pregunta
- [Clase 076 — Auditoría](../076-auditoria/README.md) — quién accedió a qué,
  para cuando el control falla

## Fuentes

- [@owasp-top10] *OWASP Top 10* (A01: Broken Access Control). OWASP — <https://owasp.org/www-project-top-ten/>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Authorization, IDOR Prevention). OWASP — <https://cheatsheetseries.owasp.org/>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
