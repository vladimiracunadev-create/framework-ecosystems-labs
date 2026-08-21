# Clase 076 — Auditoría

> [⬅️ 075](../075-secretos-y-configuracion/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [077 ➡️](../077-politica-de-seguridad-de-contenido/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🔴 avanzado** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Dejar rastro de **quién hizo qué**, y que ese rastro sirva después. Las
clases 070 y 071 pusieron controles de acceso; esta clase asume que **algún
control fallará** —o que alguien con permiso legítimo hará algo indebido— y
prepara la respuesta a la única pregunta que importa entonces: *¿quién tocó
esto, y cuándo?* [@adkins-building-secure-reliable].

## 🧩 La situación

Un recurso se crea, se lee y se borra. Al final, el registro de auditoría
tiene **exactamente dos entradas** —la creación y el borrado, no la
lectura—, y cada una nombra actor, acción, recurso e instante.

## 🧮 El contrato

| Petición | Respuesta | Qué mide |
| --- | --- | --- |
| `GET /auditoria` | `total: 0` | el punto de partida |
| `POST /tareas` como `ana` | `201` | un cambio ocurre |
| `GET /tareas/{id}` | `200` | **una lectura ocurre** |
| `DELETE /tareas/{id}` como `luis` | `204` | otro cambio |
| `GET /auditoria` | **`total: 2`** | la lectura **no** dejó rastro |
| `GET /auditoria` | `actor`, `accion`, `recurso` exactos + `instante` **presente** | el registro es utilizable |

El quinto caso es el que mide de verdad: `total: 2` con tres peticiones de
por medio. Un registro que apunta todo —lecturas incluidas— no es más
seguro, es **inservible**: el volumen entierra los dos eventos que
importaban, y el coste de almacenarlo empuja a recortar la retención justo
cuando hace falta mirar atrás.

El instante se comprueba por **presencia, no por valor** (`json_campos_-
presentes`, nuevo en el verificador): predecir una marca de tiempo sería
predecir lo impredecible, pero un registro sin instante no responde
«cuándo», y entonces no responde nada.

## 🌐 Las implementaciones

Las cuatro comparten la decisión que define la clase: **un solo lugar por
donde pasa cada cambio**. Escribir el rastro dentro de cada handler funciona
hasta el handler número siete, que lo olvida — y ese olvido no rompe ninguna
prueba, solo deja un hueco silencioso en el registro.

- **Spring Boot** — la auditoría es un `@Component` inyectado; en producción
  el paso siguiente es `@EntityListeners` o Spring Data Envers, que audita
  **en la capa de persistencia** y no depende de que el handler se acuerde.
- **ASP.NET Core** — servicio *singleton* inyectado, mismo patrón; el
  siguiente paso idiomático es un interceptor de `SaveChanges` en EF Core.
- **Express** y **FastAPI** — una función `registrar` que las escrituras
  llaman. Explícito, visible, y con la misma disciplina como única garantía.

El actor llega por cabecera `X-Actor` para que el contrato lo fije sin montar
el login entero; en una aplicación real sale de la sesión (066) o del token
(067). Lo que **no** cambia: el instante lo pone el servidor. Si lo pusiera
el cliente, el actor podría mentir sobre cuándo hizo lo que hizo.

## 📊 Comparación

| Framework | Dónde vive el registro | El paso siguiente del ecosistema |
| --- | --- | --- |
| Spring Boot | `@Component` inyectado | `@EntityListeners`, Spring Data Envers |
| ASP.NET Core | servicio singleton | interceptor de `SaveChanges` en EF Core |
| Express | módulo con una función | escribirlo tú, o un middleware propio |
| FastAPI | función compartida | dependencia inyectada, o hooks del ORM |

La diferencia real no es de calidad de código sino de **dónde puede vivir el
punto único**. Spring y .NET pueden bajarlo hasta el ORM, donde ningún
camino de escritura lo esquiva; en Express y FastAPI el punto único vive en
la capa de aplicación, y una escritura que baje directamente a la base pasa
por debajo.

## 🧭 Qué hace útil un registro de auditoría

Cuatro campos y tres propiedades:

- **Actor, acción, recurso, instante.** Sin uno de los cuatro, la pregunta
  se queda sin respuesta. Y conviene el **identificador** del recurso, no
  solo su tipo: «alguien borró una tarea» no sirve para reconstruir nada.
- **Solo apéndice.** Se añaden líneas, nunca se editan ni se borran. Un
  registro modificable es un registro que el atacante limpia.
- **Aparte de la base de negocio.** Si quien borró el dato tiene permiso
  sobre la tabla que guarda su rastro, no hay rastro. Almacén distinto,
  credenciales distintas, idealmente cuenta distinta
  [@adkins-building-secure-reliable].
- **Con retención definida.** Un registro que nadie puede pagar acaba
  borrándose entero; uno con política clara —90 días calientes, un año
  frío— sobrevive a la revisión de costes.

## ⚠️ Errores frecuentes

- **Auditar en cada handler.** Se olvida uno y nadie lo nota. El punto único
  no es elegancia: es la diferencia entre un registro completo y uno con
  huecos que no sabes localizar.
- **Auditarlo todo, lecturas incluidas.** Volumen que entierra la señal. Los
  accesos a datos sensibles a veces sí se registran — en un canal aparte y
  por decisión explícita, no por omisión.
- **El instante del cliente.** El actor no fecha sus propios actos.
- **Guardar el registro en la misma tabla que el dato**, con las mismas
  credenciales.
- **Registrar el secreto o el dato completo.** El registro suele tener menos
  protección que la base: guarda qué cambió, no necesariamente a qué valor
  (clase 075).
- **Un registro que nadie lee jamás.** Auditar sin consultar es coleccionar.
  Si no hay un procedimiento que lo mire, no es un control de seguridad.

## ✅ Verificación

```bash
node scripts/run-class.mjs 076
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Añade `PATCH /tareas/{id}` que registre **el cambio, no el estado**:
`{"campo": "titulo", "antes": "pagar", "despues": "pagar la luz"}`. Después
añade el caso que mide lo que esto habilita: reconstruir el valor de un
recurso en un instante dado a partir del registro. Es el salto de «hay
rastro» a «el rastro explica».

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 071 — Autorización por recurso](../071-autorizacion-por-recurso/README.md) — el control que esta clase supone fallable
- [Clase 029 — Registro de peticiones](../../parte-2-la-tuberia/029-registro-de-peticiones/README.md) — el otro registro, y por qué no es este

## Fuentes

- [@adkins-building-secure-reliable] Adkins, H. et al. *Building Secure and Reliable Systems*. O'Reilly Media, 2020. ISBN 9781492083122 — <https://openlibrary.org/isbn/9781492083122>
- [@owasp-asvs] *Application Security Verification Standard* (V7: Error Handling and Logging). OWASP — <https://owasp.org/www-project-application-security-verification-standard/>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Logging). OWASP — <https://cheatsheetseries.owasp.org/>
- [@nist-800-63b] *SP 800-63B — Digital Identity Guidelines*. NIST — <https://pages.nist.gov/800-63-3/sp800-63b.html>
