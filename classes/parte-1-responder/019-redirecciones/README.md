# Clase 019 — Redirecciones

> [⬅️ 018](../018-negociacion-de-contenido/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [020 ➡️](../020-servir-archivos-estaticos/README.md)
>
> Parte **1 — Responder** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Distinguir **permanente de temporal** y saber **cuál conserva el método**. Son
dos ejes independientes, y confundirlos causa dos de los fallos más difíciles de
revertir que existen en la web.

## 📖 Los cuatro códigos, en dos ejes

| | Conserva el método | Puede cambiarlo a GET |
| --- | --- | --- |
| **Permanente** | `308` | `301` |
| **Temporal** | `307` | `302` |

El eje de arriba es histórico y merece contarse: `301` y `302` se definieron
antes de que se aclarara qué debía pasar con un `POST` redirigido. Los
navegadores lo convertían en `GET`, la especificación no lo decía, y así se quedó
[@rfc9110]. `307` y `308` se añadieron para tener el comportamiento **explícito**.

**Regla práctica:** si rediriges algo que no es un `GET`, usa `307` o `308`. Con
`302`, el cuerpo del `POST` desaparece.

## ⚠️ El `301` es casi irreversible

Un `301` autoriza al cliente a **recordar el destino y no volver a preguntar**.
Los navegadores lo guardan en caché, a veces indefinidamente.

Si publicas un `301` por error, no basta con retirarlo: los navegadores que ya lo
vieron seguirán yendo al destino equivocado, sin consultar tu servidor. **La
corrección no llega a quien más la necesita.**

Por eso la recomendación es empezar siempre con `302` o `307` y pasar a
permanente solo cuando el cambio esté consolidado.

## 🧩 La situación

`GET /antigua` manda al cliente a `/nueva` **para siempre**. `GET /temporal` lo
manda **por ahora**. Y `POST /temporal-estricta` lo manda conservando el método y
el cuerpo, que es lo que `302` no garantiza.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /antigua` | `301` · `location: /nueva` |
| `GET /temporal` | `302` · `location: /nueva` |
| `POST /temporal-estricta` | `307` · `location: /nueva` |
| `GET /nueva` | `200` · `{"destino":"nueva"}` |
| `POST /nueva` | `200` · `{"destino":"nueva","metodo":"POST"}` |

Los dos últimos casos comprueban que **el destino existe y atiende ambos
métodos**, que es lo que hace verificable el 307.

## 🌐 Las implementaciones — el código a la vista

Los cuatro emiten las mismas tres redirecciones. Lo que cambia es **cuánto hay
que saber de memoria para leer el código**.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
app.get("/antigua", (peticion, respuesta) => respuesta.redirect(301, "/nueva"));
```

```javascript
app.get("/temporal", (peticion, respuesta) => respuesta.redirect(302, "/nueva"));
```

```javascript
app.post("/temporal-estricta", (peticion, respuesta) => respuesta.redirect(307, "/nueva"));
```

Un ayudante, y el código va primero. Es lo más breve del elenco — y para
entenderlo hay que saber qué significan `301`, `302` y `307`.

Los comentarios del propio archivo dicen por qué importa:

```javascript
// 301: movido para siempre. El cliente puede recordar el destino y no volver a
```

**El `301` es el más peligroso de los tres**: el cliente puede memorizar el
destino y no volver a preguntar, así que retirarlo después no siempre funciona
— los navegadores lo cachean de forma persistente.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
@app.get("/antigua")
def antigua() -> RedirectResponse:
    return RedirectResponse("/nueva", status_code=301)
```

```python
@app.post("/temporal-estricta")
def estricta() -> RedirectResponse:
    # 307 conserva método y cuerpo: el POST sigue siendo POST tras el salto.
    return RedirectResponse("/nueva", status_code=307)
```

Un **tipo de respuesta** en lugar de un método sobre el objeto respuesta:
`RedirectResponse` es un valor que se devuelve, no un efecto que se provoca. La
diferencia se nota al probar — se puede construir y examinar sin servidor.

El código sigue siendo un número.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
    private static ResponseEntity<Void> saltar(HttpStatus codigo, String destino) {
        return ResponseEntity.status(codigo).location(URI.create(destino)).build();
    }
```

```java
    @GetMapping("/antigua")
    public ResponseEntity<Void> antigua() {
        return saltar(HttpStatus.MOVED_PERMANENTLY, "/nueva");
    }
```

```java
    @PostMapping("/temporal-estricta")
    public ResponseEntity<Void> estricta() {
        return saltar(HttpStatus.TEMPORARY_REDIRECT, "/nueva");
    }
```

**No hay atajo para redirigir**, así que la implementación escribe el suyo. Y ese
ayudante de dos líneas es lo que revela la estructura: una redirección es un
código más una cabecera `Location`, nada más.

A cambio, la constante tiene nombre: `MOVED_PERMANENTLY` y `TEMPORARY_REDIRECT`
se leen sin consultar la tabla. `ResponseEntity<Void>` declara además que no hay
cuerpo, que es lo correcto en una redirección.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
app.MapGet("/antigua", () => Results.Redirect("/nueva", permanent: true));
app.MapGet("/temporal", () => Results.Redirect("/nueva", permanent: false));
app.MapPost("/temporal-estricta",
    () => Results.Redirect("/nueva", permanent: false, preserveMethod: true));
```

**El único de los cuatro que nombra los dos ejes.** No escribes `307`: escribes
«temporal, conservando el método», y el framework traduce.

Y son exactamente dos ejes, no una lista de códigos que memorizar:

| ¿Permanente? | ¿Conserva el método? | Código |
| --- | --- | ---: |
| no | no | `302` |
| sí | no | `301` |
| no | sí | `307` |
| sí | sí | `308` |

Quien lee `permanent: false, preserveMethod: true` entiende la intención sin
saberse la tabla. Los otros tres exigen conocerla. Es una diferencia pequeña en
el código y grande en la legibilidad — el tipo de detalle que Ousterhout
identifica como el valor real de una buena interfaz [@ousterhout-philosophy].

## 🔬 Comparación

| Framework | Cómo se expresa | ¿Nombra los ejes? |
| --- | --- | --- |
| ASP.NET Core | `permanent` + `preserveMethod` | **sí** |
| Spring Boot | constante `HttpStatus.TEMPORARY_REDIRECT` | a medias |
| Express | número | no |
| FastAPI | número | no |

## ⚠️ Errores frecuentes

- **`301` por error.** Los clientes lo recuerdan y la corrección no les llega.
- **`302` sobre un `POST`.** El cuerpo se pierde al saltar.
- **Redirección relativa mal formada.** `nueva` y `/nueva` no son lo mismo desde
  una ruta profunda.
- **Bucles.** `/a` → `/b` → `/a`. El navegador corta tras unos cuantos saltos, y
  el diagnóstico es confuso.
- **Redirigir a un destino que da 404.** Por eso el contrato lo comprueba.

## ✅ Verificación

```bash
node scripts/run-class.mjs 019
```

## 🧪 Reto de transferencia

Añade `308` —permanente conservando el método— y comprueba con `curl -L -X POST`
que el cuerpo llega al destino. Después haz lo mismo con `301` y observa la
diferencia.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 140 — La higuera estranguladora](../../parte-11-legado-migracion-y-decision/140-la-higuera-estranguladora/README.md)
- [Módulo 01 — HTTP, eventos y contratos](../../../curriculum/01-http-eventos-y-contratos.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*. Yaknyam Press, 2018. ISBN 9781732102200 — <https://openlibrary.org/isbn/9781732102200>
