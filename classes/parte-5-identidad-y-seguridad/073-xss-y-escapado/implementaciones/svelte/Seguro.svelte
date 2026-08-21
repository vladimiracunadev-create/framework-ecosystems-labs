<script>
  // La interpolación normal de Svelte: {texto} escapa por omisión.
  let { texto } = $props();
</script>

<p>{texto}</p>
