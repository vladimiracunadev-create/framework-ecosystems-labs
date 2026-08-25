<script>
  // EL COMPONENTE. Un archivo, con su marcado y su script juntos.
  //
  // `$props()` es la runa de Svelte 5 para declarar lo que entra. La
  // desestructuración con valor por omisión es JavaScript corriente: aquí no
  // hay un objeto de configuración ni una lista de propiedades aparte.
  let { texto = "Hola, mundo" } = $props();
</script>

<h1 data-componente="saludo">{texto}</h1>
