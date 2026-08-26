export const dynamic = "force-dynamic";

export async function GET(peticion) {
  const host = peticion.headers.get("host");
  const html = await (await fetch(`http://${host}/tareas`)).text();
  const encontrado = html.match(/data-secuencia="([^"]*)"/);
  const secuencia = encontrado && encontrado[1] ? encontrado[1].split("|") : [];
  return Response.json({
    framework: "nextjs",
    secuencia,
    la_carga_empieza_antes_del_render:
      secuencia[0] === "carga:inicio" && secuencia[secuencia.length - 1] === "render",
    se_ejecuta_en: "el servidor",
    hace_falta_un_efecto_en_el_cliente: false,
    donde_vive_la_carga: "dentro del propio componente: la página es una función async y espera",
    tiene_nombre_conocido_por_el_framework: false,
    puede_el_framework_adelantarla_al_navegar: false,
    como_se_da_un_404: "llamando a notFound(), que lanza y Next convierte en estado 404",
  });
}
