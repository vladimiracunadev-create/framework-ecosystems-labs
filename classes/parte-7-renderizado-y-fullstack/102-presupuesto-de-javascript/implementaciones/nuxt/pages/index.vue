<script setup lang="ts">
// Lo único interactivo de la pantalla.
const veces = ref(0);
</script>

<template>
  <div>
    <h1 data-pantalla="presupuesto">Una pantalla con un botón</h1>
    <button :data-cuenta="veces" @click="veces += 1">Pulsado {{ veces }} veces</button>
  </div>
</template>
