# 🅰️ AngularJS — 2010

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

AngularJS es **el caso de estudio de migración más citado del campo**, y por eso
merece ficha propia aunque hoy nadie lo elija para empezar. Su historia contesta
una pregunta que toda decisión de arquitectura debería contestar antes de tomarse:
**¿qué pasa cuando el equipo que mantiene tu framework decide que el diseño estaba
equivocado?**

> **🎯 Por qué está en este programa**
>
> **Porque su final enseña más que su éxito.** AngularJS dominó el frontend
> empresarial durante cinco años. Su sucesor, Angular 2, fue una **reescritura
> incompatible con otro nombre de producto**. No hubo camino de actualización
> automático: hubo un puente y una decisión estratégica en miles de empresas.
>
> Es el material del [módulo 10](../../curriculum/10-modernizacion-y-migracion.md)
> —migración incremental frente a reescritura— con un caso real, documentado y de
> escala suficiente para que las conclusiones no sean anecdóticas.

| | |
|---|---|
| **Aparición** | 2010, creado por Miško Hevery en Google |
| **Clasificación** | `web-framework` — framework completo del lado del cliente |
| **Ecosistema** | JavaScript |
| **Licencia** | `MIT` |
| **Estado** | ⚪ Histórico. El soporte a largo plazo terminó y así consta oficialmente [@angularjs-eol] |
| **Documentación** | <https://docs.angularjs.org/guide> |

---

## 📜 Lo que trajo, y era muchísimo

En 2010, el frontend no tenía casi nada. AngularJS llegó con un paquete que hoy
parece obvio y entonces no lo era en absoluto:

| Capacidad | Qué significaba en 2010 |
| --- | --- |
| **Enlace bidireccional** | Escribes en el campo y el modelo cambia solo; cambias el modelo y el campo cambia solo |
| **Inyección de dependencias** | El patrón de Spring, en el navegador, con la misma lógica de fábricas y servicios [@fain-moiseev-angular] |
| **Directivas** | Extender HTML con elementos y atributos propios, siete años antes de los componentes web |
| **Plantillas en el propio HTML** | La vista es HTML válido con expresiones, no cadenas concatenadas en JavaScript |
| **Pruebas desde el diseño** | El contenedor permite sustituir colaboraciones; se distribuía con un ejecutor de pruebas |

El enlace bidireccional era el argumento estrella. Escribir un formulario
sincronizado con un modelo pasaba de cincuenta líneas a una:

```html
<!-- El modelo y el campo quedan sincronizados en ambos sentidos, solo con esto -->
<input ng-model="usuario.nombre">
<p>Hola, {{usuario.nombre}}</p>
```

## ⚠️ Y lo que ese acierto costó

El enlace bidireccional tenía un mecanismo debajo: el **ciclo de comprobación**.
En cada evento, AngularJS recorría todas las expresiones vigiladas para ver si
alguna había cambiado; y como un cambio podía provocar otro, repetía el recorrido
hasta que todo quedara estable.

Las consecuencias aparecían siempre a la misma escala —cuando la aplicación ya
era grande y cambiar de framework ya era caro:

- **El coste crecía con el número de expresiones vigiladas**, no con lo que
  realmente había cambiado.
- **Diagnosticar era difícil.** El error clásico —«se superó el número de
  iteraciones»— indicaba un bucle entre expresiones, sin decir cuáles.
- **El flujo de datos podía ir en cualquier dirección.** Con un formulario es
  cómodo; con cincuenta componentes, seguir quién cambió qué se vuelve un
  ejercicio de arqueología.

Es exactamente el aviso del [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md):
**cuanto más implícito es el comportamiento, mejor tiene que ser el
diagnóstico** — y aquí el diagnóstico no acompañó a la magia.

## 💥 La ruptura: Angular 2

En 2014 el equipo anunció que la versión siguiente sería **incompatible**. No una
API nueva junto a la antigua: otro lenguaje recomendado (TypeScript), otro modelo
de componentes, otro sistema de detección de cambios, otra forma de escribir
plantillas. Se conservó el nombre y poco más.

