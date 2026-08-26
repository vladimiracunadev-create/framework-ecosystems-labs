<script setup lang="ts">
import { PORTADA } from "../datos";

// `useSeoMeta` ES LA API MÁS ESPECÍFICA DE LAS CINCO.
//
// No recibe etiquetas ni un objeto genérico: recibe **los nombres de los
// metadatos que existen**, con tipos. `ogTitle`, `ogType`, `twitterCard`,
// `articlePublishedTime`. Escribir mal uno es un error de compilación en lugar
// de una etiqueta que nadie lee.
//
// Es la diferencia entre una API que sabe de qué va el problema y una que solo
// mueve cadenas de un sitio a otro.
const origen = useRequestURL().origin;
const canonica = `${origen}${PORTADA.ruta}`;

useSeoMeta({
  title: PORTADA.titulo,
  description: PORTADA.descripcion,
  ogTitle: PORTADA.titulo,
  ogDescription: PORTADA.descripcion,
  ogType: "website",
  ogUrl: canonica,
});
useHead({ link: [{ rel: "canonical", href: canonica }] });
</script>

<template>
  <div>
    <h1>{{ PORTADA.titulo }}</h1>
    <a href="/articulo/hola-mundo">un artículo</a>
  </div>
</template>
