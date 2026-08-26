<script setup lang="ts">
// ISLA 1. En Nuxt no hace falta declarar nada para que un componente sea
// interactivo: lo es por omisión. Lo que hay que declarar es lo contrario.
const veces = ref(0);
</script>

<template>
  <button data-isla="contador" :data-cuenta="veces" @click="veces += 1">
    Me ha gustado ({{ veces }})
  </button>
</template>
