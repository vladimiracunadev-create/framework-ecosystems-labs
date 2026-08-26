<script setup lang="ts">
import { sello, ventasDeHoy } from "../datos";

// LA SEGUNDA PANTALLA. Tampoco lleva marca: la regla dice `prerender: false`, y
// eso es además el valor por omisión.
const ventas = ventasDeHoy();
const marca = sello();
</script>

<template>
  <div>
    <h1>Panel</h1>
    <p data-estrategia="servidor" :data-sello="marca">
      {{ ventas.pedidos }} pedidos, {{ ventas.importe }} euros
    </p>
  </div>
</template>
