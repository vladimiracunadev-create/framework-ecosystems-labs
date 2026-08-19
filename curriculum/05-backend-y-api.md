---
modulo: "05"
titulo: Backend y API
nivel: intermedio
horas: 20
prerrequisitos: ["01", "02"]
verificado: 2026-08-19
fuentes: [geewax-api-design-patterns, richardson-amundsen-restful, openapi-spec, json-schema, rfc9457, rfc8259, newman-building-microservices, fowler-microservice-tradeoffs]
---

# Módulo 05 — Backend y API

> Este es el módulo donde el mismo contrato se implementa en dos ecosistemas y
> se comparan con las mismas pruebas. Todo lo anterior existía para que esta
> comparación signifique algo.

## Prerrequisitos y nivel

**Nivel:** intermedio. **Duración:** 20 horas. Requiere los módulos 01 y 02.

## Objetivos observables

1. Escribir un contrato completo en OpenAPI antes de implementar
   [@openapi-spec].
2. Validar la entrada contra un esquema y traducir el fallo a una respuesta
   normalizada [@json-schema], [@rfc9457].
3. Implementar TaskFlow en dos ecosistemas y pasar las **mismas** pruebas de
   aceptación.
4. Diseñar la evolución del contrato sin romper a los clientes existentes
   [@geewax-api-design-patterns].
5. Justificar cuándo un servicio debe separarse y cuándo no
   [@fowler-microservice-tradeoffs].

## Concepto independiente del framework

Una API es un **contrato**: un conjunto de promesas sobre qué mensajes acepta,
qué mensajes devuelve y qué garantiza sobre el estado. El framework es el medio
para cumplirlo; la promesa existe antes que él.

```mermaid
flowchart LR
  C["Contrato<br/>OpenAPI + esquemas"] --> P["Pruebas de aceptación<br/>derivadas del contrato"]
  C --> I1["Implementación A"]
  C --> I2["Implementación B"]
  P --> I1
  P --> I2
  I1 --> R["Comparación válida"]
  I2 --> R
```

Si las pruebas se derivan de la implementación en lugar del contrato, cada
implementación aprueba su propio examen y la comparación no dice nada. El
contrato incluye también cómo se descubren y relacionan los recursos: una API
que obliga al cliente a construir URL a mano acopla al cliente con la estructura
interna del servidor [@richardson-amundsen-restful].

### ¿Un servicio o varios?

Separar un servicio compra independencia de despliegue y paga con latencia,
fallos parciales, consistencia eventual y una superficie de operación mucho
mayor [@newman-building-microservices]. La pregunta previa no es «¿cómo lo
dividimos?» sino «¿qué problema tenemos hoy que la división resuelve y que un
módulo bien delimitado no resuelve?» [@fowler-microservice-tradeoffs].

### Las cuatro capas que todo backend tiene

| Capa | Responsabilidad | Depende de | No debe conocer |
| --- | --- | --- | --- |
| **Transporte** | Traducir mensajes HTTP a llamadas | El framework | Reglas de negocio |
| **Aplicación** | Orquestar el caso de uso, la transacción | El dominio | El framework HTTP |
| **Dominio** | Las reglas que serían ciertas en papel | Nada | Todo lo demás |
| **Infraestructura** | Persistencia, mensajería, terceros | Interfaces del dominio | Los casos de uso |

En un servicio pequeño estas capas pueden ser cuatro carpetas o cuatro funciones.
Lo que no puede es faltar la **dirección** de las dependencias: hacia el dominio,
nunca desde él.

### Evolución sin ruptura

| Cambio | ¿Rompe? | Cómo se hace |
| --- | --- | --- |
| Añadir un campo opcional a la respuesta | No | Los clientes ignoran lo que no conocen |
| Añadir un campo obligatorio a la petición | **Sí** | Añadir como opcional, migrar, luego exigir |
| Cambiar el tipo de un campo | **Sí** | Campo nuevo, ambos convivan, retirar el antiguo con aviso |
| Quitar un campo de la respuesta | **Sí** | Marcar obsoleto, medir su uso, retirar tras un plazo publicado |
| Cambiar un código de error | **Sí** | Los códigos son parte del contrato [@rfc9457] |
| Añadir un recurso nuevo | No | Nadie dependía de él |

La regla operativa: **puedes añadir lo opcional y no puedes quitar lo prometido**
[@geewax-api-design-patterns].

## Anatomía comparada

El mismo `POST /tasks` en los laboratorios del repositorio:

