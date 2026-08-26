<script>
  // LA MISMA LISTA SIN LA EXPRESIÓN DE CLAVE.
  //
  // Compila y funciona. La diferencia no está en el HTML —es idéntico— sino en
  // el código que el compilador genera para actualizarla: sin clave produce un
  // bucle que sobrescribe por posición; con clave, uno que mueve nodos.
  let { elementos } = $props();
</script>

<ul data-lista="frutas" data-total={elementos.length}>
  {#each elementos as fruta}
    <li data-clave={fruta.id}>{fruta.nombre}</li>
  {/each}
</ul>
