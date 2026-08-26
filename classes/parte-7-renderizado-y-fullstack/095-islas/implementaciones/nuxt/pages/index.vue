<script setup lang="ts">
import { TAREAS } from "../datos";

// La misma página. `Articulo` es el componente de servidor —su código no viaja—
// y los otros dos son componentes normales, que sí.
//
// Aquí no hay directiva ninguna: la decisión está en el nombre del archivo del
// componente. Tres frameworks, tres sitios distintos donde mirar para saber qué
// llega al navegador: la etiqueta (Astro), la primera línea del componente
// (Next) y el nombre del archivo (Nuxt).
const tareas = TAREAS;
</script>

<template>
  <div>
    <h1>Islas</h1>
    <Articulo />
    <Contador />
    <Filtro :tareas="tareas" />
  </div>
</template>