| Aspecto | Express | FastAPI | Spring Boot | ASP.NET Core |
| --- | --- | --- | --- | --- |
| Definición del contrato | Documento aparte, verificado en pruebas | Derivado de los tipos declarados | Anotaciones más documento | Anotaciones más documento |
| Validación de entrada | Explícita o con biblioteca | Automática desde el tipo | Anotaciones sobre el objeto | Anotaciones y enlace del modelo |
| Forma del error | La define quien escribe | Estructura del framework, adaptable | Consejo de controlador | Filtro y `ProblemDetails` |
| Idempotencia | Implementada a mano | Implementada a mano | Implementada a mano | Implementada a mano |
| Código propio para el contrato | Más | Menos | Medio | Medio |
| Dónde vive el riesgo | En lo que olvidas escribir | En lo que asume el framework | En la configuración | En la configuración |

La última fila resume el compromiso del módulo entero: **lo explícito falla por
omisión y lo implícito falla por sorpresa**. Ninguna de las dos es gratis.

## Implementación mínima

Fragmento del contrato canónico del repositorio, en
[`contracts/taskflow/openapi.yaml`](../contracts/taskflow/openapi.yaml):

```yaml
paths:
  /tasks:
    post:
      operationId: createTask
      parameters:
        - name: Idempotency-Key
          in: header
          required: false
          schema: { type: string, maxLength: 128 }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: "#/components/schemas/TaskCreate" }
      responses:
        "201":
          description: Tarea creada
          headers:
            Location: { schema: { type: string } }
        "422":
          description: Entrada válida como JSON pero inválida como tarea
```

Validación derivada del esquema, sin dependencias [@json-schema]:

```javascript
// validar.mjs — validación mínima explícita, con errores por campo
export function validarTaskCreate(entrada) {
  const errores = [];
  if (typeof entrada !== "object" || entrada === null) {
    return [{ field: "", code: "BODY_NOT_OBJECT" }];
  }
  const { title, done } = entrada;
  if (typeof title !== "string") errores.push({ field: "title", code: "TITLE_REQUIRED" });
  else if (title.trim().length === 0) errores.push({ field: "title", code: "TITLE_EMPTY" });
  else if (title.length > 200) errores.push({ field: "title", code: "TITLE_TOO_LONG" });
  if (done !== undefined && typeof done !== "boolean") errores.push({ field: "done", code: "DONE_NOT_BOOLEAN" });
  return errores;
}

// El error se emite con una forma estable y sin filtrar detalles internos.
export function problema(status, code, errores = []) {
  return {
    type: `https://example.org/problemas/${code.toLowerCase()}`,
    title: code,
    status,
    errors: errores, // por campo: la interfaz necesita saber cuál falló
  };
}
```

El error lleva el campo culpable. Sin esa granularidad, la interfaz accesible del
módulo 03 no puede asociar el mensaje al control correspondiente.

## Pruebas compartidas

Las de `contracts/taskflow/ACCEPTANCE.md`, idénticas para toda implementación:

```javascript
// aceptacion.test.mjs — se ejecuta contra CUALQUIER implementación
import assert from "node:assert/strict";
import { test } from "node:test";

const BASE = process.env.TASKFLOW_URL ?? "http://localhost:3000";

test("crear tarea devuelve 201 y Location", async () => {
  const res = await fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: "Comparar dos ecosistemas" }),
  });
  assert.equal(res.status, 201);
  assert.match(res.headers.get("location") ?? "", /^\/tasks\/.+/);
});

test("la misma clave de idempotencia no crea dos tareas", async () => {
  const enviar = () =>
    fetch(`${BASE}/tasks`, {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": "k-fija" },
      body: JSON.stringify({ title: "Una sola vez" }),
    });
  const primera = await enviar();
  const segunda = await enviar();
  const a = await primera.json();
  const b = await segunda.json();
  assert.equal(a.id, b.id); // mismo recurso, no uno nuevo
});

