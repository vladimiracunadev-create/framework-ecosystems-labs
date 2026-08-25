# Clase 020 — Servir archivos estáticos

> [⬅️ 019](../019-redirecciones/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [021 ➡️](../021-subida-de-archivos/README.md)
>
> Parte **1 — Responder** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Entregar un archivo del disco con **el tipo y la caché correctos**, y entender
por qué exponer un directorio es una decisión de seguridad.

## 🧩 La situación

`GET /estatico/logo.svg` devuelve el archivo con `content-type: image/svg+xml` y
una directiva de caché. Un archivo inexistente responde 404.

## 📖 Las tres decisiones que esconde

Servir estáticos parece una línea de configuración. Son tres decisiones:

**1. Qué directorio se expone.** Todo lo que haya dentro es público, incluido lo
que alguien deje ahí mañana. Un `.env` o una copia de seguridad en esa carpeta se
sirven igual que el logo.

**2. Cuánto se puede cachear.** Sin `Cache-Control`, el navegador revalida en
cada carga: se pierde casi toda la ventaja de servir un archivo estático. Con un
máximo muy largo, publicar una versión nueva no llega a quien ya la tiene.

La respuesta habitual a esa tensión es el **nombre con huella**: `logo.a3f9.svg`
con un año de caché. Si el contenido cambia, cambia el nombre, y el nombre nuevo
no está en ninguna caché. La [ficha de Vite](../../../atlas/fichas/vite.md)
explica cómo lo generan las herramientas de compilación.

**3. Quién lo sirve en producción.** Tu proceso de aplicación no es el mejor sitio
para entregar archivos: un servidor especializado o una red de distribución lo
hace mejor y libera hilos para lo que solo tú puedes hacer.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /estatico/logo.svg` | `200` |
| igual | `content-type: image/svg+xml` |
| igual | `cache-control` contiene `max-age=3600` |
| `GET /estatico/no-existe.svg` | `404` |

El segundo caso comprueba que el tipo **se deduce de la extensión**. Los cuatro
frameworks traen una tabla de tipos y aciertan con SVG, que no es de los más
comunes.

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
| `publico/logo.svg` | archivo del proyecto |
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
| `publico/logo.svg` | archivo del proyecto |
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
PORT=3000 java -jar target/clase-020-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `publico/logo.svg` | archivo del proyecto |
| `src/main/java/labs/Aplicacion.java` | código Java |
| `src/main/resources/publico/logo.svg` | archivo del proyecto |

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
| `Clase020.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `publico/logo.svg` | archivo del proyecto |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Servir un archivo es fácil en los cuatro. Lo que separa a las cuatro
implementaciones son **las decisiones que hay que tomar aparte**: la caché, los
archivos ocultos y de dónde salen los ficheros.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
app.use(
  "/estatico",
  express.static(path.join(import.meta.dirname, "publico"), {
    maxAge: "1h",
    dotfiles: "deny",
    index: false,
  }),
);
```

Las tres opciones son las tres decisiones, escritas y a la vista.

**`dotfiles: "deny"` es la que casi nadie pone**, y es la que evita una fuga:
sin ella, un `.env` que acabe en esa carpeta se sirve al primero que lo pida. Es
la clase de agujero que aparece por exponer un directorio entero en lugar de
archivos concretos.

`maxAge` se traduce a `Cache-Control: public, max-age=3600`. Sin ella el
navegador revalida en cada carga y se pierde casi toda la ventaja de servir
estáticos [@rfc9111].

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
app.mount("/estatico", StaticFiles(directory=RAIZ), name="estatico")
```

Una línea. Y **sin `Cache-Control`**: `StaticFiles` no lo emite, así que la
implementación tiene que añadir una capa que lo ponga:

```python
@app.middleware("http")
async def cachear(peticion: Request, siguiente):
```

```python
    respuesta: Response = await siguiente(peticion)
    if peticion.url.path.startswith("/estatico"):
        respuesta.headers["cache-control"] = "public, max-age=3600"
    return respuesta
```

Es el mejor ejemplo del elenco de la diferencia entre **«funciona» y «está
bien»**: montar los estáticos funciona de inmediato, y servirlos con caché es
una decisión que hay que tomar por separado — y que nadie recuerda hasta que
mira las cabeceras.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
            registro.addResourceHandler("/estatico/**")
                    .addResourceLocations("classpath:/publico/")
                    .setCacheControl(CacheControl.maxAge(Duration.ofHours(1)).cachePublic());
```

La diferencia de fondo está en dos palabras: **`classpath:`** en vez de una ruta
del disco. Los archivos van **dentro del artefacto**, no junto a él.

Eso hace el despliegue de una sola pieza —un `.jar` que contiene la aplicación y
sus estáticos, sin nada que copiar aparte— y a cambio **publicar un cambio de
logo exige recompilar**. Es un intercambio real y va en las dos direcciones:
menos partes móviles en producción, más lento el ciclo de un cambio trivial.

`CacheControl.maxAge(...).cachePublic()` es además el único del elenco donde la
directiva se construye con un tipo en vez de con una cadena.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath, "publico")),
    RequestPath = "/estatico",
    OnPrepareResponse = contexto =>
    {
        contexto.Context.Response.Headers.CacheControl = "public, max-age=3600";
    },
});
```

La más verbosa de las cuatro, y la más flexible por un motivo concreto:
**`FileProvider` es una abstracción**. `PhysicalFileProvider` lee del disco, y
hay otros que leen de recursos incrustados en el ensamblado o de un
almacenamiento remoto — **sin cambiar el resto del código**.

Es la misma idea que el `classpath:` de Spring, generalizada: de dónde salen los
bytes es una decisión enchufable en vez de una convención fija.

`OnPrepareResponse` es un gancho por respuesta, así que la caché se decide
archivo a archivo si hace falta — algo que la opción `maxAge` de Express, que es
global, no permite.

## 🔬 Comparación

| Framework | Líneas | ¿Caché por omisión? | Origen de los archivos |
| --- | --- | --- | --- |
| FastAPI | 1 | **no** | disco |
| Express | 5 | no, pero opción directa | disco |
| Spring Boot | 3 | configurable en la misma llamada | dentro del artefacto |
| ASP.NET Core | 8 | no, con enganche para ponerla | proveedor conectable |

**Ninguno de los cuatro emite `Cache-Control` por omisión.** Es coherente —el
framework no sabe cuánto vale tu archivo— y significa que la configuración por
omisión de los cuatro es la lenta.

## ⚠️ Errores frecuentes

- **Exponer un directorio con secretos dentro.** Un `.env` o un `.git` en la
  carpeta pública se sirven como cualquier otro archivo.
- **Servir sin `Cache-Control`.** El navegador revalida en cada carga.
- **Caché larga sin huella en el nombre.** El cambio no llega a quien ya guardó
  el archivo.
- **Servir estáticos desde el proceso de aplicación en producción.** Consume
  hilos que hacen falta para lo demás.
- **Confiar en la extensión para el tipo de un archivo subido por un usuario.**
  Es la clase 021, y ahí sí es un problema de seguridad.

## ✅ Verificación

```bash
node scripts/run-class.mjs 020
```

## 🧪 Reto de transferencia

Añade un archivo `.env` de mentira a la carpeta pública y comprueba en las cuatro
implementaciones si se sirve. Después corrige las que lo sirvan. **Es el
experimento más útil de esta clase.**

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Ficha de Vite](../../../atlas/fichas/vite.md) — de dónde salen los nombres con huella
- [Módulo 08 — Calidad, rendimiento y operación](../../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@rfc9111] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Caching*, RFC 9111, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9111>
- [@grigorik-hpbn] Grigorik, Ilya. *High Performance Browser Networking*. O'Reilly Media, 2013. ISBN 9781449344764 — <https://openlibrary.org/isbn/9781449344764>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series*, OWASP Foundation — <https://cheatsheetseries.owasp.org/>
