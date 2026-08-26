<script setup lang="ts">
import { TAREAS, sello } from "../datos";

// Y esta se renderiza en cada petición. El archivo es idéntico al de al lado
// salvo por el atributo `data-estrategia`: lo único que las separa es una línea
// en `nuxt.config.ts`.
const marca = sello();
</script>

<template>
  <ul data-estrategia="servidor" :data-sello="marca">
    <li v-for="tarea in TAREAS" :key="tarea">{{ tarea }}</li>
  </ul>
</template>
