<script>
  import Rama from "./RamaPorPropiedades.svelte";

  // EL DATO ATRAVESANDO TRES NIVELES.
  //
  // Cada `.svelte` intermedio declara `usuario` en su `$props()` y lo único que
  // hace con él es pasarlo al siguiente. En Svelte eso se ve archivo por
  // archivo, que es lo peor de todo: el coste está repartido y no se nota hasta
  // que hay que cambiar el nombre del dato en cuatro sitios.
  //
  // Svelte tiene su propio atajo antes de llegar a un almacén: `setContext` y
  // `getContext`. Y a diferencia de React o Vue, tiene además ALMACENES EN LA
  // BIBLIOTECA ESTÁNDAR —`writable`, `readable`— así que compartir estado no
  // exige traer nada de fuera.
  let { usuario } = $props();
</script>

<div data-nivel="pantalla"><Rama {usuario} /></div>
