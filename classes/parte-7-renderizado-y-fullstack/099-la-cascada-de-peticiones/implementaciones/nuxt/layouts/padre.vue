<script setup lang="ts">
import { pedirUsuario } from "../fuente.js";

// LA DISPOSICIÓN DE NUXT ES UN COMPONENTE, IGUAL QUE LA DE ASTRO.
//
// No hay rutas anidadas con cargas propias: hay un componente que envuelve a la
// página. Si su `setup` espera, esa espera ocurre en su turno de renderizado, no
// a la vez que la de la página.
//
// Lo que decide si se suman o no es en qué orden el renderizador de Vue ejecuta
// los `setup` asíncronos de un componente y de su ranura. La medición de
// `/cascada.json` lo dice sin necesidad de leer el código de Vue, que es
// exactamente lo que hay que hacer con este tipo de preguntas.
const { data: usuario } = await useAsyncData("usuario-marco", () => pedirUsuario());
</script>

<template>
  <div data-capa="padre" :data-usuario="usuario?.nombre">
    <slot />
  </div>
</template>
