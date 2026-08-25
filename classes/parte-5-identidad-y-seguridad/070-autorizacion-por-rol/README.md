# Clase 070 — Autorización por rol

> [⬅️ 069](../069-oauth-2-0-y-openid-connect/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [071 ➡️](../071-autorizacion-por-recurso/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Separar **quién eres** de **qué puedes hacer**. Las clases 066 a 069
resolvieron la primera pregunta; esta clase resuelve la segunda — y mide la
distinción que más se confunde en la práctica: `401` no es `403`.

## 🧩 La situación

Dos usuarios con la misma contraseña y distinto rol: `ana` es administradora,
`luis` es lector. El mismo `/panel` responde `200` a una y `403` al otro; las
`/tareas` las leen los dos; borrarlas exige el rol de administradora.

## 🧮 El contrato

| Petición | Respuesta | Qué mide |
| --- | --- | --- |
| `GET /panel` sin credenciales | `401` + `WWW-Authenticate` | no sé quién eres: **te pido credenciales** |
| credenciales malas | `401` | sigue sin saberse quién eres |
| `ana` (administradora) | `200` | el rol permitido |
| `luis` (lector) | **`403`** | sé quién eres **y no puedes** — sin pedir credenciales |
| `GET /tareas` como `luis` | `200` | el rol corta por recurso, no por persona |
| `DELETE /tareas/1` como `luis` | `403` | la misma ruta, otro verbo, otra regla |
| `DELETE /tareas/1` como `ana` | `204` | y el borrado **ocurre** |
| `GET /tareas` después | `total: 1` | no fue un 204 decorativo |

La pareja `401`/`403` es el corazón: ante un `401` el cliente reintenta con
credenciales; ante un `403`, no — reintentar no va a cambiar tu rol. Un
servidor que confunde los dos rompe a todos los clientes bien escritos
[@rfc9110]. Y el último caso evita el fallo clásico de las pruebas de
autorización: comprobar el código de estado y no comprobar **el efecto**.

La autenticación es Basic [@rfc9110] a propósito: credenciales estáticas en
la cabecera dejan el contrato enfocado en lo que la clase enseña, que es la
autorización.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Autorización por rol**](../../../glosario/README.md#autorización-por-rol) | Decidir qué puede hacer alguien según su clase de usuario. Responde «qué clase de usuario eres» y se puede expresar de forma declarativa, en la configuración o en la ruta. |

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
PORT=3000 java -jar target/clase-070-1.0.0.jar --server.port=3000
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
| `Clase070.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

El reparto vuelve a ser desigual, y es el hallazgo de la clase: **dónde vive la
regla de quién puede qué**. Las cuatro pasan el mismo contrato y la regla está
en cuatro sitios distintos — en la configuración, en el registro de la ruta, en
la firma de la función y en un middleware propio.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — en la configuración

Aquí sí entra **Spring Security entero**, y es el único del elenco donde la
autorización no toca ni una línea de los controladores:

```java
    SecurityFilterChain cadena(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(reglas -> reglas
                        .requestMatchers("/panel").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/tareas/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults());
        return http.build();
    }
```

```java
        return new InMemoryUserDetailsManager(
                User.withUsername("ana").password("{noop}secreta123").roles("ADMIN").build(),
                User.withUsername("luis").password("{noop}secreta123").roles("LECTOR").build());
```

Todas las reglas en un sitio: se lee la política del sistema entero sin abrir
un solo controlador. Y esa es también la crítica — **la regla está lejos del
código que protege**, así que al leer `/panel` no hay nada que indique que está
restringido.

Dos detalles del propio framework: `{noop}` declara que la clave va sin
resumir, que es lo que la clase 068 dice que no se hace fuera de un
laboratorio; y `roles("ADMIN")` se convierte internamente en la autoridad
`ROLE_ADMIN`, por lo que `hasRole("ADMIN")` y `hasAuthority("ROLE_ADMIN")` son
lo mismo escrito de dos maneras — una fuente clásica de confusión.

`.anyRequest().authenticated()` es el cierre por omisión: **lo que no está
enumerado, exige sesión**. Una ruta nueva nace protegida en vez de nacer
abierta.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — política con nombre, en la ruta

El framework parte el problema en dos mitades con destinos distintos:

```csharp
constructor.Services
    .AddAuthentication("Basic")
    .AddScheme<AuthenticationSchemeOptions, ManejadorBasico>("Basic", null);
constructor.Services.AddAuthorization(opciones =>
{
    opciones.AddPolicy("administradora", politica => politica.RequireRole("admin"));
});
```

**La autenticación es enchufable** —el esquema Basic hay que escribirlo, porque
no viene— y **la autorización es de serie**: políticas con nombre. Y el nombre
importa, porque es lo que cada ruta pide:

```csharp
app.MapGet("/panel", (ClaimsPrincipal actual) =>
        Results.Json(new { usuario = actual.Identity!.Name, rol = "admin" }))
    .RequireAuthorization("administradora");
```

```csharp
app.MapGet("/tareas", () => Results.Json(new { total = tareas.Count }))
    .RequireAuthorization();
```

Es el punto intermedio entre Spring y Express: la **regla** se define una vez y
en un sitio, pero **quién la exige** se lee en la propia ruta.
`RequireAuthorization()` sin argumento significa «basta estar autenticado»: el
lector lee.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — en la firma de la función

Sin roles de serie, pero su pieza de composición hace algo que ninguno de los
otros tres consigue:

```python
def con_rol(*roles: str):
    def comprobar(
        actual: Annotated[dict[str, str], Depends(usuario_actual)],
    ) -> dict[str, str]:
        if roles and actual["rol"] not in roles:
            raise HTTPException(status_code=403, detail="rol-insuficiente")
        return actual

    return comprobar
```

```python
def panel(actual: Annotated[dict[str, str], Depends(con_rol("admin"))]) -> JSONResponse:
```

**La regla está en la firma.** Quién puede entrar a `/panel` se lee sin leer el
cuerpo de `/panel`, y sin irse a un archivo de configuración. Es la misma idea
de «la firma es el contrato» de la clase 013, aplicada a la autorización.

Y el `Depends` anidado —`con_rol` depende de `usuario_actual`, que depende de
`seguridad`— es composición real: FastAPI resuelve la cadena entera antes de
llamar a la función.

```python
    if registrado is None or not secrets.compare_digest(
        registrado["clave"], credenciales.password
    ):
```

`compare_digest` es la comparación en tiempo constante de la clase 068,
otra vez: comparar con `==` delata la longitud del prefijo correcto.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — un middleware propio

```javascript
function conRol(...roles) {
  return (peticion, respuesta, siguiente) => {
    const actual = autenticar(peticion);
    if (!actual) {
      return respuesta
        .status(401)
        .set("WWW-Authenticate", 'Basic realm="laboratorio"')
        .json({ error: "no-autenticado" });
    }
    if (roles.length && !roles.includes(actual.rol)) {
      return respuesta.status(403).json({ error: "rol-insuficiente" });
    }
    peticion.actual = actual;
    siguiente();
  };
}
```

```javascript
app.get("/panel", conRol("admin"), (peticion, respuesta) => {
```

Express no trae ninguna de las dos mitades: **este archivo *es* el framework de
autorización**. Treinta líneas legibles, y tuyas para siempre — con sus futuros
fallos, sus casos límite y nadie que publique un aviso cuando aparezca uno.

Es también donde la distinción de la clase se ve más desnuda, porque hay que
escribirla: **401 es «no sé quién eres»** y va acompañado de
`WWW-Authenticate`, que es la invitación a reintentar; **403 es «sé quién eres
y no puedes»** y no lleva esa cabecera, porque reintentar no serviría de nada.
Confundirlos rompe a los clientes de verdad: ante un 401 vuelven a preguntar
credenciales, ante un 403 no.

## 📊 Comparación

| Framework | La regla vive en… | Se lee en la ruta | Quién la mantiene |
| --- | --- | --- | --- |
| Spring Boot | la configuración central | no — hay que ir a la cadena | el framework |
| ASP.NET Core | políticas con nombre | sí — `RequireAuthorization("…")` | el framework |
| Express | middleware propio | sí — `conRol("admin")` | **tú** |
| FastAPI | dependencias propias | sí — en la firma | **tú** |

Centralizar (Spring) hace imposible olvidar una ruta nueva sin pasar por la
configuración; declarar en la ruta (los otros tres) hace el permiso visible
donde se usa. Los dos estilos fallan distinto: la regla central que nadie
actualizó frente a la ruta nueva a la que nadie puso middleware.

## ⚠️ Errores frecuentes

- **403 donde va 401, y al revés.** El cliente no puede decidir si reintentar.
- **Autorizar solo en la interfaz.** Ocultar el botón de borrar no protege el
  `DELETE`: el contrato de esta clase pega directamente contra la API, como
  cualquier atacante [@owasp-top10].
- **Probar el código de estado y no el efecto.** Un `204` que no borró pasa
  todas las pruebas menos la última de este contrato.
- **El rol dentro del recurso** (`if usuario.rol == "admin"` repetido en cada
  handler). Se olvida uno y nadie lo ve: la regla debe vivir en una pieza —
  middleware, política o configuración.
- **Roles que crecen sin límite** (`editor-senior-fines-de-semana`). El rol
  responde «qué clase de usuario eres»; cuando la pregunta es «¿es tuyo este
  dato?», el rol no alcanza — esa es la clase 071.

## ✅ Verificación

```bash
node scripts/run-class.mjs 070
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Añade el rol `editora` que puede crear (`POST /tareas`) pero no borrar, y los
tres casos que lo midan. Observa en cuál de las cuatro implementaciones el
cambio toca **un** archivo y en cuál toca varios — esa diferencia es la tabla
de comparación hecha carne.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 071 — Autorización por recurso](../071-autorizacion-por-recurso/README.md) — cuando el rol no alcanza
- [Clase 031 — Manejo centralizado de errores](../../parte-2-la-tuberia/031-manejo-centralizado-de-errores/README.md) — la misma lección: la regla en un solo lugar

## Fuentes

- [@rfc9110] *RFC 9110 — HTTP Semantics* (§15.5.2 401, §15.5.4 403, §11 autenticación). IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@owasp-top10] *OWASP Top 10* (A01: Broken Access Control). OWASP — <https://owasp.org/www-project-top-ten/>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Authorization). OWASP — <https://cheatsheetseries.owasp.org/>
