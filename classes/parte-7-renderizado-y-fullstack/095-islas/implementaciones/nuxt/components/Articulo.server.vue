<script setup lang="ts">
import { ARTICULO } from "../datos";

// El sufijo `.server` es toda la declaración. Este componente se renderiza en el
// servidor y su código no se incluye en el paquete del navegador.
//
// A cambio, Nuxt pide su HTML por separado cuando hace falta refrescarlo, y ese
// mecanismo —una petición a `/__nuxt_island/…`— es la parte que todavía está
// marcada como experimental.
const parrafos = ARTICULO;
</script>

<template>
  <article data-zona="estatica">
    <p v-for="parrafo in parrafos" :key="parrafo">{{ parrafo }}</p>
  </article>
</template>
