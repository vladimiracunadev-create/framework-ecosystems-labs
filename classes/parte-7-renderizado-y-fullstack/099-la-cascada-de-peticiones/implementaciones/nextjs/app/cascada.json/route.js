import { medir } from "../medicion.js";

export const dynamic = "force-dynamic";

export async function GET(peticion) {
  return Response.json({
    framework: "nextjs",
    donde_se_arregla: "en el componente, con Promise.all; entre componentes lentos, con <Suspense>",
    anidadas_en_paralelo_por_diseno: true,
    por_que: "children es un elemento que el enrutador creó antes de llamar a la disposición, y React lo resuelve mientras esta espera",
    ...(await medir(peticion.headers.get("host"))),
  });
}
