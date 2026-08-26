<script setup lang="ts">
import { PRODUCTOS, sello } from "../datos";

// LA PRIMERA PANTALLA. En el archivo no hay ninguna marca de que sea estática:
// hay que ir a `nuxt.config.ts`. Ese es el precio de tener las decisiones
// juntas, y conviene saberlo antes de elegir esta forma.
const productos = PRODUCTOS;
const marca = sello();
</script>

<template>
  <div>
    <h1>Catálogo</h1>
    <ul data-estrategia="estatico" :data-sello="marca">
      <li v-for="producto in productos" :key="producto">{{ producto }}</li>
    </ul>
  </div>
</template>
