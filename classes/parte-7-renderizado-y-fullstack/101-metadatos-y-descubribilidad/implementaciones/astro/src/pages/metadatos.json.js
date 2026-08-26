export const prerender = false;

export async function GET({ request }) {
  const origen = `http://${request.headers.get("host")}`;
  const portada = await (await fetch(`${origen}/`)).text();
  const articulo = await (await fetch(`${origen}/articulo/hola-mundo`)).text();
  const titulo = (html) => (html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? "";
  return new Response(
    JSON.stringify({
      framework: "astro",
      como_se_declara: "escribiendo las etiquetas en la cabecera, con un componente propio",
      donde_vive: "en un componente .astro que la página incluye dentro de <head>",
      hay_api_dedicada: false,
      evita_duplicados: false,
      se_emiten_en_el_servidor: true,
      titulos_distintos_por_ruta: titulo(portada) !== titulo(articulo) && titulo(articulo).length > 0,
      titulo_de_la_portada: titulo(portada),
      titulo_del_articulo: titulo(articulo),
    }),
    { headers: { "content-type": "application/json; charset=utf-8" } },
  );
}
