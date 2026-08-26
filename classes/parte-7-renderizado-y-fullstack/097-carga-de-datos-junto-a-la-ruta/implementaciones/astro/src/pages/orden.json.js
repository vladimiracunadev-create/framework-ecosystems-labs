export const prerender = false;

/**
 * Pide su propia lista y lee la secuencia que quedó escrita en el HTML.
 *
 * Es la única forma de leer el cuaderno sin suponer que el endpoint y la página
 * comparten memoria: en algunos de los cinco frameworks lo hacen y en otros no,
 * y una comprobación que dependa de eso no valdría para comparar.
 */
export async function GET({ request }) {
  const host = request.headers.get("host");
  const html = await (await fetch(`http://${host}/tareas`)).text();
  const encontrado = html.match(/data-secuencia="([^"]*)"/);
  const secuencia = encontrado && encontrado[1] ? encontrado[1].split("|") : [];
  return new Response(
    JSON.stringify({
      framework: "astro",
      secuencia,
      la_carga_empieza_antes_del_render:
        secuencia[0] === "carga:inicio" && secuencia[secuencia.length - 1] === "render",
      se_ejecuta_en: "el servidor",
      hace_falta_un_efecto_en_el_cliente: false,
      donde_vive_la_carga: "en el frontmatter de la propia página: no hay función de carga",
      tiene_nombre_conocido_por_el_framework: false,
      puede_el_framework_adelantarla_al_navegar: false,
      como_se_da_un_404: "devolviendo una Response con estado 404 desde el frontmatter",
    }),
    { headers: { "content-type": "application/json; charset=utf-8" } },
  );
}
