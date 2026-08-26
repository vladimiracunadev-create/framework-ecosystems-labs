<script>
  let { data } = $props();
</script>

<h1>Panel</h1>
<p data-estrategia="servidor" data-sello={data.marca}>
  {data.ventas.pedidos} pedidos, {data.ventas.importe} euros
</p>
