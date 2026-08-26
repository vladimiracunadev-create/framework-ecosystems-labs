<script setup lang="ts">
import { anotar } from "../registro";

// EL COMPONENTE. `setup` se ejecuta al montar el componente, y al renderizar en
// el servidor eso ocurre después de que `useAsyncData` haya resuelto.
defineProps<{ tareas: { id: number; texto: string }[] }>();
anotar("render");
</script>

<template>
  <ul data-lista="tareas">
    <li v-for="tarea in tareas" :key="tarea.id" :data-tarea="tarea.id">
      <NuxtLink :to="`/tareas/${tarea.id}`">{{ tarea.texto }}</NuxtLink>
    </li>
  </ul>
</template>
