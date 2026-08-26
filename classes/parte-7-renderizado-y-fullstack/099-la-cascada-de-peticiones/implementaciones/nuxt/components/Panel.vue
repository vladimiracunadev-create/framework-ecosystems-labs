<script setup lang="ts">
// La misma pantalla para las dos rutas.
defineProps<{ como: string; datos: any }>();
</script>

<template>
  <main :data-como="como">
    <h1>Hola, {{ datos.usuario.nombre }}</h1>
    <p :data-pedidos="datos.pedidos.length">{{ datos.pedidos.length }} pedidos</p>
    <ul>
      <li v-for="aviso in datos.avisos" :key="aviso">{{ aviso }}</li>
    </ul>
  </main>
</template>
