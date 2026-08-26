<script>
  import { leer } from "./cache.mjs";

  // CÓMO LO CONSUME UN COMPONENTE DE SVELTE.
  //
  // En un proyecto real, `createQuery` de `@tanstack/svelte-query`, o el
  // `load` de SvelteKit cuando el dato lo puede traer el servidor — que es
  // casi siempre la mejor respuesta y es la parte 7.
  //
  // La diferencia de ecosistema aquí es que SvelteKit resuelve gran parte de
  // esto SIN biblioteca de caché: si el dato se carga en el servidor antes de
  // renderizar, no hay estado del servidor viviendo en el cliente que gestionar.
  let { clave } = $props();
  const { dato, origen } = leer(clave);
</script>

<div data-panel={clave} data-origen={origen}>{dato}</div>
