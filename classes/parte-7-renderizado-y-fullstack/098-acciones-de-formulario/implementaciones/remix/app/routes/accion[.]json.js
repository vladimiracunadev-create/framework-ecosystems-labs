import { cuantasTareasSeVen } from "../cuenta.js";

export async function loader({ request }) {
  return Response.json({
    framework: "remix",
    mecanismo: "una función exportada con el nombre action en el archivo de la ruta",
    funciona_sin_javascript: true,
    revalida_sola: true,
    como_se_declara_en_la_plantilla: "<Form method=\"post\">, que renderiza un <form> de verdad",
    que_hace_al_terminar: "redirige, y de paso vuelve a ejecutar los loader de las rutas activas",
    cuantas_tareas_se_ven: await cuantasTareasSeVen(request.headers.get("host")),
  });
}
