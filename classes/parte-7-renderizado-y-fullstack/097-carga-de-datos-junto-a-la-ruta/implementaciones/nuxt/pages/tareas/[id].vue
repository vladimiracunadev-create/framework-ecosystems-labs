<script setup lang="ts">
import { anotar } from "../../registro";
import { pedirUnaTarea } from "../../datos";

// `useRoute().params` trae el parámetro. Y `createError` con `fatal: true` es lo
// que convierte un dato que no existe en un 404 de verdad: sin `fatal`, Nuxt lo
// trataría como un error recuperable y respondería 200.
const ruta = useRoute();
const { data: tarea } = await useAsyncData(`tarea-${ruta.params.id}`, () =>
  pedirUnaTarea(ruta.params.id as string),
);
if (!tarea.value) {
  throw createError({ statusCode: 404, statusMessage: "esa tarea no existe", fatal: true });
}
anotar("render");
</script>

<template>
  <div>
    <h1 :data-tarea="tarea!.id">{{ tarea!.texto }}</h1>
    <a href="/tareas">volver</a>
    <Traza />
  </div>
</template>
