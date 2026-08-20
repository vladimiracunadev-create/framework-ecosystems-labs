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

## 🌐 Las implementaciones

### Express

```javascript
app.use("/estatico", express.static(path.join(import.meta.dirname, "publico"), {
  maxAge: "1h",
  dotfiles: "deny",
  index: false,
}));
```

Las tres opciones son las tres decisiones de arriba. **`dotfiles: "deny"`** es la
que casi nadie pone: sin ella, un `.env` que acabe en esa carpeta se sirve al
primero que lo pida.

### FastAPI

```python
app.mount("/estatico", StaticFiles(directory=RAIZ), name="estatico")
```

Una línea, y **sin `Cache-Control`**: `StaticFiles` no lo emite. Por eso la
implementación añade una capa intermedia que lo pone.

Es un buen ejemplo de la diferencia entre «funciona» y «está bien»: montar los
estáticos funciona de inmediato, y servirlos con caché es una decisión que hay
que tomar aparte.

### Spring Boot

```java
registro.addResourceHandler("/estatico/**")
        .addResourceLocations("classpath:/publico/")
        .setCacheControl(CacheControl.maxAge(Duration.ofHours(1)).cachePublic());
```

`classpath:` en vez de una ruta del disco: los archivos van **dentro del
artefacto**, no junto a él. Eso hace el despliegue de una pieza —un solo `.jar`
que contiene todo— y a cambio publicar un cambio de logo exige recompilar.

### ASP.NET Core

```csharp
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(...),
    RequestPath = "/estatico",
    OnPrepareResponse = contexto => { ... },
});
```

La abstracción de proveedor de archivos permite servir desde el disco, desde
recursos incrustados o desde un almacenamiento remoto **sin cambiar el resto**.
Es la más flexible de las cuatro y también la más verbosa.

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
