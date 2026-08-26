<script>
  let { data, children } = $props();
</script>

<div data-capa="padre" data-usuario={data.usuario.nombre}>
  {@render children()}
</div>
