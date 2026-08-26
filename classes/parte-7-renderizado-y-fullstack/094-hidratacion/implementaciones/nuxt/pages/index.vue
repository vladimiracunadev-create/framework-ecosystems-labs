<script setup lang="ts">
import { TAREAS } from "../datos";

// `useState` no es solo un `ref` con nombre: es la puerta por la que un dato
// entra en la CARGA ÚTIL de Nuxt. Lo que se guarde aquí se serializa dentro del
// HTML, en un `<script type="application/json" id="__NUXT_DATA__">`, para que
// el navegador arranque con el mismo estado con el que el servidor renderizó.
//
// Si en vez de esto se escribiera `const tareas = TAREAS`, la lista llegaría
// pintada igual y NO viajaría dos veces... hasta que algo la necesitara en el
// navegador. Entonces habría que volver a pedirla. Esa es la elección real:
// pagar bytes ahora o pagar una petición después.
const tareas = useState("tareas", () => TAREAS);
const miradas = ref(0);
</script>

<template>
  <h1>Hidratación</h1>
  <section data-hidratacion="pendiente">
    <ul>
      <li v-for="tarea in tareas" :key="tarea">{{ tarea }}</li>
    </ul>
    <button
      data-interactivo="si"
      :data-cuenta="miradas"
      @click="miradas += 1"
    >
      He mirado la lista {{ miradas }} veces
    </button>
  </section>
</template>
