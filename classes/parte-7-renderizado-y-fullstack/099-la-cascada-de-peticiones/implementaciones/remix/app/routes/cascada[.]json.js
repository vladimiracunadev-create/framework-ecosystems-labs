import { medir } from "../medicion.js";

export async function loader({ request }) {
  return Response.json({
    framework: "remix",
    donde_se_arregla: "en el loader, con Promise.all",
    anidadas_en_paralelo_por_diseno: true,
    por_que: "Remix conoce todas las rutas activas antes de empezar y lanza sus loader a la vez",
    ...(await medir(request.headers.get("host"))),
  });
}
