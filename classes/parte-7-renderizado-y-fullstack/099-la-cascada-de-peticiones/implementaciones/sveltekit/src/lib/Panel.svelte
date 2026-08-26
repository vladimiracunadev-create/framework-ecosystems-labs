<script>
  // La misma pantalla para las dos rutas.
  let { como, datos } = $props();
</script>

<main data-como={como}>
  <h1>Hola, {datos.usuario.nombre}</h1>
  <p data-pedidos={datos.pedidos.length}>{datos.pedidos.length} pedidos</p>
  <ul>
    {#each datos.avisos as aviso}
      <li>{aviso}</li>
    {/each}
  </ul>
</main>
