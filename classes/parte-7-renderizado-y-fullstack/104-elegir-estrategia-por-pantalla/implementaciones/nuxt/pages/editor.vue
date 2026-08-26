<script setup lang="ts">
// LA TERCERA PANTALLA. La página se prerenderiza —el hueco es un archivo— y los
// datos se piden desde el navegador con `onMounted`, que es lo que la clase 087
// enseñó a no hacer... en una pantalla pública.
//
// Aquí es correcto, y por eso esta clase cierra la parte: la misma técnica es un
// error o un acierto según las tres preguntas.
const productos = ref<string[]>([]);
const pendiente = ref("si");

onMounted(async () => {
  const respuesta = await fetch("/productos.json");
  productos.value = (await respuesta.json()).productos;
  pendiente.value = "no";
});
</script>

<template>
  <div>
    <h1>Editor</h1>
    <ul data-estrategia="cliente" :data-pendiente="pendiente">
      <li v-for="producto in productos" :key="producto">{{ producto }}</li>
    </ul>
  </div>
</template>
