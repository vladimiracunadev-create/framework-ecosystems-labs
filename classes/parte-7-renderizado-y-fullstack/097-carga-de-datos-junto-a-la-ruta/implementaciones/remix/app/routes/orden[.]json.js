export async function loader({ request }) {
  const host = request.headers.get("host");
  const html = await (await fetch(`http://${host}/tareas`)).text();
  const encontrado = html.match(/data-secuencia="([^"]*)"/);
  const secuencia = encontrado && encontrado[1] ? encontrado[1].split("|") : [];
  return Response.json({
    framework: "remix",
    secuencia,
    la_carga_empieza_antes_del_render:
      secuencia[0] === "carga:inicio" && secuencia[secuencia.length - 1] === "render",
    se_ejecuta_en: "el servidor",
    hace_falta_un_efecto_en_el_cliente: false,
    donde_vive_la_carga: "en el propio archivo de la ruta, exportado con el nombre loader",
    tiene_nombre_conocido_por_el_framework: true,
    puede_el_framework_adelantarla_al_navegar: true,
    como_se_da_un_404: "lanzando una Response con estado 404, sin función del framework",
  });
}
