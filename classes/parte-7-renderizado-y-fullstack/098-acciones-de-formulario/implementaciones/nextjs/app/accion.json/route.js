import { cuantasTareasSeVen } from "../cuenta.js";

export const dynamic = "force-dynamic";

export async function GET(peticion) {
  return Response.json({
    framework: "nextjs",
    mecanismo: "una función con \"use server\", pasada al atributo action del formulario",
    funciona_sin_javascript: true,
    revalida_sola: false,
    como_se_declara_en_la_plantilla: "<form action={crearTarea}>, donde crearTarea es una función",
    que_hace_al_terminar: "nada, salvo que se llame a revalidatePath: hay que decirlo a mano",
    cuantas_tareas_se_ven: await cuantasTareasSeVen(peticion.headers.get("host")),
  });
}
