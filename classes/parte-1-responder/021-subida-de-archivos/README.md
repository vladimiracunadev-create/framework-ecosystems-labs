# Clase 021 — Subida de archivos

> [⬅️ 020](../020-servir-archivos-estaticos/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [022 ➡️](../022-respuesta-en-flujo/README.md)
>
> Parte **1 — Responder** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Recibir un archivo **sin cargarlo entero en memoria** y rechazar lo que pasa del
límite **mientras se recibe**, no después.

## 📖 Por qué el orden importa tanto

Un archivo subido llega por la red poco a poco. Hay dos formas de tratarlo:

| Enfoque | Qué pasa con 500 MB |
| --- | --- |
| Leer entero y luego medir | 500 MB en memoria antes de poder rechazarlo |
| Medir mientras se lee y cortar | Se corta al pasar del límite |

La primera opción **hace del límite una decoración**: el daño ya está hecho
cuando lo aplicas. Diez peticiones simultáneas de 500 MB tumban el proceso
aunque tu límite sea de 1 MB.

Es un caso de manual de agotamiento de recursos, y de las defensas que Nygard
agrupa bajo la idea de que todo recurso debe tener un tope explícito
[@nygard-release-it].

## 🧩 La situación

`POST /subir` recibe un archivo en un campo llamado `archivo` y devuelve su
nombre y su tamaño. Sin ese campo responde 422. Por encima de 1 KB —un límite
pequeño a propósito, para que la prueba sea rápida— responde 413.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| archivo `nota.txt` de 4 bytes | `201` · `{"nombre":"nota.txt","bytes":4}` |
| sin campo `archivo` | `422` · `{"error":"falta el archivo"}` |
| archivo de 4096 bytes (límite 1024) | `413` |

## 🌐 Las implementaciones — el código a la vista

Los cuatro aceptan un archivo y rechazan uno grande. Lo que hay que mirar es
**dónde se aplica el límite**, porque de eso depende si el archivo enorme llegó
a ocupar memoria antes de ser rechazado.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — con biblioteca externa

```javascript
const subida = multer({ storage: multer.memoryStorage(), limits: { fileSize: LIMITE } });
```

```javascript
app.post("/subir", subida.single("archivo"), (peticion, respuesta) => {
```

```javascript
app.use((error, peticion, respuesta, siguiente) => {
  if (error?.code === "LIMIT_FILE_SIZE") {
    return respuesta.status(413).json({ error: "archivo demasiado grande" });
  }
  siguiente(error);
});
```

**Express no analiza multipart**: hace falta una biblioteca. Es coherente con lo
que es —un enrutador con middleware— y es una dependencia más que elegir y
mantener.

Lo importante es que `limits.fileSize` **se comprueba mientras se recibe** y
aborta al superarse. Y el manejador de errores no es opcional: sin él, el fallo
sale con el formato por omisión de Express y no con un `413`.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — el bucle a la vista

```python
    total = 0
    while trozo := await archivo.read(256):
        total += len(trozo)
        if total > LIMITE:
            return JSONResponse({"error": "archivo demasiado grande"}, status_code=413)
```

La implementación donde **el mecanismo se ve mejor**, porque el bucle está
escrito. Se lee a trozos y se corta en cuanto se pasa: leer entero y medir
después ya habría gastado la memoria que se quería proteger.

`UploadFile` es además un envoltorio sobre un archivo temporal — **Starlette
vuelca a disco** los cuerpos grandes en lugar de mantenerlos en memoria. Esa
parte viene resuelta; el límite, no.

### Spring Boot · [`spring-boot/…/application.properties`](implementaciones/spring-boot/src/main/resources/application.properties) — el límite en configuración

```properties
spring.servlet.multipart.max-file-size=1KB
spring.servlet.multipart.max-request-size=2KB
```

Y en [`Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java), lo único que queda por escribir:

```java
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> demasiadoGrande() {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(Map.of("error", "archivo demasiado grande"));
    }
```

**El límite no está en el código**: lo aplica el contenedor de servlets antes de
que tu método exista. Es el enfoque más robusto de los cuatro —la defensa está
*antes* que tu código— y el menos visible: quien lea el controlador no ve que
hay un límite.

Fíjate en los **dos** ajustes, porque el segundo es el que se olvida:
`max-file-size` limita cada archivo y `max-request-size` la petición completa.
Sin el segundo, cien archivos de 1 KB pasan el primero.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — comprobación tras leer

```csharp
    var formulario = await peticion.ReadFormAsync();
    var archivo = formulario.Files["archivo"];
```

```csharp
    if (archivo.Length > limite)
    {
        return Results.Json(new { error = "archivo demasiado grande" }, statusCode: 413);
    }
```

Aquí el tamaño se comprueba **después** de leer el formulario, así que esta
comprobación no protege la memoria: para cuando `archivo.Length` existe, el
cuerpo ya se recibió.

La protección real la da el límite del servidor subyacente —Kestrel tiene su
`MaxRequestBodySize` y el servidor de entrada el suyo—, y se configura ahí, no
en el manejador. Queda declarado porque es la diferencia con las otras tres: lo
que este código hace es **decir el error correcto**, no evitar el gasto.

## 🔬 Comparación

| Framework | ¿Analiza multipart? | Dónde vive el límite | ¿Corta durante la recepción? |
| --- | --- | --- | --- |
| Spring Boot | sí | configuración del contenedor | **sí**, antes de tu código |
| Express | con biblioteca | opción de la biblioteca | **sí** |
| FastAPI | sí | tu bucle de lectura | **sí**, si lo escribes |
| ASP.NET Core | sí | servidor subyacente | depende de la configuración |

## 🔒 Lo que esta clase no cubre y hay que saber

Recibir el archivo es la parte fácil. Lo que hace peligrosa una subida es lo que
viene después:

- **No confíes en el nombre.** `../../etc/passwd` como nombre de archivo es el
  ataque clásico de recorrido de directorios. Genera tú el nombre de almacenamiento.
- **No confíes en el tipo declarado.** El `content-type` lo pone el cliente. Un
  ejecutable puede decir que es una imagen.
- **No lo guardes donde se sirve.** Un archivo subido dentro de la carpeta pública
  de la clase 020 es código ajeno servido desde tu dominio.
- **Limita también el número de archivos y el total.** Un límite por archivo no
  protege de mil archivos.

Las cuatro están en las guías de OWASP sobre subida de archivos
[@owasp-cheatsheets], y las cuatro son responsabilidad de la aplicación: ningún
framework de esta tabla las resuelve por ti.

## ⚠️ Errores frecuentes

- **Leer el archivo entero y medir después.** El daño ya está hecho.
- **Poner límite por archivo y no por petición.** Cien archivos de 1 KB pasan un
  límite de 1 KB por archivo.
- **Devolver 500 al superarse el límite.** Es 413, y el cliente sabe qué hacer.
- **Guardar con el nombre que envió el cliente.** Recorrido de directorios.
- **Creerse el `content-type` declarado.** Lo pone quien sube.

## ✅ Verificación

```bash
node scripts/run-class.mjs 021
```

## 🧪 Reto de transferencia

Añade una comprobación que rechace con **415** cualquier archivo cuyo contenido
real no empiece por los bytes de una imagen PNG, **ignorando** el `content-type`
declarado. Es la diferencia entre confiar en el cliente y comprobar.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 033 — Límite de tamaño del cuerpo](../../parte-2-la-tuberia/033-limite-de-tamano-del-cuerpo/README.md)
- [Módulo 07 — Identidad y seguridad](../../../curriculum/07-identidad-y-seguridad.md)

## Fuentes

- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series*, OWASP Foundation — <https://cheatsheetseries.owasp.org/>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
