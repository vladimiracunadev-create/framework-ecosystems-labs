import { medir } from "../../presupuesto.mjs";

export async function loader() {
  return Response.json({
    framework: "remix",
    se_comprueba_al_construir: true,
    que_entra_en_el_presupuesto: "el tiempo de ejecución de React y Remix, y todos los componentes: no hay excepciones por ruta",
    ...medir(),
  });
}
