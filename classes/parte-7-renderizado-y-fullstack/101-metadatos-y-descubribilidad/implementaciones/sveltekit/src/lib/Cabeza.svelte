<script>
  // `<svelte:head>` ES EL PUNTO INTERMEDIO ENTRE LAS DOS POSTURAS.
  //
  // Se escriben etiquetas, como en Astro, pero dentro de un elemento especial que
  // el framework reconoce: SvelteKit las recoge de todos los componentes del
  // árbol y las pone en la cabecera del documento.
  //
  // Con una consecuencia práctica que la sintaxis no deja ver: si dos
  // componentes ponen `<title>`, el que gana es el del último renderizado. No es
  // una API que resuelva conflictos como la de Next, pero tampoco es el «cada
  // uno escribe lo que quiera» de Astro.
  let { meta, origen } = $props();
  const canonica = `${origen}${meta.ruta}`;
</script>

<svelte:head>
  <title>{meta.titulo}</title>
  <meta name="description" content={meta.descripcion} />
  <link rel="canonical" href={canonica} />
  <meta property="og:title" content={meta.titulo} />
  <meta property="og:description" content={meta.descripcion} />
  <meta property="og:type" content={meta.tipo} />
  <meta property="og:url" content={canonica} />
</svelte:head>
