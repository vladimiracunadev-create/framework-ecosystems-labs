<script>
  import { onMount } from "svelte";

  let productos = $state([]);
  let pendiente = $state("si");

  onMount(async () => {
    const respuesta = await fetch("/productos.json");
    productos = (await respuesta.json()).productos;
    pendiente = "no";
  });
</script>

<h1>Editor</h1>
<ul data-estrategia="cliente" data-pendiente={pendiente}>
  {#each productos as producto}
    <li>{producto}</li>
  {/each}
</ul>
