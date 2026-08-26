<script setup lang="ts">
import { enParalelo } from "../fuente.js";

// El mismo cargador con `Promise.all`.
const { data: datos } = await useAsyncData("paralelo", () => enParalelo());
</script>

<template>
  <Panel como="paralelo" :datos="datos" />
</template>
