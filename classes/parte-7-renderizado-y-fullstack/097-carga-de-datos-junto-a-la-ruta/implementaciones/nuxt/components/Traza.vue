<script setup lang="ts">
import { secuencia } from "../registro";
</script>

<template>
  <span :data-secuencia="secuencia()"></span>
</template>
