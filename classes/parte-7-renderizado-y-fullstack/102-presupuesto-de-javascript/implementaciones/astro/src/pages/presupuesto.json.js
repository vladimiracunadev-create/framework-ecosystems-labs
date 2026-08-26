import { medir } from "../../presupuesto.mjs";

export const prerender = false;

export async function GET() {
  return new Response(
    JSON.stringify({
      framework: "astro",
      se_comprueba_al_construir: true,
      que_entra_en_el_presupuesto: "solo las islas: las plantillas .astro no producen JavaScript de cliente",
      ...medir(),
    }),
    { headers: { "content-type": "application/json; charset=utf-8" } },
  );
}
