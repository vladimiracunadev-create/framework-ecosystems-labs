import { medir } from "../../presupuesto.mjs";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    framework: "nextjs",
    se_comprueba_al_construir: true,
    que_entra_en_el_presupuesto: "el tiempo de ejecución de React y Next, más lo que lleve \"use client\"",
    ...medir(),
  });
}
