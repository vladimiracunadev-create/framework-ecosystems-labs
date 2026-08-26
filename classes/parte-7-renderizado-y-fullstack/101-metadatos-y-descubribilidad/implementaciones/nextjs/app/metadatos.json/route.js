export const dynamic = "force-dynamic";

export async function GET(peticion) {
  const origen = `http://${peticion.headers.get("host")}`;
  const portada = await (await fetch(`${origen}/`)).text();
  const articulo = await (await fetch(`${origen}/articulo/hola-mundo`)).text();
  const titulo = (html) => (html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? "";
  return Response.json({
    framework: "nextjs",
    como_se_declara: "devolviendo un objeto desde generateMetadata, que Next convierte en etiquetas",
    donde_vive: "en el propio archivo de la ruta, junto al componente",
    hay_api_dedicada: true,
    evita_duplicados: true,
    se_emiten_en_el_servidor: true,
    titulos_distintos_por_ruta: titulo(portada) !== titulo(articulo) && titulo(articulo).length > 0,
    titulo_de_la_portada: titulo(portada),
    titulo_del_articulo: titulo(articulo),
  });
}
