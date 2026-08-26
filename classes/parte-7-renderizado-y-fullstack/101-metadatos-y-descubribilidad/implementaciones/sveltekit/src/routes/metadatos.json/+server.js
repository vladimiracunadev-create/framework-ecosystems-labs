import { json } from "@sveltejs/kit";

export async function GET({ request }) {
  const origen = `http://${request.headers.get("host")}`;
  const portada = await (await fetch(`${origen}/`)).text();
  const articulo = await (await fetch(`${origen}/articulo/hola-mundo`)).text();
  const titulo = (html) => (html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? "";
  return json({
    framework: "sveltekit",
    como_se_declara: "escribiendo etiquetas dentro de <svelte:head>, que el framework recoge",
    donde_vive: "en el componente de la página, o en uno compartido que ella use",
    hay_api_dedicada: false,
    evita_duplicados: false,
    se_emiten_en_el_servidor: true,
    titulos_distintos_por_ruta: titulo(portada) !== titulo(articulo) && titulo(articulo).length > 0,
    titulo_de_la_portada: titulo(portada),
    titulo_del_articulo: titulo(articulo),
  });
}
