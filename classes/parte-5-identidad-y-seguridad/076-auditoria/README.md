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

## 🌐 Las implementaciones — el código a la vista

Las cuatro comparten la decisión que define la clase: **un solo lugar por donde
pasa cada cambio**. Escribir el rastro dentro de cada manejador funciona hasta
el manejador número siete, que lo olvida — y ese olvido no rompe ninguna
prueba: solo deja un hueco silencioso en el registro.

Lo que cambia entre los cuatro es **qué mecanismo del framework sostiene ese
único lugar**.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — una función

```javascript
function registrar(peticion, accion, recurso, id) {
  auditoria.push({
    actor: peticion.get("x-actor") ?? "anonimo",
    accion,
    recurso,
    recurso_id: String(id),
    instante: new Date().toISOString(),
  });
}
```

```javascript
  tareas.set(id, tarea);
  registrar(peticion, "crear", "tarea", id);
```

```javascript
  tareas.delete(peticion.params.id);
  registrar(peticion, "borrar", "tarea", peticion.params.id);
```

Explícito y visible — y con **la disciplina como única garantía**. Nada impide
añadir mañana un `PUT /tareas/:id` que no llame a `registrar`.

Fíjate también en la lectura:

```javascript
  if (!tarea) return respuesta.status(404).json({ error: "no-encontrada" });
```

**Leer no se audita.** La auditoría registra *cambios*. Los accesos a datos
sensibles a veces sí se registran, pero en un canal aparte y con otro propósito;
esta clase mide la auditoría de cambios, que es la universal.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — la misma función, y el actor como parámetro

```python
def registrar(actor: str, accion: str, recurso: str, recurso_id: str) -> None:
    auditoria.append({
        "actor": actor or "anonimo",
        "accion": accion,
        "recurso": recurso,
        "recurso_id": recurso_id,
        # El instante lo pone el SERVIDOR: un actor no fecha sus propios actos.
        "instante": datetime.now(timezone.utc).isoformat(),
    })
```

Idéntica a Express salvo en un detalle que sí importa: **el actor llega como
argumento**, no se saca de la petición dentro de la función. Eso deja
`registrar` sin dependencia del framework — se puede probar sin montar un
servidor, que es la idea de la clase 065.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — un componente inyectado

```java
    @Component
    public static class Auditoria {
        private final List<Map<String, String>> registros = new CopyOnWriteArrayList<>();

        public void registrar(String actor, String accion, String recurso, String id) {
```

La auditoría deja de ser una función suelta y pasa a ser **una pieza del
contenedor** (clase 036): quien la necesite la pide y el framework la entrega.
`CopyOnWriteArrayList` resuelve de paso lo que Express y FastAPI no tienen que
resolver — varios hilos escribiendo a la vez.

En producción el paso siguiente es `@EntityListeners` o Spring Data Envers, que
auditan **en la capa de persistencia**: el rastro deja de depender de que el
manejador se acuerde, porque lo dispara el propio guardado.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — servicio singleton

```csharp
constructor.Services.AddSingleton<Auditoria>();
```

```csharp
app.MapPost("/tareas", (Cuerpo? cuerpo, HttpRequest peticion, Auditoria auditoria) =>
```

```csharp
        lock (_candado) { _registros.Add(registro); }
```

Mismo patrón que Spring, con el ciclo de vida **declarado en la línea de
registro** en lugar de deducido de una anotación: `AddSingleton` dice
literalmente que hay una sola instancia para todo el proceso — la distinción de
la clase 037. Y la inyección ocurre en la firma del manejador, no en el
constructor de una clase.

El siguiente paso idiomático aquí es un interceptor de `SaveChanges` en Entity
Framework Core: el equivalente exacto de los *entity listeners* de Spring.

### Las dos reglas que no cambian en ninguna

```javascript
    instante: new Date().toISOString(),
```

**El instante lo pone el servidor.** Si lo pusiera el cliente, el actor podría
mentir sobre cuándo hizo lo que hizo — y un registro que el auditado puede
fechar no es una auditoría.

Y la segunda, que en el laboratorio es una lista en memoria pero en producción
decide si el registro sirve de algo: **almacén de solo apéndice y aparte de la
base de negocio**. Si quien borró la tarea puede borrar también su rastro, el
rastro no protege de nada.

> El actor llega por la cabecera `X-Actor` para que el contrato pueda fijarlo
> sin montar el inicio de sesión entero. En una aplicación real sale de la
> sesión (clase 066) o del token (clase 067) — nunca de algo que el cliente
> escriba libremente.

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
