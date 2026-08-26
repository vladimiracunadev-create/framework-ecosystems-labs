<script>
  // El mismo componente, sin botón y sin hidratar. Compara su peso con el de la
  // otra en `/coste.json`: la diferencia es lo que cuesta la interactividad.
  let { data } = $props();
</script>

<h1>Sin hidratar</h1>
<section data-hidratacion="no">
  <ul>
    {#each data.tareas as tarea}
      <li>{tarea}</li>
    {/each}
  </ul>
</section>
