<script>
  // LA CLAVE VA EN LA SINTAXIS DEL BUCLE: `(fruta.id)` al final del `#each`.
  //
  // Es la forma más visible de las ocho: no es un atributo perdido entre otros,
  // es parte de la estructura del bucle, y quien lee el archivo la ve sí o sí.
  //
  // Svelte la llama «expresión de clave» y su documentación es tajante sobre
  // para qué sirve: sin ella, al cambiar la lista se actualizan los elementos
  // que hay; con ella, se mueven.
  let { elementos } = $props();
</script>

<ul data-lista="frutas" data-total={elementos.length}>
  {#each elementos as fruta (fruta.id)}
    <li data-clave={fruta.id}>{fruta.nombre}</li>
  {/each}
</ul>
