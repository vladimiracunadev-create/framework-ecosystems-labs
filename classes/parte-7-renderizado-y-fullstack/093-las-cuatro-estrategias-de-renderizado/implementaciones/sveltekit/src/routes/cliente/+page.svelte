<script>
  import { onMount } from "svelte";

  // LA TERCERA ESTRATEGIA, ESCRITA COMO SE ESCRIBE MAL A PROPÓSITO.
  //
  // Cargar los datos en `onMount` es exactamente lo que la clase 087 verificó
  // que NO ocurre en el servidor. Así que el HTML sale con la lista vacía, y el
  // contenido aparece cuando el navegador ejecuta el JavaScript.
  //
  // En SvelteKit esto es una decisión, no un descuido: si los datos se pidieran
  // desde `load`, llegarían en el HTML. Ponerlos aquí es elegir la estrategia de
  // cliente.
  let tareas = $state([]);
  let pendiente = $state("si");

  onMount(async () => {
    const respuesta = await fetch("/tareas.json");
    tareas = (await respuesta.json()).tareas;
    pendiente = "no";
  });
</script>

<ul data-estrategia="cliente" data-pendiente={pendiente}>
  {#each tareas as tarea}
    <li>{tarea}</li>
  {/each}
</ul>
