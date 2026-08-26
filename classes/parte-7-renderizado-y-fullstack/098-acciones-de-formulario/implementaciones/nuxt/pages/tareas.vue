<script setup lang="ts">
// La página solo lee, y lee por HTTP: el almacén vive en el lado de Nitro. Ver
// el comentario de `server/api/tareas.get.ts`, que explica por qué no puede
// importarlo directamente.
const { data } = await useFetch("/api/tareas");
const origen = useRequestURL().origin;
</script>

<template>
  <div>
    <h1>Tareas</h1>
    <ul>
      <li v-for="tarea in data?.tareas ?? []" :key="tarea.id" :data-tarea="tarea.id">
        {{ tarea.texto }}
      </li>
    </ul>
    <!--
      Un formulario HTML con `action` explícito, porque el destino es otra ruta y
      no esta página. Es la forma más antigua de todas y funciona en todas
      partes; lo que se pierde es que el framework sepa que esto tiene que ver
      con la pantalla de al lado.
    -->
    <form method="post" action="/tareas">
      <input type="hidden" name="intencion" value="crear" />
      <input type="text" name="texto" />
      <button type="submit">Añadir</button>
    </form>
    <span :data-origen="origen"></span>
  </div>
</template>
