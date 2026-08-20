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

## 🌐 Las implementaciones

Las cuatro cortan la cadena de la misma forma —responder sin continuar— y el
contador del manejador demuestra que la ejecución nunca llegó allí. La regla es
la misma en los cuatro: **responder sin continuar**.

```javascript
// Express — devolver sin llamar a siguiente()
if (autorizacion !== "Bearer valido") {
  return respuesta.status(401).set("www-authenticate", "Bearer").json({ ... });
}
siguiente();
```

```python
# FastAPI — devolver una respuesta sin await siguiente(peticion)
if peticion.headers.get("authorization") != "Bearer valido":
    return JSONResponse({...}, status_code=401, headers={"www-authenticate": "Bearer"})
return await siguiente(peticion)
```

```csharp
// ASP.NET Core — escribir la respuesta y no llamar a siguiente()
if (contexto.Request.Headers.Authorization != "Bearer valido")
{
    contexto.Response.StatusCode = 401;
    await contexto.Response.WriteAsJsonAsync(new { ... });
    return;
}
await siguiente();
```

```java
// Spring Boot — no llamar a cadena.doFilter
if (!"Bearer valido".equals(p.getHeader("Authorization"))) {
    r.setStatus(401);
    r.getWriter().write("...");
    return;
}
cadena.doFilter(peticion, respuesta);
```

**Los cuatro son la misma idea con cuatro sintaxis.** Y ninguno necesita un
mecanismo especial: cortar es simplemente no continuar.

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
