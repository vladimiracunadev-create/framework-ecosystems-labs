<script>
  import { onMount } from "svelte";

  import { cuenta } from "./contadores.mjs";

  // `onMount` NO CORRE EN EL SERVIDOR, y Svelte lo dice en su documentación con
  // todas las letras: es el sitio para lo que necesita un DOM.
  //
  // La diferencia con React es qué pasa con lo demás. Aquí el cuerpo del
  // `<script>` sí corre en el servidor —es donde se prepara el componente— y el
  // efecto reactivo se declara aparte, con `$effect`.
  //
  // `$effect` deduce sus dependencias LEYÉNDOLAS: no hay lista que mantener, y
  // por tanto no existe el error de olvidar una. A cambio, tampoco se puede
  // mentir sobre cuáles son — que es lo que la lista de React permite hacer.
  let { etiqueta = "reloj" } = $props();

  cuenta.render += 1;
  let dato = $state("sin cargar");

  onMount(() => {
    cuenta.efecto += 1;
    dato = "cargado en el navegador";

    // LA LIMPIEZA: la función devuelta se ejecuta al destruir el componente.
    return () => {
      cuenta.limpieza += 1;
    };
  });
</script>

<div data-componente="reloj" data-etiqueta={etiqueta}>{dato}</div>
