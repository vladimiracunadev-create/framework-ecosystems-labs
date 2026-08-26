<script>
  let { data } = $props();
</script>

<p data-capa="hija" data-pedidos={data.pedidos.length}>{data.pedidos.length} pedidos</p>
