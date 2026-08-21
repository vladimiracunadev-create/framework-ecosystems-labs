# Clase 071 — Autorización por recurso

> [⬅️ 070](../070-autorizacion-por-rol/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [072 ➡️](../072-csrf/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🔴 avanzado** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Comprobar **la propiedad del dato, no solo el rol**. El fallo que esta clase
mide tiene nombre propio —IDOR, *Insecure Direct Object Reference*— y es la
forma más común del riesgo n.º 1 de OWASP: cambiar el `1` de la URL por un
`2` y leer lo que no es tuyo [@owasp-top10].

## 🧩 La situación

`ana` y `luis` tienen **el mismo rol**. La tarea 1 es de ella; la 2, de él.
Una comprobación por rol —la clase 070 entera— los deja pasar a los dos: el
rol responde «qué clase de usuario eres», y la pregunta aquí es **«¿es tuyo
este dato?»**.

## 🧮 El contrato

| Petición | Respuesta | Qué mide |
| --- | --- | --- |
| `GET /tareas/1` sin identidad | `401` | primero, quién eres |
| `ana` pide **su** tarea | `200` | el camino feliz |
| `luis` — mismo rol — pide la tarea de `ana` | **`404`** | la propiedad, no el rol |
| `luis` pide la tarea `999`, que no existe | **`404`** | …indistinguible de la anterior |
| `GET /tareas` como `luis` | `total: 1` | la lista también filtra |
| `luis` **borra** la tarea de `ana` | `404` | leer y escribir, la misma regla |
| `ana` vuelve a pedir su tarea | `200` | el borrado ajeno no ocurrió |

Los casos tercero y cuarto son la pareja fina: la tarea ajena responde
**exactamente igual** que la inexistente. Un `403` sería más «correcto»
semánticamente — y confirmaría al atacante que el identificador existe, que
con identificadores enumerables es media enumeración de tu base de datos
[@owasp-cheatsheets]. Para recursos privados, «no es tuyo» y «no existe»
deben ser la misma respuesta.

## 📖 La regla vive en la consulta

Las cuatro implementaciones comparten un gesto, y es el corazón de la clase:

```sql
-- no así:                       -- así:
SELECT * FROM tareas             SELECT * FROM tareas
WHERE id = ?                     WHERE id = ? AND propietaria = ?
-- …y luego if (t.duena != yo)
```

No es «buscar y luego comprobar»: es que para este usuario, la tarea ajena
**directamente no se encuentra**. La diferencia importa por tres razones:

1. **No hay ventana** entre buscar y comprobar en la que el dato ya salió
   del almacén hacia el código.
2. **No se puede olvidar**: si el repositorio solo ofrece
   `buscar(id, usuario)`, el handler no tiene forma de saltarse la regla.
3. **El 404 sale gratis**: no encontrado y no autorizado son, literalmente,
   el mismo camino de código.

## 🌐 Las implementaciones

A diferencia de la 070, aquí los cuatro frameworks están **igual de
desnudos** — y eso es el hallazgo: la configuración declarativa
(`hasRole`, políticas, middleware) no puede responder «¿es tuyo?», porque la
respuesta depende del dato, no de la ruta. Spring Security y las políticas
de ASP.NET siguen ahí, pero solo contestan la primera pregunta (quién eres);
la segunda vive en `buscar(id, usuario)` en los cuatro códigos, casi
idéntica.

Existen mecanismos declarativos para esto —`@PostAuthorize` en Spring,
`IAuthorizationHandler` con requisitos de recurso en ASP.NET— y comparten un
defecto: comprueban **después de cargar** el dato, uno a uno. Sirven para el
detalle; para la lista, la única respuesta que escala es el filtro en la
consulta.

## 📊 Comparación

| Framework | Quién eres | Es tuyo | El mecanismo declarativo que existe |
| --- | --- | --- | --- |
| Express | middleware propio | en la consulta | — |
| FastAPI | `HTTPBasic` + `Depends` | en la consulta | — |
| Spring Boot | Spring Security | en la consulta | `@PostAuthorize` (tras cargar) |
| ASP.NET Core | esquema propio + `RequireAuthorization` | en la consulta | `IAuthorizationHandler` (tras cargar) |

## ⚠️ Errores frecuentes

- **Confiar en que el identificador es difícil de adivinar.** No es control
  de acceso; los UUID ayudan contra la enumeración pero no autorizan nada.
- **`403` para lo ajeno.** Confirma la existencia. Para recursos privados,
  `404`.
- **Filtrar la lista en el cliente.** La API devuelve todo y la interfaz
  esconde: el contrato de esta clase pega contra la API y lo ve.
- **Proteger la lectura y olvidar la escritura.** El sexto caso existe
  porque `DELETE`, `PUT` y `PATCH` sufren el mismo IDOR que `GET`.
- **Comprobar la propiedad en el handler, dato ya en mano.** Funciona hasta
  que alguien escribe el segundo handler y no copia el `if`. La regla va en
  el repositorio.
- **Un rol de soporte con acceso a todo, sin registro.** Existirá; la clase
  076 (auditoría) es su contrapeso.

## ✅ Verificación

```bash
node scripts/run-class.mjs 071
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Añade **compartir**: `POST /tareas/1/compartir` con `{"con": "luis"}` hace
que `luis` pueda **leer** (no borrar) la tarea 1. La propiedad deja de ser
una columna y se convierte en una relación — y `buscar(id, usuario)` tiene
que aprender la diferencia entre leer y escribir. Mide con el contrato que
compartir no le dio el `DELETE`.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 070 — Autorización por rol](../070-autorizacion-por-rol/README.md) —
  la primera mitad de la pregunta
- [Clase 076 — Auditoría](../076-auditoria/README.md) — quién accedió a qué,
  para cuando el control falla

## Fuentes

- [@owasp-top10] *OWASP Top 10* (A01: Broken Access Control). OWASP — <https://owasp.org/www-project-top-ten/>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Authorization, IDOR Prevention). OWASP — <https://cheatsheetseries.owasp.org/>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
