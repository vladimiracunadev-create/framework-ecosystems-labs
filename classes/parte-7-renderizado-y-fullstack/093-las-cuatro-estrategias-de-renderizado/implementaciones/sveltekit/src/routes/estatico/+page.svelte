<script>
  // EL MISMO COMPONENTE PARA LAS DOS ESTRATEGIAS.
  //
  // Recibe los datos por `data`, venga de donde venga. No sabe si su `load`
  // corrió al construir o hace un milisegundo — y esa ignorancia es lo que
  // permite cambiar de estrategia sin tocar la interfaz.
  let { data } = $props();
</script>

<ul data-estrategia={data.estrategia} data-sello={data.marca}>
  {#each data.tareas as tarea}
    <li>{tarea}</li>
  {/each}
</ul>
