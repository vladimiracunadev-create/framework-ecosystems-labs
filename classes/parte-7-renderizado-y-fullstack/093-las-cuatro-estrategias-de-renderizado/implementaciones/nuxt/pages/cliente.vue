<script setup lang="ts">
import { onMounted, ref } from "vue";

// LA TERCERA ESTRATEGIA.
//
// `onMounted` no corre en el servidor —clase 087— así que el HTML sale con la
// lista vacía y los datos llegan cuando el navegador ejecuta el JavaScript.
//
// En Nuxt esto es una decisión deliberada: `useFetch` o `useAsyncData` traerían
// los datos ANTES de renderizar y llegarían en el HTML. Pedirlos en `onMounted`
// es elegir explícitamente la estrategia de cliente.
const tareas = ref<string[]>([]);
const pendiente = ref("si");

onMounted(async () => {
  const respuesta = await fetch("/tareas.json");
  tareas.value = (await respuesta.json()).tareas;
  pendiente.value = "no";
});
</script>

<template>
  <ul data-estrategia="cliente" :data-pendiente="pendiente">
    <li v-for="tarea in tareas" :key="tarea">{{ tarea }}</li>
  </ul>
</template>
