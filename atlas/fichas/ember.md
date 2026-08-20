# 🐹 Ember.js — 2011

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Ember lleva más de una década en producción y casi nunca aparece en las
conversaciones sobre frameworks. Está en el Atlas por una razón que no tiene que
ver con su API: **es el proyecto con el mejor proceso de gobierno y de migración
del ecosistema JavaScript**, y eso es precisamente lo que el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) enseña a valorar.

> **🎯 Por qué está en este programa**
>
> Porque responde con hechos a la pregunta que el caso [AngularJS](angularjs.md)
> deja abierta: **¿se puede cambiar profundamente un framework sin romper a quien
> lo usa?** Ember lleva quince años demostrando que sí, y documentando cómo.

| | |
|---|---|
| **Aparición** | 2011, sucesor de SproutCore |
| **Clasificación** | `web-framework` — completo |
| **Ecosistema** | JavaScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://guides.emberjs.com/release/> |

---

## 💡 Convención sobre configuración, en el navegador

Ember hizo con el frontend lo que Rails hizo con el backend: imponer una
estructura y unas convenciones de nombres, de modo que dos proyectos distintos se
parezcan.

Trae en la caja enrutado, capa de datos, plantillas, pruebas, generadores y
herramientas de línea de comandos. Es la misma propuesta de
[Angular](angular.md) —framework completo con opinión fuerte— con cinco años de
antelación.

## 🏛️ Lo que de verdad merece estudiarse: el proceso

### Propuestas públicas antes de cambiar

Todo cambio significativo pasa por una propuesta escrita, pública y discutida
antes de implementarse [@ember-rfcs]. Cualquiera puede leer **por qué** se tomó
una decisión, qué alternativas se consideraron y quién objetó.

Para el módulo 11 eso es oro: la pregunta «¿cómo se decidieron los cambios
grandes anteriores?» tiene aquí una respuesta consultable en lugar de una
impresión.

### Ediciones: cambiar mucho sin romper

Ember introdujo el concepto de **edición**: un conjunto coherente de cambios que
se adopta gradualmente, con el código antiguo funcionando al lado
[@ember-octane]. La edición Octane cambió el modelo de componentes, el sistema de
reactividad y la sintaxis de las plantillas — y **no rompió las aplicaciones
existentes**.

La comparación es directa y vale la pena tenerla presente:

| | AngularJS → Angular | Ember → Octane |
| --- | --- | --- |
| Alcance del cambio | Modelo, lenguaje, sintaxis | Modelo, reactividad, sintaxis |
| ¿Compatible? | **No** | **Sí**, con convivencia |
| Camino | Puente entre dos frameworks | Actualización gradual, archivo a archivo |
| Nombre | Producto nuevo | Mismo producto |
| Coste para los equipos | Reescritura o migración larga | Adopción a su ritmo |

**El problema técnico era de dificultad comparable.** La diferencia estuvo en el
proceso, no en la dificultad.

### Herramientas de actualización automática

Ember distribuye herramientas que reescriben el código antiguo al estilo nuevo.
No cubren todo, y quitan de en medio la parte mecánica — que es la que hace que
las migraciones se pospongan indefinidamente.

## ⚖️ Por qué su cuota es pequeña

Sería deshonesto contar solo lo bueno. Ember perdió terreno por razones
concretas:

**1. Llegó antes de que el lenguaje madurara.** Tuvo que inventar su propio
sistema de módulos, sus clases y sus herramientas. Cuando JavaScript estandarizó
los suyos, Ember cargaba con los propios.

**2. La opinión fuerte espanta a quien quiere empezar rápido.** React ofrecía
«añade esta biblioteca a lo que ya tienes»; Ember pedía adoptar un mundo entero.

**3. Sin patrocinio corporativo grande.** Sin el impulso de Meta o Google, la
visibilidad depende de la comunidad, y eso se nota en adopción aunque no en
calidad.

## 🎓 Las tres lecciones

**1. El proceso de gobierno es una dimensión de la decisión, no un detalle.**
Propuestas públicas, ediciones y herramientas de actualización son evidencia
consultable sobre cómo te tratarán en la próxima versión mayor.

**2. Se puede cambiar profundamente sin romper — cuesta más y se puede.** Ember
es el contraejemplo vivo de la excusa «no había otra forma».

**3. Calidad de proceso y cuota de mercado son cosas distintas.** Confundirlas
lleva a elegir por popularidad, que es justo lo que el módulo 11 prohíbe como
criterio.

## 🔗 Enlaces

- Documentación oficial: <https://guides.emberjs.com/release/>
- [Ficha de AngularJS](angularjs.md) — el contraste · [Ficha de Angular](angular.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) — salud del proyecto

## Fuentes

- [@ember-rfcs] *Ember RFCs*, Ember.js — <https://rfcs.emberjs.com/>
- [@ember-octane] *Ember Octane*, Ember.js — <https://emberjs.com/editions/octane/>
