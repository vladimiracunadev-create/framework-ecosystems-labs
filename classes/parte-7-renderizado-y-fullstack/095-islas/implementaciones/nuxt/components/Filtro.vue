<script setup lang="ts">
// ISLA 2. Recibe las tareas por propiedad, igual que en los otros dos, y por
// tanto viajan dentro de la carga útil de Nuxt.
const props = defineProps<{ tareas: string[] }>();
const texto = ref("");
const visibles = computed(() => props.tareas.filter((t) => t.includes(texto.value)));
</script>

<template>
  <div data-isla="filtro">
    <input v-model="texto" placeholder="filtrar" />
    <ul>
      <li v-for="tarea in visibles" :key="tarea">{{ tarea }}</li>
    </ul>
  </div>
</template>
