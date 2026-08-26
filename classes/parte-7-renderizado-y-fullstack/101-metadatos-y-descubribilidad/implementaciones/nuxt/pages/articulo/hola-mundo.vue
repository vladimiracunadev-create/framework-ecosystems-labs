<script setup lang="ts">
import { ARTICULO, grafoDelArticulo } from "../../datos";

const origen = useRequestURL().origin;
const canonica = `${origen}${ARTICULO.ruta}`;

useSeoMeta({
  title: ARTICULO.titulo,
  description: ARTICULO.descripcion,
  ogTitle: ARTICULO.titulo,
  ogDescription: ARTICULO.descripcion,
  ogType: "article",
  ogUrl: canonica,
});

// El grafo sí es una etiqueta suelta, también aquí: ninguna de las cinco APIs
// dedicadas lo cubre, porque schema.org es un vocabulario abierto y no cabe en
// una lista de nombres.
useHead({
  link: [{ rel: "canonical", href: canonica }],
  script: [
    { type: "application/ld+json", innerHTML: JSON.stringify(grafoDelArticulo(origen)) },
  ],
});
</script>

<template>
  <div>
    <h1>{{ ARTICULO.titulo }}</h1>
    <p>{{ ARTICULO.descripcion }}</p>
  </div>
</template>