test("el error indica el campo que falló", async () => {
  const res = await fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: "" }),
  });
  assert.equal(res.status, 422);
  const cuerpo = await res.json();
  assert.ok(cuerpo.errors.some((e) => e.field === "title"));
});
```

Estas pruebas usan solo `fetch` y el ejecutor del runtime: se lanzan contra
cualquier implementación, en cualquier lenguaje, sin adaptador.

## Seguridad y accesibilidad

- **Validar en el límite, siempre.** La validación del cliente es comodidad; la
  del servidor es la única que protege. Todo campo que entra se valida en tipo,
  rango y tamaño [@json-schema].
- **Errores que no filtran.** El cuerpo del error nunca lleva la consulta, la
  traza ni la ruta interna. La forma normalizada [@rfc9457] existe justamente
  para dar información útil sin filtrar el interior.
- **Límites explícitos.** Tamaño del cuerpo, longitud de cada campo, número de
  elementos de una lista y ritmo de peticiones. Un límite ausente es un límite
  que fija el atacante.
- **Idempotencia como propiedad de seguridad.** Sin ella, un reintento
  automático puede duplicar un cargo o una reserva.
- **Accesibilidad desde la API.** Un `422` que solo dice «datos inválidos»
  impide construir una interfaz accesible. El error por campo es un requisito de
  accesibilidad, no un lujo del backend.

## Errores frecuentes y diagnóstico

| Síntoma | Causa | Diagnóstico |
| --- | --- | --- |
| El cliente rompe tras un despliegue «compatible» | Se cambió un código o se quitó un campo | Revisa la tabla de evolución: solo lo opcional es aditivo |
| Documentación que no coincide con el servidor | El contrato se escribió después | Deriva las pruebas del contrato [@openapi-spec] |
| `500` ante entradas raras | Validación incompleta | Prueba con tipos inesperados, no solo con valores vacíos |
| La interfaz no puede señalar el campo con error | Error sin granularidad | Devuelve `errors[]` con `field` y `code` |
| Cargos duplicados tras un tiempo de espera | Falta idempotencia | Implementa y prueba `Idempotency-Key` |
| Se separó en servicios y todo empeoró | Se asumió beneficio sin coste | Revisa los compromisos antes de dividir [@fowler-microservice-tradeoffs] |
| Cada servicio inventa su forma de error | Sin contrato transversal | Normaliza el formato en toda la organización |
| Un JSON con números grandes pierde precisión | Suposición sobre el tipo numérico [@rfc8259] | Usa cadena para identificadores y cantidades exactas |

## Comprobación de recuerdo

1. ¿Por qué las pruebas deben derivar del contrato y no de la implementación?
2. Nombra tres cambios que rompen a un cliente y uno que no.
3. ¿Qué debe llevar un error para que una interfaz accesible pueda usarlo?
4. ¿Cuál es la dirección correcta de las dependencias entre las cuatro capas?
5. Da dos costes concretos de separar un servicio.

**Repaso espaciado.** Repite al terminar el módulo 07 y antes del módulo 12.

## Reto de transferencia

Implementa TaskFlow en **dos** ecosistemas del catálogo que no conozcas por igual
y entrega:

1. el mismo contrato para ambos, sin ramas ni excepciones;
2. la ejecución de las pruebas de aceptación contra los dos, con la salida;
3. una tabla comparativa con: líneas de código propio, dependencias directas,
   tiempo de arranque en frío, comportamiento por omisión ante entrada inválida,
   y qué te obligó a escribir cada uno;
4. **una desviación del contrato** que uno de los dos te haya empujado a hacer, y
   cómo la evitaste;
5. una propuesta de evolución del contrato —añadir etiquetas a las tareas— que
   no rompa a ningún cliente [@geewax-api-design-patterns].

Si en algún momento cambiaste una prueba para que una implementación pasara,
declaralo: es el hallazgo más informativo del ejercicio.

## Criterios de evaluación

| Criterio | Insuficiente | Suficiente | Sólido | Ejemplar |
| --- | --- | --- | --- | --- |
| Contrato | No existe | Documenta lo implementado | Se escribe antes y las pruebas derivan de él | Verifica el contrato en integración continua |
| Comparación | Compara sintaxis | Ambas implementaciones funcionan | Mismas pruebas, mismo entorno, tabla de dimensiones | Declara desviaciones y diferencias irreductibles |
| Errores | Genéricos | Con código estable | Normalizados y por campo | Documentados en el contrato y probados |
| Evolución | No se plantea | Sabe qué rompe | Propone un plan de migración | Mide el uso antes de retirar algo |

## Fuentes

- [@geewax-api-design-patterns] Geewax, JJ. *API Design Patterns*. Manning Publications, 2021. ISBN 9781617295850 — <https://openlibrary.org/isbn/9781617295850>
- [@richardson-amundsen-restful] Richardson, Leonard; Amundsen, Mike; Ruby, Sam. *RESTful Web APIs*. O'Reilly Media, 2013. ISBN 9781449358068 — <https://openlibrary.org/isbn/9781449358068>
- [@newman-building-microservices] Newman, Sam. *Building Microservices*, 2.ª ed. O'Reilly Media, 2020. ISBN 9781492034025 — <https://openlibrary.org/isbn/9781492034025>
- [@fowler-microservice-tradeoffs] Fowler, Martin. *Microservice Trade-Offs*, 2015 — <https://martinfowler.com/articles/microservice-trade-offs.html>
- [@openapi-spec] OpenAPI Specification, OpenAPI Initiative — <https://spec.openapis.org/oas/latest.html>
- [@json-schema] JSON Schema Specification — <https://json-schema.org/specification>
- [@rfc9457] RFC 9457 — Problem Details for HTTP APIs, IETF, 2023 — <https://www.rfc-editor.org/rfc/rfc9457>
- [@rfc8259] RFC 8259 — JSON, IETF, 2017 — <https://www.rfc-editor.org/rfc/rfc8259>
