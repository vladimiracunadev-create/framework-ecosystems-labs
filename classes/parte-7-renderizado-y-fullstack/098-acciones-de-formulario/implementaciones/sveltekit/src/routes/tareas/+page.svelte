<script>
  let { data } = $props();
</script>

<h1>Tareas</h1>
<ul>
  {#each data.tareas as tarea}
    <li data-tarea={tarea.id}>{tarea.texto}</li>
  {/each}
</ul>

<!--
  Un `<form method="POST">` sin nada más. Sin JavaScript, el navegador lo envía y
  llega a `actions.default`. Con JavaScript, se le añade `use:enhance` y
  SvelteKit lo intercepta sin recargar — y esa directiva es opcional, que es la
  forma de decir que el camino sin JavaScript es el de partida y no el de
  emergencia.
-->
<form method="POST">
  <!--
    El campo oculto declara qué se quiere hacer. En SvelteKit hay otra vía para
    lo mismo —`action="?/borrar"` elige una entrada del objeto `actions`— y es
    más limpia; el campo se deja porque el contrato es el mismo para los cinco.
  -->
  <input type="hidden" name="intencion" value="crear" />
  <input type="text" name="texto" />
  <button type="submit">Añadir</button>
</form>

<!--
  El origen de esta página, para que el contrato lo lea y lo mande de vuelta en
  la cabecera `Origin`.

  No es un adorno del ejercicio: SvelteKit rechaza con 403 cualquier POST de
  formulario cuyo `Origin` no coincida con el suyo, y lo hace **de serie, sin
  configurarlo**. Es la protección contra la falsificación de peticiones de la
  clase 080, aquí encendida por omisión. Un navegador manda esa cabecera solo; un
  `curl` sin ella, no, y por eso el contrato tiene que ponerla.
-->
<span data-origen={data.origen}></span>
