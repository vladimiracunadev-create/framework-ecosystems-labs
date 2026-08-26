import { TAREAS } from "../datos.js";

export const dynamic = "force-dynamic";

/**
 * La misma lista sin ningún componente de cliente. Ningún archivo de esta
 * pantalla lleva `"use client"`, así que no hay nada que hidratar y ninguna
 * propiedad que serializar.
 *
 * Aviso para no sacar la conclusión de más: **esto no significa que la página
 * llegue sin JavaScript**. Next envía de todas formas su tiempo de ejecución y
 * la descripción de la pantalla en su propio formato —lo que llama la carga
 * RSC—, y ahí el texto de las tareas vuelve a aparecer. `/coste.json` lo
 * cuenta, y el número es el mismo que en la pantalla hidratada.
 *
 * La clase 095 y la 102 vuelven sobre esto: quitar la interactividad no es lo
 * mismo que quitar el JavaScript.
 */
export default function Pagina() {
  return (
    <>
      <h1>Sin hidratar</h1>
      <section data-hidratacion="no">
        <ul>
          {TAREAS.map((tarea) => (
            <li key={tarea}>{tarea}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
