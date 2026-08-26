export async function loader({ request }) {
  const origen = new URL(request.url).origin;
  const portada = await (await fetch(`${origen}/`)).text();
  const articulo = await (await fetch(`${origen}/articulo/hola-mundo`)).text();
  const titulo = (html) => (html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? "";
  return Response.json({
    framework: "remix",
    como_se_declara: "devolviendo una lista de descriptores desde una exportación llamada meta",
    donde_vive: "en el archivo de la ruta, y recibe lo que devolvió su loader",
    hay_api_dedicada: true,
    evita_duplicados: true,
    se_emiten_en_el_servidor: true,
    titulos_distintos_por_ruta: titulo(portada) !== titulo(articulo) && titulo(articulo).length > 0,
    titulo_de_la_portada: titulo(portada),
    titulo_del_articulo: titulo(articulo),
  });
}
