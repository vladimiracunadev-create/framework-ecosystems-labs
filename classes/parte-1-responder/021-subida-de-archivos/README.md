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

## 🌐 Las implementaciones

### Express — con biblioteca externa

```javascript
const subida = multer({ storage: multer.memoryStorage(), limits: { fileSize: LIMITE } });
app.post("/subir", subida.single("archivo"), (peticion, respuesta) => { ... });
```

Express **no analiza multipart**: hace falta una biblioteca. `limits.fileSize` se
comprueba durante la recepción y aborta al superarse; el error llega al manejador
de errores como `LIMIT_FILE_SIZE`.

Sin ese manejador, el fallo sale con el formato de error por omisión, no con 413.

### FastAPI — lectura a trozos explícita

```python
total = 0
while trozo := await archivo.read(256):
    total += len(trozo)
    if total > LIMITE:
        return JSONResponse({"error": "archivo demasiado grande"}, status_code=413)
```

`UploadFile` es un envoltorio sobre un archivo temporal: **Starlette ya vuelca a
disco** los cuerpos grandes en lugar de mantenerlos en memoria. Aun así, el
límite hay que aplicarlo, y aquí se hace leyendo a trozos.

Es la implementación donde el mecanismo se ve mejor, porque el bucle está a la
vista.

### Spring Boot — límite en configuración

```properties
spring.servlet.multipart.max-file-size=1KB
spring.servlet.multipart.max-request-size=2KB
```

**El límite no está en el código**: lo aplica el contenedor de servlets antes de
que tu método exista. Cuando se supera, lanza una excepción que el manejador
traduce a 413.

Es el enfoque más robusto de los cuatro —la defensa está antes que tu código— y
el menos visible: quien lea el controlador no ve que hay un límite.

Fíjate en los dos ajustes: `max-file-size` por archivo y `max-request-size` por
petición completa. Sin el segundo, cien archivos de 1 KB pasan el primero.

### ASP.NET Core — comprobación tras leer el formulario

```csharp
var formulario = await peticion.ReadFormAsync();
var archivo = formulario.Files["archivo"];
if (archivo.Length > limite) { ... }
```

Aquí el tamaño se comprueba **después** de leer el formulario, así que depende
del límite del servidor subyacente para la protección real. En producción se
configura en Kestrel o en el servidor de entrada, no en el manejador.

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
