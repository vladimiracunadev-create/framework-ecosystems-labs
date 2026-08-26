import { comprobar } from "../../servidor/medicion.js";

export const dynamic = "force-dynamic";

export async function GET(peticion) {
  const medido = await comprobar(peticion.headers.get("host"));
  return Response.json({
    framework: "nextjs",
    tiene_componentes_de_servidor: true,
    como_se_declara: "no se declara: en el App Router todo componente lo es salvo que su archivo empiece por \"use client\"",
    puede_un_componente_leer_el_disco: true,
    hace_falta_pasar_el_dato_por_propiedades: false,
    puede_ir_dentro_de_uno_de_cliente: true,
    lo_que_cuesta: "el resultado renderizado viaja igualmente, descrito en la carga RSC",
    ...medido,
  });
}
