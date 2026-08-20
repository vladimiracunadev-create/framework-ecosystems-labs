# 💚 Vue — 2014

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Vue ocupa un lugar poco frecuente en el Atlas: es el proyecto que **eligió
deliberadamente el punto medio** entre la biblioteca mínima y el framework
completo, y lo sostuvo durante más de una década sin patrocinio corporativo.

Su rasgo definitorio es la **adopción progresiva**: sirve como etiqueta añadida a
una página que ya existe, y sirve como framework completo de una aplicación
grande. Casi ninguna otra tecnología del catálogo cubre ese rango.

> **🎯 Por qué está en este programa**
>
> **Es el mejor ejemplo vivo de reactividad de grano fino**
> ([módulo 03](../../curriculum/03-frontend-componentes-y-estado.md)). Donde React
> vuelve a ejecutar la función y compara, Vue **registra qué expresión leyó qué
> dato** y actualiza solo eso. Comparar ambos modelos con el mismo requisito es el
> ejercicio central del módulo.
>
> **Y es el caso de adopción incremental por excelencia**
> ([módulo 10](../../curriculum/10-modernizacion-y-migracion.md)): se puede
> introducir en una página heredada, componente a componente, sin reescribir nada
> — que es exactamente la figura estranguladora aplicada al frontend.

| | |
|---|---|
| **Aparición** | 2014, creado por Evan You |
| **Clasificación** | `web-framework` — framework de interfaz, adoptable por partes |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Gobierno** | Proyecto independiente, sostenido por patrocinio |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://vuejs.org/guide/> |

---

## 📜 De dónde viene

Evan You trabajaba en Google usando AngularJS y quiso quedarse con lo que le
gustaba —el enlace declarativo en el propio HTML— sin cargar con el resto:
módulos, inyección, ciclo de comprobación completo. Vue nació de esa resta.

Eso explica su forma. Hereda de AngularJS la idea de **plantilla que es HTML
válido**, y de la generación siguiente el **componente como unidad**:

```vue
<script setup>
import { ref, computed } from "vue";

const tareas = ref([]);
// `computed` es la respuesta directa al estado derivado duplicado: no se guarda,
// se declara cómo se calcula, y se recalcula solo cuando cambia lo que lee.
const pendientes = computed(() => tareas.value.filter((t) => !t.done).length);
</script>

<template>
  <h1>Tareas</h1>
  <p>Pendientes: {{ pendientes }}</p>
  <button :disabled="pendientes === 0">Completar una</button>
</template>
```

El archivo de componente único —plantilla, lógica y estilos en un mismo
archivo— fue otra decisión discutida y muy imitada
[@macrae-vue-up-and-running].

## 🔍 Cómo funciona la reactividad

Esta es la parte que conviene entender de verdad, porque es lo que separa a Vue
de React y lo que hoy vuelve a estar de moda con el nombre de «señales».

El mecanismo tiene tres pasos [@vue-reactivity]:

1. **Se envuelve el estado** en un objeto que intercepta lecturas y escrituras.
2. **Al ejecutar un efecto** —pintar un componente, evaluar un `computed`— cada
   lectura queda registrada: «este efecto depende de este dato».
3. **Al escribir un dato**, se notifica exactamente a los efectos que lo leyeron.
   A nadie más.

```
estado.tareas  ──leído por──►  computed(pendientes)  ──leído por──►  render de <p>
     │
     └── al escribir: se avisa a pendientes, y pendientes avisa al render.
         El resto del componente no se vuelve a evaluar.
```

La consecuencia observable es la que importa para comparar:

| | Vue / SolidJS / Svelte 5 | React / Preact |
| --- | --- | --- |
| Al cambiar un dato | Se re-ejecuta lo que lo leyó | Se re-ejecuta el componente entero |
| El coste crece con | Las dependencias reales | El tamaño del árbol re-descrito |
| Precio | Hay que entender el grafo de dependencias | Hay que entender cuándo memorizar |

Ninguno gana en abstracto. Vue paga con un modelo mental algo mayor —envolturas,
`ref` frente a valor— lo que ahorra en trabajo de ejecución.

## 🪜 La escalera de adopción

Es la propiedad que casi nadie aprovecha y que más valor tiene en un sistema
heredado. Vue funciona en cuatro niveles, y se puede subir de escalón sin
reescribir el anterior:

| Nivel | Qué haces | Qué necesitas |
| --- | --- | --- |
| **1** | Una etiqueta `<script>` en una página existente; Vue controla un `<div>` | Nada más |
| **2** | Varios componentes en páginas distintas de un sitio renderizado en servidor | Nada más |
| **3** | Aplicación completa con enrutado y almacén | Fase de construcción |
| **4** | Full stack con renderizado en servidor | Nuxt |

Para el [módulo 10](../../curriculum/10-modernizacion-y-migracion.md) esto es una
figura estranguladora natural: se migra **pantalla a pantalla**, con la
aplicación antigua funcionando al lado, y se puede volver atrás quitando una
etiqueta. Muy pocas tecnologías de interfaz permiten eso.

## ⚖️ Lo que hay que declarar antes de elegirlo

**1. El gobierno es distinto.** Vue no tiene detrás a Meta ni a Google: se
sostiene con patrocinio y con un equipo pequeño. Eso tiene dos caras — decisiones
más coherentes y menos sujetas a los intereses de una empresa, y una
concentración de conocimiento mayor. El módulo 11 pide puntuar **el número de
personas con permiso de publicación**, y aquí esa cifra pesa.

**2. La migración de Vue 2 a Vue 3 fue real.** No fue una reescritura con otro
nombre como la de AngularJS, pero tampoco fue gratis: cambió el sistema de
reactividad y buena parte del ecosistema tuvo que actualizarse. Hubo compilación
de compatibilidad y guía de migración. Es un punto intermedio útil entre el caso
AngularJS y el caso React.

**3. Dos estilos de API conviven.** El clásico por opciones y el de composición.
Es flexibilidad y también una decisión de equipo que conviene fijar por escrito:
dos estilos en la misma base de código es deuda.

## 🎓 Las tres lecciones

**1. El punto medio es una posición legítima.** El campo tiende a presentar la
elección como «biblioteca mínima o framework completo». Vue lleva diez años
demostrando que se puede ocupar el centro y sostenerlo.

**2. La adopción progresiva es una propiedad arquitectónica, no de marketing.**
Poder entrar por una etiqueta y salir quitándola cambia por completo el análisis
de riesgo de una migración.

**3. Las señales no son nuevas.** Knockout las tenía en 2010, Vue las popularizó
en 2014, y en 2023 volvieron con nombre nuevo a Angular, Svelte y Solid. Es el
péndulo del [Atlas](../README.md#las-cinco-eras) otra vez: reconocer la idea
detrás del nombre es el objetivo de todo este programa.

## 🔗 Enlaces

- Documentación oficial: <https://vuejs.org/guide/>
- [Ecosistema JavaScript](../ecosistemas/javascript.md) · [Ficha de React](react.md) · [Ficha de AngularJS](angularjs.md)
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) — las cuatro clases de estado

## Fuentes

- [@macrae-vue-up-and-running] Macrae, Callum. *Vue.js: Up and Running: Building Accessible and Performant Web Apps*. O'Reilly Media, 2018. ISBN 9781491997246 — <https://openlibrary.org/isbn/9781491997246>
- [@vue-reactivity] *Reactivity in Depth*, Vue — <https://vuejs.org/guide/extras/reactivity-in-depth.html>
