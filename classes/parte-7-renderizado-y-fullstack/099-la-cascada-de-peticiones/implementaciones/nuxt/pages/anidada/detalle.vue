<script setup lang="ts">
import { pedirPedidos } from "../../fuente.js";

definePageMeta({ layout: "padre" });

const { data: pedidos } = await useAsyncData("pedidos", () => pedirPedidos());
</script>

<template>
  <p data-capa="hija" :data-pedidos="pedidos?.length">{{ pedidos?.length }} pedidos</p>
</template>
