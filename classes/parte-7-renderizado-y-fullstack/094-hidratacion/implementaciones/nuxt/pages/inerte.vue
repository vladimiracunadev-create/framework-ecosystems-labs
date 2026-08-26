<script setup lang="ts">
import { TAREAS } from "../datos";

// Sin `useState` y sin nada reactivo: la lista se renderiza en el servidor y se
// queda ahí. La regla `experimentalNoScripts` de `nuxt.config.ts` remata el
// trabajo quitando el arranque de Vue.
//
// El resultado es la pantalla más ligera que Nuxt sabe producir, y sirve de
// referencia: la diferencia con `/` en `/coste.json` es el precio de que el
// botón funcione.
const tareas = TAREAS;
</script>

<template>
  <h1>Sin hidratar</h1>
  <section data-hidratacion="no">
    <ul>
      <li v-for="tarea in tareas" :key="tarea">{{ tarea }}</li>
    </ul>
  </section>
</template>