La reacción del ecosistema fue dura, y la decisión técnica era **defendible**: el
ciclo de comprobación no se podía arreglar sin cambiar el modelo. Frederick
Brooks describió este patrón medio siglo antes como el **efecto del segundo
sistema**: el equipo que ya conoce todos los defectos del primero tiende a
rediseñarlo entero, con todo lo que aprendió y con más ambición de la que el
plazo aguanta [@brooks-mythical-man-month].

### Lo que se hizo bien

- Se publicó una **guía de actualización** y un puente para ejecutar las dos
  versiones a la vez, que es la técnica de la fachada del
  [módulo 10](../../curriculum/10-modernizacion-y-migracion.md).
- Se anunció con **años de antelación** y con fechas explícitas de fin de soporte
  [@angularjs-eol].
- Se mantuvo el soporte de seguridad mucho más allá de lo habitual.

### Lo que no se pudo evitar

- **Convivir con las dos versiones era caro**: dos árboles de dependencias, dos
  modelos mentales, dos formas de escribir lo mismo.
- Muchos equipos concluyeron que, si tocaba reescribir de todos modos, **también
  podían reescribir en otra cosa**. React se benefició directamente de eso.
- El resto del campo aprendió una lección de gobierno: **una reescritura
  incompatible se paga en confianza**, y esa moneda tarda años en recuperarse.

## 🧭 Lo que este caso obliga a preguntar

Antes de adoptar cualquier framework, el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)
exige puntuar la salud del proyecto. AngularJS convierte tres de esas preguntas
en obligatorias:

| Pregunta | Cómo se responde con evidencia |
| --- | --- |
| ¿Hay política de soporte **publicada y con fechas**? | Calendarios de fin de vida y notas de versión [@endoflife-date] |
| ¿Cómo se decidieron los cambios grandes anteriores? | ¿Hubo un proceso público de propuestas? Ember publica cada cambio como propuesta abierta [@ember-rfcs] |
| ¿Qué pasó la última vez que hubo una versión mayor? | Busca la guía de migración real y lee los informes de quien la hizo |

La tercera es la más informativa y la que casi nadie hace. **El historial de
migraciones de un proyecto predice tu próxima migración mejor que cualquier
comparativa de funcionalidades.**

## 🎓 Las tres lecciones

**1. La comodidad sin diagnóstico se paga tarde y cara.** El enlace bidireccional
fue un acierto de producto y una deuda de operación: era imposible de depurar a
escala. La pregunta correcta ante cualquier magia es «¿y cuando falle, qué me va
a decir?».

**2. Una reescritura incompatible es una decisión de negocio, no técnica.**
Aunque el motivo técnico sea impecable, el coste lo pagan miles de equipos que no
participaron en la decisión. Por eso el módulo 11 pide mirar el gobierno **antes**
que la API.

**3. El fin de una tecnología puede estar bien gestionado.** Anuncio temprano,
fechas públicas, puente de convivencia y soporte de seguridad prolongado. Con
todo lo criticable del caso, este final se documentó mejor que la mayoría — y esa
también es información sobre un proyecto.

## 🔗 Enlaces

- Documentación oficial: <https://docs.angularjs.org/guide>
- [Ecosistema JavaScript](../ecosistemas/javascript.md) · [Ficha de React](react.md)
- [Módulo 10](../../curriculum/10-modernizacion-y-migracion.md) — figura estranguladora y criterio de retirada

## Fuentes

- [@fain-moiseev-angular] Fain, Yakov; Moiseev, Anton. *Angular Development with TypeScript*, 2.ª ed. Manning Publications, 2018. ISBN 9781617295348 — <https://openlibrary.org/isbn/9781617295348>
- [@brooks-mythical-man-month] Brooks, Frederick P. *The Mythical Man-Month: Essays on Software Engineering*, ed. aniversario. Addison-Wesley Professional, 1995. ISBN 9780201835953 — <https://openlibrary.org/isbn/9780201835953>
- [@angularjs-eol] *AngularJS Version Support Status*, Google — AngularJS — <https://docs.angularjs.org/misc/version-support-status>
- [@endoflife-date] *endoflife.date — Release and support calendars* — <https://endoflife.date/>
- [@ember-rfcs] *Ember RFCs*, Ember.js — <https://rfcs.emberjs.com/>
