# 🚂 Express — 2010

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Express definió el modelo de **middleware encadenado** que copiaron casi todos
los frameworks de Node.js que vinieron después, y una parte de los de otros
lenguajes. Quince años más tarde sigue siendo el punto de partida más común del
backend JavaScript.

Es también el mejor ejemplo del Atlas de que **«minimalista» no significa
«biblioteca»**: Express posee el bucle de peticiones, define el orden de
ejecución y decide cómo se propaga un error. Eso es un framework, por pequeña
que sea su superficie de API.

> **🎯 Por qué está en este programa**
>
> **Es uno de los cinco laboratorios ejecutables** y el escalón inmediatamente
> superior a la referencia sin framework. Comparar
> [`labs/01`](../../labs/01-http-contract/README.md) con
> [`labs/02`](../../labs/02-express-api/README.md) muestra, línea a línea, **qué
> escribe un framework por ti** — que es la pregunta del
> [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md).

| | |
|---|---|
| **Aparición** | 2010, creado por TJ Holowaychuk |
| **Clasificación** | `web-framework` — minimalista, pero framework |
| **Ecosistema** | Node.js |
| **Licencia** | `MIT` |
| **Gobierno** | OpenJS Foundation |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://expressjs.com/> |

---

## 💡 La idea: la petición atraviesa una cadena

Todo en Express es una función con la misma firma que recibe la petición, la
respuesta y una forma de ceder el turno a la siguiente:

```javascript
// Cada capa hace una cosa y decide si la petición sigue avanzando.
app.use(registrar);          // 1. anota qué entró
app.use(autenticar);         // 2. quién es
app.use(express.json());     // 3. analiza el cuerpo
app.post("/tasks", crear);   // 4. tu manejador
app.use(traducirErrores);    // 5. el único que construye respuestas de error
```

El orden **es** la arquitectura. Y ahí está el compromiso que enseña el módulo
02: es un mecanismo de extensión potentísimo y **el orden no se ve desde el
código de negocio**. Insertar el registro antes de la autenticación significa
registrar tráfico no autenticado, y nada en el manejador lo delata.

La forma canónica de defenderse es convertir el orden en una prueba: si alguien
lo cambia, algo debe fallar.

## 🔍 Lo que reveló implementar el contrato del programa

El [laboratorio 02](../../labs/02-express-api/README.md) implementa el contrato
canónico y pasa las mismas 20 pruebas que los demás. Salieron dos hallazgos
concretos, y ninguno aparece en los tutoriales:

**1. El analizador de JSON no rechaza lo que no entiende: lo ignora.** Si el
`Content-Type` no coincide, `express.json()` deja el cuerpo vacío y la petición
continúa. El fallo reaparece más adelante disfrazado de error de validación, con
el código equivocado. Por eso el laboratorio comprueba el tipo de contenido
**antes**, en un middleware propio. Es el módulo 02 en estado puro: **lo
implícito falla por sorpresa**.

**2. Los errores del framework no conocen tu contrato.** Express produce sus
propios errores —cuerpo demasiado grande, JSON no analizable— con su propia
forma. Traducirlos al catálogo del contrato es trabajo tuyo, en un punto único:

| Error de Express | Se traduce a |
| --- | --- |
| `entity.too.large` | `413` `BODY_TOO_LARGE` |
| `entity.parse.failed` | `400` `MALFORMED_JSON` |
| cualquier otro | `500` `INTERNAL_ERROR`, sin detalle |

Sin ese traductor, el cliente recibe el formato interno de una dependencia que no
eligió, y una actualización de esa dependencia puede cambiar tu contrato sin que
nadie toque el repositorio.

## ⚖️ Lo que Express no trae

La lista es larga y es el punto entero:

| Necesidad | Express | Hay que resolver |
| --- | --- | --- |
| Enrutado y middleware | ✅ | — |
| Validación de entrada | ❌ | Zod, Joi, JSON Schema… |
| Serialización tipada | ❌ | A mano |
| Documentación del contrato | ❌ | OpenAPI escrito aparte |
| Inyección de dependencias | ❌ | Cierres o un contenedor propio |
| Autenticación | ❌ | Passport, proveedor externo… |
| Estructura del proyecto | ❌ | Decisión del equipo |

Esa libertad es la razón de su longevidad y también su riesgo característico: en
Express **fallas por omisión**, porque nada te recuerda lo que falta. Fastify y
NestJS existen para cubrir columnas distintas de esa tabla, y el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) obliga a contarlas
antes de comparar: no es «Express frente a NestJS», es «Express más seis
decisiones frente a NestJS».

## 🧵 El detalle que casi nadie mira: la asincronía

Express nació antes de que JavaScript tuviera sintaxis asíncrona, y eso dejó
huella. En las versiones clásicas, una promesa rechazada dentro de un manejador
`async` **no llegaba automáticamente al traductor de errores**: había que
capturarla o envolver el manejador.

Es el tipo de detalle que separa un ejemplo de un servicio: funciona en el camino
feliz y produce peticiones colgadas cuando algo falla. La familia de patrones
asíncronos de Node.js —devoluciones de llamada, promesas, iteradores— y sus
trampas están tratadas a fondo en la referencia del ecosistema
[@casciaro-node-patterns].

## 🧭 El contrato antes que el framework

Express no dice nada sobre cómo debe ser tu API. Esa neutralidad hace
especialmente visible la tesis del
[módulo 05](../../curriculum/05-backend-y-api.md): **el contrato existe antes que
el framework y sobrevive a él**. Decidir la forma de los errores, la política de
versiones y qué cambios rompen a un cliente es trabajo de diseño de API, no de
Express [@jin-sahni-designing-web-apis].

Los cinco laboratorios del programa lo demuestran: el mismo contrato, cinco
frameworks, las mismas 20 pruebas.

## 🎓 Las tres lecciones

**1. Minimalista no es biblioteca.** Express posee el bucle de peticiones. La
distinción del [módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md) no
depende del tamaño de la API, sino de quién llama a quién.

**2. El orden de la cadena es una decisión de seguridad.** Y como no se ve desde
el código de negocio, hay que convertirlo en una prueba.

**3. Un traductor de errores único no es burocracia.** Es lo que impide que el
formato interno de una dependencia se convierta en tu contrato público.

## 🔗 Enlaces

- Documentación oficial: <https://expressjs.com/>
- [Laboratorio 02](../../labs/02-express-api/README.md) — contra el contrato canónico
- [Ecosistema JavaScript](../ecosistemas/javascript.md) · [Módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@casciaro-node-patterns] Casciaro, Mario; Mammino, Luciano. *Node.js Design Patterns*, 3.ª ed. Packt Publishing, 2020. ISBN 9781839214110 — <https://openlibrary.org/isbn/9781839214110>
- [@jin-sahni-designing-web-apis] Jin, Brenda; Sahni, Saurabh; Shevat, Amir. *Designing Web APIs: Building APIs That Developers Love*. O'Reilly Media, 2018. ISBN 9781492026921 — <https://openlibrary.org/isbn/9781492026921>
