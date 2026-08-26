export default defineEventHandler(async (event) => {
  const host = getRequestHeader(event, "host");
  const html = await (await fetch(`http://${host}/tareas`)).text();
  const encontrado = html.match(/data-secuencia="([^"]*)"/);
  const secuencia = encontrado && encontrado[1] ? encontrado[1].split("|") : [];
  return {
    framework: "nuxt",
    secuencia,
    la_carga_empieza_antes_del_render:
      secuencia[0] === "carga:inicio" && secuencia[secuencia.length - 1] === "render",
    se_ejecuta_en: "el servidor",
    hace_falta_un_efecto_en_el_cliente: false,
    donde_vive_la_carga: "en useAsyncData, dentro del componente pero con una clave que el framework conoce",
    tiene_nombre_conocido_por_el_framework: true,
    puede_el_framework_adelantarla_al_navegar: true,
    como_se_da_un_404: "createError con statusCode 404 y fatal: true",
  };
});
