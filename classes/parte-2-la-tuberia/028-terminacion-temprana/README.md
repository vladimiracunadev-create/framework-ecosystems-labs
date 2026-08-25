# Clase 028 — Terminación temprana

> [⬅️ 027](../027-el-orden-importa/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [029 ➡️](../029-registro-de-peticiones/README.md)
>
> Parte **2 — La tubería** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Cortar la cadena **sin llegar al manejador**, y demostrar con una prueba que el
manejador no se ejecutó. Es el mecanismo detrás de la autenticación, los cupos y
los cortacircuitos.

## 🧩 La situación

`GET /privado` sin cabecera de autorización responde **401**, y el contador del
manejador sigue en cero: la capa cortó antes. Con la cabecera correcta, la cadena
continúa y el contador sube. `GET /publico` no pasa por la comprobación.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /privado` sin cabecera | `401` |
| igual | `{"error":"no autorizado","manejador":0}` |
| igual | `www-authenticate: Bearer` |
| `GET /privado` con `authorization: Bearer valido` | `200` · `{"ok":true,"manejador":1}` |
| `GET /publico` | `200` · sin pasar por la comprobación |

**El contador es la prueba.** Sin él, un 401 podría venir del manejador; con él
en cero, se demuestra que la ejecución nunca llegó allí. Es la diferencia entre
afirmar el comportamiento y verificarlo.

Y la cabecera `www-authenticate` no es adorno: el estándar la exige en toda
respuesta 401 [@rfc9110]. Sin ella, el cliente sabe que le falta autenticación y
no sabe de qué tipo.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Terminación temprana**](../../../glosario/README.md#terminación-temprana) | Cortar la cadena respondiendo sin llamar a la siguiente capa. No necesita ningún mecanismo especial: cortar es simplemente no continuar. Es cómo se implementa una comprobación de autenticación. |

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
PORT=3000 java -jar target/clase-028-1.0.0.jar --server.port=3000
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
| `Clase028.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro cortan la cadena de la misma forma —**responder sin continuar**— y el
contador del manejador es lo que demuestra que la ejecución nunca llegó allí.

Ninguna necesita un mecanismo especial. Eso es el hallazgo: **cortar es
simplemente no llamar a la siguiente**.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
app.use((peticion, respuesta, siguiente) => {
  if (peticion.path === "/publico") return siguiente();

  const autorizacion = peticion.get("authorization");
  if (autorizacion !== "Bearer valido") {
    return respuesta
      .status(401)
      .set("www-authenticate", "Bearer")
      .json({ error: "no autorizado", manejador: manejadorLlamado });
  }
  siguiente();
});
```

```javascript
app.get("/privado", (peticion, respuesta) => {
  manejadorLlamado += 1;
  respuesta.json({ ok: true, manejador: manejadorLlamado });
});
```

El `return` delante de `respuesta.…` no es estilo: es lo que impide que la
ejecución siga y llame a `siguiente()` después de haber respondido. Ese error
—responder y continuar— produce el clásico *cannot set headers after they are
sent*, y es el fallo más frecuente de la clase.

El contador es la prueba: si el corte no funcionara, el `401` devolvería
`manejador: 1` en vez de `manejador: 0`.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
    if peticion.headers.get("authorization") != "Bearer valido":
        return JSONResponse(
            {"error": "no autorizado", "manejador": estado["manejador"]},
            status_code=401,
            headers={"www-authenticate": "Bearer"},
        )
    return await siguiente(peticion)
```

Aquí el corte es **estructuralmente imposible de hacer mal**, y merece notarlo:
la capa **devuelve una respuesta**, así que o devuelves la tuya o devuelves la de
`siguiente`. No hay forma de hacer las dos cosas.

Es el contraste exacto con Express, donde la capa no devuelve nada y responder y
continuar son dos acciones independientes que se pueden ejecutar las dos.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
    if (contexto.Request.Headers.Authorization != "Bearer valido")
    {
        contexto.Response.StatusCode = 401;
        contexto.Response.Headers.WWWAuthenticate = "Bearer";
        await contexto.Response.WriteAsJsonAsync(
            new { error = "no autorizado", manejador = manejadorLlamado });
        return;
    }

    await siguiente();
```

El mismo modelo que Express —escribir en la respuesta y no continuar— con
`return` en lugar de `return respuesta.…`. La respuesta se **modifica**, no se
devuelve.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
            if (!"Bearer valido".equals(p.getHeader("Authorization"))) {
                r.setStatus(401);
                r.setHeader("WWW-Authenticate", "Bearer");
                r.setContentType("application/json");
                r.getWriter().write(
                        "{\"error\":\"no autorizado\",\"manejador\":" + MANEJADOR.get() + "}");
                return;
            }

            cadena.doFilter(peticion, respuesta);
```

Igual: **no llamar a `cadena.doFilter` corta**. Y una diferencia que salta a la
vista y no es casual — el JSON se escribe **a mano, como texto**.

Un filtro de servlet vive *por debajo* de Spring MVC: cuando corta, el
despachador y sus convertidores de mensajes todavía no han entrado en juego, así
que no hay nadie que serialice un objeto. Es el precio de estar tan abajo en la
pila, y también su ventaja: **nada de lo que hay por encima puede saltárselo**.

Fíjate en el orden de la comparación, `!"Bearer valido".equals(...)`: la
constante primero, para que un `null` en la cabecera no reviente. Es un modismo
de Java que aquí evita un caso real — una petición sin cabecera de autorización
es exactamente la que quieres rechazar.

## 🧭 Por qué esto pertenece a la tubería y no al manejador

Podrías comprobar la autorización dentro de cada manejador. Tres razones para no
hacerlo:

**1. No se puede olvidar.** Una ruta nueva queda protegida por estar donde está,
no por acordarse de añadir la comprobación. Es la diferencia entre una lista
blanca y una negra, y el
[módulo 07](../../../curriculum/07-identidad-y-seguridad.md) insiste en ella.

**2. Se rechaza antes de gastar.** El trabajo caro —consultar la base, serializar,
llamar a otro servicio— no llega a ocurrir.

**3. La respuesta es uniforme.** Un solo sitio decide el formato del 401, así que
todos los 401 se parecen.

La contrapartida honesta: **las excepciones se vuelven incómodas**. La ruta
pública de esta clase necesita un `if` dentro de la capa, y en cuanto hay diez
rutas públicas ese `if` es una lista que mantener. Ahí es donde los frameworks
ofrecen grupos de rutas con capas propias — y donde Spring Security, la
autorización de ASP.NET Core o los grupos de Laravel dejan de ser opcionales.

## ⚠️ Errores frecuentes

- **Comprobar en el manejador.** La ruta nueva se olvida.
- **401 sin `www-authenticate`.** El estándar la exige.
- **Confundir 401 con 403.** *No sé quién eres* frente a *sé quién eres y no
  puedes*. La clase 070 lo separa.
- **Continuar y responder también.** Se escribe dos veces en la misma respuesta.
- **Mantener la lista de rutas públicas dentro de un `if`.** Crece hasta que se
  vuelve el sitio donde se cuelan errores.

## 🔬 Comparación

| Framework | Cómo se corta | ¿Aviso si continúas por error? |
| --- | --- | --- |
| Express | `return` sin `siguiente()` | no |
| FastAPI | devolver sin `await siguiente` | no |
| ASP.NET Core | `return` sin `await siguiente()` | no |
| Spring Boot | `return` sin `doFilter` | no |

Ninguno avisa. Escribir en la respuesta y **además** continuar produce un error en
tiempo de ejecución que aparece tarde y confuso — otra razón para que el contrato
lo compruebe.

## ✅ Verificación

```bash
node scripts/run-class.mjs 028
```

## 🧪 Reto de transferencia

Convierte la lista de rutas públicas en una configuración: un conjunto de
patrones que la capa consulta. Después añade una ruta pública nueva **sin tocar
la capa**. Eso es lo que hace un framework cuando te ofrece grupos de rutas.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 070 — Autorización por rol](../../parte-5-identidad-y-seguridad/070-autorizacion-por-rol/README.md)
- [Módulo 07 — Identidad y seguridad](../../../curriculum/07-identidad-y-seguridad.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@owasp-asvs] *OWASP Application Security Verification Standard*, OWASP Foundation — <https://owasp.org/www-project-application-security-verification-standard/>
