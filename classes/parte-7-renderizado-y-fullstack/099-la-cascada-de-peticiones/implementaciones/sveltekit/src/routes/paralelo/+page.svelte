<script>
  import Panel from "$lib/Panel.svelte";
  let { data } = $props();
</script>

<Panel como="paralelo" datos={data.datos} />
