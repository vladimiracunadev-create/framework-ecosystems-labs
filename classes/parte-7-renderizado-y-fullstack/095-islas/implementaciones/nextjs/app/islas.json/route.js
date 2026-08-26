import { medir } from "../medicion.js";

export const dynamic = "force-dynamic";

export async function GET(peticion) {
  const medido = await medir(peticion.headers.get("host"));
  return Response.json({
    framework: "nextjs",
    islas: ["contador", "filtro"],
    cuantas_islas: 2,
    como_se_declara: "la directiva \"use client\" en la primera línea del componente",
    que_es_una_isla_aqui: "una frontera de cliente dentro de un árbol de componentes de servidor: no es una isla suelta, es un trozo de la misma aplicación",
    el_resto_se_queda_en_el_servidor: false,
    hay_grados: "no: lo que cruza la frontera se hidrata al cargar",
    ...medido,
  });
}
