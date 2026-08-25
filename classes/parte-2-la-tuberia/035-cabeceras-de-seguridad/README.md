# Clase 035 — Cabeceras de seguridad

> [⬅️ 034](../034-limitacion-de-tasa/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [036 ➡️](../036-inyeccion-de-dependencias/README.md)
>
> Parte **2 — La tubería** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Aplicar **las defensas que el navegador respeta si se las pides**, y entender qué
protege cada una — no copiar cinco líneas de una guía.

## 🧩 La situación

Toda respuesta lleva cinco cabeceras de seguridad y **no** lleva la firma del
servidor.

## 📖 Las cinco, y qué evita cada una

| Cabecera | Qué impide |
| --- | --- |
| `x-content-type-options: nosniff` | Que el navegador adivine el tipo por el contenido y ejecute como script algo servido como texto |
| `x-frame-options: DENY` | Que tu página se incruste en un marco ajeno y el usuario pulse sin saber dónde |
| `strict-transport-security` | Que una visita posterior use HTTP y sea interceptable |
| `content-security-policy` | Que se cargue o ejecute lo que no has autorizado |
| `referrer-policy: no-referrer` | Que la URL completa —con sus parámetros— se filtre al salir del sitio |

Las cinco están recogidas en las guías de OWASP [@owasp-cheatsheets], y las cinco
comparten una propiedad que conviene tener clara:

> **Son instrucciones para el navegador, no defensas del servidor.**

Un cliente que no sea un navegador las ignora por completo. Protegen a **tus
usuarios** de ataques que se ejecutan en su navegador — no protegen tu API de un
atacante con `curl`. Es la misma distinción que la clase 024 hacía con CORS.

## 🔒 La que más protege y más cuesta

`content-security-policy` es la única de las cinco que **puede romper tu
aplicación**, y por eso es la que más se omite.

La política de esta clase, `default-src 'none'`, no permite cargar absolutamente
nada. Sirve para una API que solo devuelve JSON. En una aplicación con interfaz
hay que enumerar orígenes, y ahí es donde aparece la fricción: un script en
línea, un estilo incrustado o un recurso de un tercero dejan de funcionar.

La forma sensata de adoptarla es en dos pasos: **primero en modo informe**
—`content-security-policy-report-only`, que no bloquea y avisa—, se recoge lo que
habría roto, y después se activa. La clase 077 lo desarrolla.

## 🧮 El contrato

Las cinco cabeceras presentes, y `x-powered-by` **ausente**.

Esa última no es una defensa: quitar la firma del servidor no impide nada. Es
**no regalar información**: la versión exacta del framework le dice al atacante
qué vulnerabilidades conocidas probar primero. Cuesta una línea y ahorra un paso
de reconocimiento.

## 🌐 Las implementaciones — el código a la vista

Las cuatro ponen las mismas cinco cabeceras en una sola capa. Lo que separa a las
implementaciones son dos detalles pequeños con consecuencias grandes.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — la lista, comentada

```javascript
const CABECERAS = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
  "referrer-policy": "no-referrer",
};
```

```javascript
app.use((peticion, respuesta, siguiente) => {
  for (const [nombre, valor] of Object.entries(CABECERAS)) respuesta.set(nombre, valor);
  respuesta.removeHeader("x-powered-by");
  siguiente();
});
```

Ninguna de las cinco es una defensa del servidor: **son instrucciones que el
navegador aplica si se las pides**. Un cliente que no sea un navegador las ignora
por completo, y por eso no sustituyen a nada de la parte 5.

Y una línea que solo tiene Express: `removeHeader("x-powered-by")`. Express
anuncia por omisión que es Express. Quitarlo **no es una defensa** —quien ataca
prueba igual— y es información gratis que no hace falta regalar.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — el detalle que importa

```python
    respuesta = await siguiente(peticion)
    for nombre, valor in CABECERAS.items():
        respuesta.headers.setdefault(nombre, valor)
    return respuesta
```

**`setdefault` y no asignación directa.**

Si un manejador concreto puso una política más estricta para su ruta —la clase
077 hace exactamente eso con un nonce por respuesta—, la capa general **no debe
pisarla**. Con asignación, la capa, que corre después, borraría la decisión más
informada.

Es un patrón que vale para cualquier capa transversal: **poner un valor por
omisión, no imponer un valor**. Las otras tres implementaciones asignan, y ese es
un fallo latente que el contrato de esta clase no llega a destapar porque ninguna
ruta compite.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — y el aviso honesto

```java
            r.setHeader("X-Content-Type-Options", "nosniff");
            r.setHeader("X-Frame-Options", "DENY");
            r.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
            r.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
            r.setHeader("Referrer-Policy", "no-referrer");
```

**Spring Security trae estas cinco cabeceras puestas y bien configuradas.** Aquí
se escriben a mano para que se vean.

En un proyecto real, **añadir Spring Security es la respuesta correcta**: las trae
activadas por omisión y añade mucho más. Escribir el filtro a mano es un
ejercicio, no una recomendación — y decirlo es parte de la clase, porque un
laboratorio que enseña a reimplementar lo que el ecosistema ya resolvió enseña
mal.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
    cabeceras["X-Content-Type-Options"] = "nosniff";
    cabeceras["X-Frame-Options"] = "DENY";
    cabeceras["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
    cabeceras["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'";
    cabeceras["Referrer-Policy"] = "no-referrer";
    cabeceras.Remove("Server");
```

Igual que Express, con `Remove("Server")` en el papel del `x-powered-by`. Y una
diferencia real de plataforma: **en .NET la cabecera `Server` la emite Kestrel**,
así que quitarla desde la aplicación funciona pero lo idiomático es apagarla en
las opciones del servidor —`AddServerHeader = false`—, un nivel más abajo.

## 🔬 Comparación

| Framework | ¿Trae alguna por omisión? | Solución habitual |
| --- | --- | --- |
| Spring Boot | con Spring Security, **todas** | añadir Spring Security |
| ASP.NET Core | ninguna | capa propia o biblioteca |
| Express | ninguna, y **añade `x-powered-by`** | biblioteca conocida |
| FastAPI | ninguna | capa propia |

**Tres de cuatro no traen ninguna.** Y Express va más allá: añade `x-powered-by:
Express` por su cuenta, que es exactamente lo contrario de lo que conviene.

Esa fila resume el criterio del
[módulo 11](../../../curriculum/11-seleccion-y-sostenibilidad.md): **los valores
por omisión de un framework dicen qué priorizó quien lo escribió**. Express
priorizó no estorbar; Spring Security priorizó la defensa. Ninguno se equivoca —
hay que saber cuál te tocó.

## ⚠️ Errores frecuentes

- **Copiar las cinco sin saber qué hacen.** La primera que rompa algo se
  desactiva sin entender qué se pierde.
- **Activar la política de contenido de golpe** en una aplicación con interfaz.
- **`strict-transport-security` sin HTTPS bien montado.** El navegador recuerda
  la instrucción y el sitio queda inaccesible.
- **Creer que protegen la API.** Solo actúan en el navegador.
- **Dejar `x-powered-by`.** Información gratis para quien hace reconocimiento.

## ✅ Verificación

```bash
node scripts/run-class.mjs 035
```

## 🧪 Reto de transferencia

Sirve una página HTML con un script en línea y comprueba que la política la
bloquea. Después añade el origen mínimo que lo permita, **sin usar `unsafe-inline`**
—que anularía la protección— y explica qué mecanismo usaste en su lugar.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 077 — Política de seguridad de contenido](../../parte-5-identidad-y-seguridad/077-politica-de-seguridad-de-contenido/README.md)
- [Módulo 07 — Identidad y seguridad](../../../curriculum/07-identidad-y-seguridad.md)

## Fuentes

- [@owasp-cheatsheets] *OWASP Cheat Sheet Series*, OWASP Foundation — <https://cheatsheetseries.owasp.org/>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
- [@mdn-web-docs] *MDN Web Docs*, Mozilla — <https://developer.mozilla.org/>
