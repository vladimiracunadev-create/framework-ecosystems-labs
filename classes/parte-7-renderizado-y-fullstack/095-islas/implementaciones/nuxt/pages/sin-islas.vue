<script setup lang="ts">
// El mismo artículo sin las dos zonas vivas. Como en Next, la página llega con
// JavaScript de todas formas: la aplicación de Vue arranca para poder navegar
// sin recargar.
//
// La comparación honesta no es «cuánto pesa esto» sino «cuánto SUBE al añadir
// dos islas», y eso es lo que `/islas.json` publica en los tres.
</script>

<template>
  <div>
    <h1>Sin islas</h1>
    <Articulo />
  </div>
</template>
