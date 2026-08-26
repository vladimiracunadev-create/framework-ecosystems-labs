<script>
  // CAMPO NO CONTROLADO: el valor de partida, y el elemento se queda con él.
  //
  // Sin `bind:` y sin manejador, Svelte escribe el atributo una vez y no vuelve
  // a mirarlo. El dueño del valor pasa a ser el `<input>` del navegador.
  let { texto = "" } = $props();
</script>

<input data-campo="no-controlado" value={texto} />
