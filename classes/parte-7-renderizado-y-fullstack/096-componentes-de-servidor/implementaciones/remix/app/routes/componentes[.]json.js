import { comprobar } from "../../servidor/medicion.js";

export async function loader({ request }) {
  const medido = await comprobar(request.headers.get("host"));
  return Response.json({
    framework: "remix",
    tiene_componentes_de_servidor: false,
    como_se_declara: "no hay nada que declarar: lo que se queda en el servidor es el loader, y solo el loader",
    puede_un_componente_leer_el_disco: false,
    hace_falta_pasar_el_dato_por_propiedades: true,
    puede_ir_dentro_de_uno_de_cliente: false,
    lo_que_cuesta: "el acoplamiento: el dato atraviesa todos los componentes que haya entre la ruta y quien lo usa",
    lo_que_gana: "una sola clase de componente, y ninguna regla que aprender sobre qué puede importar qué",
    ...medido,
  });
}
