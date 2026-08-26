<script setup lang="ts">
import { pedirLasTareas } from "../../datos";

// `useAsyncData` ES LA FUNCIÓN DE CARGA DE NUXT, Y VIVE DENTRO DEL COMPONENTE.
//
// Es un punto intermedio entre los dos extremos de esta clase. Como en Astro y
// en Next, la carga está dentro de la página; pero a diferencia de ellos, el
// framework SÍ sabe que es una carga: le da una clave, la deduplica, guarda su
// resultado en la carga útil y la puede volver a ejecutar con `refresh()`.
//
// El precio de esa clave es que hay que inventarla y que sea única. Es la fuente
// de errores más común de esta parte de Nuxt: dos componentes con la misma clave
// comparten dato sin querer.
const { data: tareas } = await useAsyncData("tareas", () => pedirLasTareas());
</script>

<template>
  <div>
    <h1>Tareas</h1>
    <Lista :tareas="tareas ?? []" />
    <Traza />
  </div>
</template>
