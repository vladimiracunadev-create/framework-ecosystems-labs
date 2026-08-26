<script setup lang="ts">
import { enCascada } from "../fuente.js";

// Tres `await` seguidos dentro del cargador. Da igual que se envuelvan en
// `useAsyncData`: la clave y la deduplicación no arreglan el orden, solo evitan
// pedir dos veces lo mismo.
const { data: datos } = await useAsyncData("cascada", () => enCascada());
</script>

<template>
  <Panel como="cascada" :datos="datos" />
</template>
