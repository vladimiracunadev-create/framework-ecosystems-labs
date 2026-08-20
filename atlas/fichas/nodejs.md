# 🟩 Node.js — 2009

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Node.js **no es un framework**: es el runtime, quien ejecuta a todos los de su
columna. Está en el Atlas porque sin él no existirían Express, Next.js, Vite ni
Electron, y porque su historia explica por qué el ecosistema JavaScript tiene la
forma que tiene.

> **🎯 Por qué está en este programa**
>
> **Es el ejercicio de taxonomía más limpio del catálogo**
> ([módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md)): un runtime tiene
> versión propia, ciclo de soporte propio y ejecuta tu código; un framework
> organiza tu código dentro de ese runtime. Confundirlos lleva a comparaciones sin
> sentido.
>
> **Y es sobre él que está escrita la referencia sin framework** del
> [módulo 01](../../curriculum/01-http-eventos-y-contratos.md), el patrón de medida
> contra el que se comparan las cinco implementaciones del contrato.

| | |
|---|---|
| **Aparición** | 2009, creado por Ryan Dahl |
| **Clasificación** | `runtime` |
| **Ecosistema** | JavaScript |
| **Licencia** | `MIT` |
| **Gobierno** | OpenJS Foundation |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://nodejs.org/docs/latest-v22.x/api/> |

---

## 💡 La idea: no bloquear nunca

El modelo dominante en 2009 era **un hilo por conexión**: cada petición ocupaba
un hilo, y ese hilo se quedaba esperando mientras la base de datos respondía. Con
muchas conexiones, la mayor parte de la memoria del servidor estaba dedicada a
hilos que no hacían nada.

Node.js propuso lo contrario: **un solo hilo y un bucle de eventos**. Ninguna
operación de entrada/salida bloquea; se registra qué hacer cuando termine y el
hilo sigue atendiendo [@powers-learning-node].

```javascript
// El servidor no espera: registra qué hacer cuando lleguen los datos.
// La referencia del módulo 01 usa exactamente este modelo.
request.on("data", (chunk) => { /* ... */ });
request.on("end", () => { /* ... */ });
```

La consecuencia menos obvia y más importante: **si algo bloquea el hilo, bloquea
el servidor entero**. Un bucle pesado no ralentiza una petición: las ralentiza
todas. Es el reverso del modelo, y explica por qué el trabajo intensivo de CPU
encaja mal aquí.

## 🌍 Lo que Node.js hizo posible

| Consecuencia | Por qué |
| --- | --- |
| **Un solo lenguaje** en cliente y servidor | Es la razón de que exista el metaframework |
| **Herramientas de la web escritas en JavaScript** | Empaquetadores, comprobadores, formateadores |
| **Un registro de paquetes enorme** | Publicar es gratis y sin revisión: variedad, y superficie de cadena de suministro |
| **Escritorio con tecnología web** | Electron es Node.js más un navegador |

Ese registro es también la razón de que el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) insista tanto en
versiones fijadas y verificables: la facilidad de publicar es una virtud y un
riesgo a la vez.

## 🧩 La transición de módulos: un caso de estudio

Node.js nació antes de que JavaScript tuviera módulos y creó los suyos
(`require`). Cuando el lenguaje estandarizó los suyos (`import`), hubo que hacer
convivir dos sistemas incompatibles en el mismo runtime durante años
[@nodejs-esm].

Es un ejemplo excelente para el
[módulo 10](../../curriculum/10-modernizacion-y-migracion.md): una migración con
convivencia obligatoria, sin poder romper el ecosistema existente, resuelta con
compatibilidad en ambos sentidos y una larga transición. Comparar esta migración
con la de AngularJS —donde no hubo convivencia— es un ejercicio muy productivo.

## 🔄 Los sucesores y qué dicen de él

Dos runtimes posteriores existen como crítica explícita a decisiones de Node.js:

| | Node.js | Deno | Bun |
| --- | --- | --- | --- |
| Permisos | Acceso total por omisión | **Explícitos**: red, disco, entorno [@deno-v1] | Como Node |
| TypeScript | Requiere herramienta | Integrado | Integrado |
| API | Propias, anteriores a los estándares web | Estándares web primero | Compatibilidad con Node [@bun-nodejs-apis] |
| Herramientas | Se eligen aparte | Incluidas | Incluidas |

Deno lo creó **la misma persona que creó Node.js**, y su presentación fue
literalmente una lista de cosas de las que se arrepentía. Que un autor pueda
enumerar los defectos de su obra diez años después, y que la obra siga siendo la
más usada, dice algo sobre la diferencia entre diseño ideal y adopción real.

Bun tomó el camino opuesto: en lugar de corregir el diseño, **mantener la
compatibilidad** y competir en velocidad de arranque y de instalación. Son dos
estrategias de sustitución distintas, y el módulo 11 las trataría de forma
distinta.

## 🎓 Las tres lecciones

**1. El runtime no es un detalle de instalación.** Su modelo de concurrencia
determina qué arquitecturas son viables encima. Lo mismo que enseña
[Phoenix](phoenix.md) desde la BEAM.

**2. Un solo hilo hace la concurrencia barata y la CPU peligrosa.** Es el
compromiso central, y explica para qué encaja Node.js y para qué no.

**3. Migrar sin romper cuesta años y merece la pena.** La transición de módulos
es lenta y fea, y conservó un ecosistema entero. Es el listón contra el que medir
cualquier ruptura.

## 🔗 Enlaces

- Documentación oficial: <https://nodejs.org/docs/latest-v22.x/api/>
- [Laboratorio 01](../../labs/01-http-contract/README.md) — la referencia sin framework
- [Ficha de Express](express.md) · [Ecosistema JavaScript](../ecosistemas/javascript.md)

## Fuentes

- [@powers-learning-node] Powers, Shelley. *Learning Node*. O'Reilly Media, 2012. ISBN 9781449326166 — <https://openlibrary.org/isbn/9781449326166>
- [@nodejs-esm] *Node.js ECMAScript Modules*, OpenJS Foundation — Node.js — <https://nodejs.org/api/esm.html>
- [@deno-v1] *Deno 1.0*, Deno — <https://deno.com/blog/v1>
- [@bun-nodejs-apis] *Node.js API compatibility*, Bun — <https://bun.com/docs/runtime/nodejs-apis>
