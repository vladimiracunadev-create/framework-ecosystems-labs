<script setup lang="ts">
import { TAREAS, sello } from "../datos";

// Esta página está en la tabla de `nuxt.config.ts` con `prerender: true`.
//
// Nuxt la ejecuta al construir y guarda el HTML. En el archivo no hay ninguna
// marca de que sea estática — hay que ir a la tabla. Ese es el precio de tener
// las decisiones juntas.
const marca = sello();
</script>

<template>
  <ul data-estrategia="estatico" :data-sello="marca">
    <li v-for="tarea in TAREAS" :key="tarea">{{ tarea }}</li>
  </ul>
</template>
