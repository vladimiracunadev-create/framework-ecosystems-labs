export default defineEventHandler(async (event) => {
  const origen = `http://${getRequestHeader(event, "host")}`;
  const portada = await (await fetch(`${origen}/`)).text();
  const articulo = await (await fetch(`${origen}/articulo/hola-mundo`)).text();
  const titulo = (html: string) => (html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? "";
  return {
    framework: "nuxt",
    como_se_declara: "llamando a useSeoMeta con los nombres tipados de cada metadato",
    donde_vive: "en el setup del componente de la página",
    hay_api_dedicada: true,
    evita_duplicados: true,
    se_emiten_en_el_servidor: true,
    titulos_distintos_por_ruta: titulo(portada) !== titulo(articulo) && titulo(articulo).length > 0,
    titulo_de_la_portada: titulo(portada),
    titulo_del_articulo: titulo(articulo),
  };
});
