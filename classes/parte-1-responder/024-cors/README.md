# Clase 024 — CORS

> [⬅️ 023](../023-compresion/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [025 ➡️](../025-que-hace-tu-framework-con-el-socket/README.md)
>
> Parte **1 — Responder** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

**Entender el mecanismo antes de configurarlo.** CORS es la fuente de errores más
copiada-y-pegada de la web, y casi todas las soluciones de internet lo desactivan
en lugar de configurarlo.

## 📖 Qué es CORS y qué no es

**Lo que no es:** una defensa de tu servidor. CORS no impide que nadie llame a tu
API. `curl`, un cliente móvil o un script de servidor la llaman igual, sin
preguntar. Cualquiera puede.

**Lo que es:** una regla que aplica **el navegador** para proteger a *sus*
usuarios. Impide que una página de `atacante.example` lea la respuesta de una
petición hecha a `tubanco.example` con las cookies de la víctima.

La distinción es la clave de la clase: **el permiso lo concede tu servidor y lo
hace cumplir el navegador**. Tu servidor solo dice «este origen puede leer mi
respuesta»; quien obedece es el navegador de la víctima.

De ahí se sigue lo importante: **poner `Access-Control-Allow-Origin: *` no abre
tu API — ya estaba abierta.** Lo que hace es permitir que cualquier página web
lea las respuestas desde el navegador de sus visitantes. Si tu API usa cookies de
sesión, eso sí es grave.

## 📖 La comprobación previa

Antes de ciertas peticiones, el navegador manda un `OPTIONS` preguntando si puede:

```text
OPTIONS /datos
Origin: https://permitido.example
Access-Control-Request-Method: GET
Access-Control-Request-Headers: x-token
```

Y espera una respuesta 2xx con los permisos. Dispara esa comprobación cualquier
petición que no sea «simple»: métodos distintos de GET, HEAD o POST, cabeceras
propias como `x-token`, o `content-type: application/json` [@whatwg-fetch].

**Esa última condición explica el 90 % de los errores de CORS**: enviar JSON ya
obliga a la comprobación previa, así que casi cualquier API moderna la necesita
aunque solo haga `GET`.

`Access-Control-Max-Age` permite al navegador recordar el permiso y ahorrarse la
pregunta durante un tiempo.

## 🧩 La situación

`GET /datos` responde `{"ok":true}`. El servidor autoriza a leer esa respuesta
solo a `https://permitido.example`. Cualquier otro origen recibe **los mismos
datos** y **sin la cabecera de autorización** — y es el navegador quien impide
que la página los lea.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `OPTIONS` con origen permitido | `200` o `204` |
| igual | `access-control-allow-origin: https://permitido.example` |
| `GET` con origen permitido | `200` + la misma cabecera |
| `GET` con origen **no** permitido | `200` **sin** la cabecera |

El último caso es el más instructivo: **la respuesta es 200 igualmente**. El
servidor sirve los datos; simplemente no autoriza al navegador a dejar que esa
página los lea. Confirma que CORS no es control de acceso.

## 🔍 Lo que esta clase destapó

El contrato exigía al principio **exactamente 204** para la comprobación previa.
Express respondía 204 y FastAPI 200, y la implementación de FastAPI aparecía como
rota.

No lo estaba. La especificación de Fetch exige un **estado correcto** —cualquier
2xx— y no uno concreto [@whatwg-fetch]. Las dos cumplen.

Fue la segunda aserción sobre-especificada de esta parte, después de la de
`Cache-Control` en la clase 016. De ahí salió el tercer tipo de aserción del
verificador:

| Aserción | Cuándo | Ejemplo |
| --- | --- | --- |
| `estado` | el estándar fija uno | `201` al crear |
| `estado_en` | el estándar admite varios | 2xx en la comprobación previa |

La lección se repite: **una prueba que exige más de lo que el estándar exige mide
la implementación, no el contrato**, y produce rojos que no significan nada.

## 🌐 Las implementaciones

Las cuatro declaran lo mismo: orígenes, métodos, cabeceras y duración.

```javascript
// Express — con función, para no reflejar cualquier origen
origin: (origen, devolver) => devolver(null, origen !== undefined && PERMITIDOS.has(origen)),
```

```python
# FastAPI
allow_origins=["https://permitido.example"], allow_methods=["GET", "POST"], max_age=600
```

```java
// Spring Boot — un filtro con la configuración por patrón de ruta
configuracion.setAllowedOrigins(List.of("https://permitido.example"));
fuente.registerCorsConfiguration("/**", configuracion);
```

```csharp
// ASP.NET Core — políticas con nombre, aplicables por ruta
opciones.AddPolicy("permitidos", politica => politica
    .WithOrigins("https://permitido.example")
    .WithMethods("GET", "POST"));
```

**ASP.NET Core y Spring Boot permiten políticas distintas por ruta.** Es lo que
hace falta cuando parte de tu API es pública y parte no — y lo que evita la
tentación de poner un comodín global.

## 🔬 Comparación

| Framework | Dónde se declara | ¿Políticas por ruta? | Riesgo del camino cómodo |
| --- | --- | --- | --- |
| ASP.NET Core | política con nombre + aplicación | **sí** | registrar y olvidar aplicar |
| Spring Boot | filtro por patrón, o anotación | **sí** | dos configuraciones que se contradicen |
| Express | opciones de la biblioteca | por montaje | `origin: true` refleja cualquier origen |
| FastAPI | capa global | no cómodamente | `allow_origins=["*"]` |

Los dos primeros permiten reglas distintas por ruta, que es lo que hace falta
cuando parte de la API es pública y parte no. Sin esa separación, la tentación es
aplicar la regla más laxa a todo.

## ⚠️ Errores frecuentes

- **`origin: "*"` con credenciales.** El navegador lo rechaza, y con razón: sería
  autorizar a cualquiera a leer respuestas autenticadas.
- **Reflejar el origen recibido sin comprobarlo.** Equivale al comodín, con peor
  aspecto.
- **Creer que CORS protege la API.** No lo hace. La autorización es la clase 070.
- **Olvidar que la comprobación previa necesita atender `OPTIONS`.** Si una capa
  de autenticación intercepta el `OPTIONS` y devuelve 401, CORS falla y el mensaje
  no lo explica.
- **Configurarlo por prueba y error hasta que deje de fallar.** Es cómo se llega
  al comodín.

## ✅ Verificación

```bash
node scripts/run-class.mjs 024
```

## 🧪 Reto de transferencia

Activa las credenciales (`allow_credentials` / `AllowCredentials`) y observa que
el comodín deja de estar permitido. Después explica por qué el navegador impone
esa restricción — está en el contrato de esta clase.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 072 — CSRF](../../parte-5-identidad-y-seguridad/072-csrf/README.md)
- [Módulo 07 — Identidad y seguridad](../../../curriculum/07-identidad-y-seguridad.md)

## Fuentes

- [@whatwg-fetch] *Fetch Standard*, WHATWG — <https://fetch.spec.whatwg.org/>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series*, OWASP Foundation — <https://cheatsheetseries.owasp.org/>
