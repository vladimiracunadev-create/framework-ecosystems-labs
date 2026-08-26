"use client";

import { useEffect, useState } from "react";

/**
 * `"use client"` ES LA FRONTERA.
 *
 * Esa directiva en la primera línea marca dónde acaba el servidor y empieza el
 * navegador. Todo lo que se importe desde aquí hacia abajo **viaja al cliente**.
 *
 * Y esta página además carga sus datos en un efecto, que la clase 087 verificó
 * que no corre en el servidor. Resultado: el HTML sale con la lista vacía.
 *
 * En Next esto es una decisión deliberada y casi siempre equivocada — teniendo
 * componentes de servidor, pedir los datos en el cliente renuncia a lo que el
 * framework hace mejor. Está aquí porque la estrategia hay que poder verla.
 */
export default function Cliente() {
  const [tareas, ponerTareas] = useState([]);
  const [pendiente, ponerPendiente] = useState("si");

  useEffect(() => {
    fetch("/tareas.json")
      .then((r) => r.json())
      .then((datos) => {
        ponerTareas(datos.tareas);
        ponerPendiente("no");
      });
  }, []);

  return (
    <ul data-estrategia="cliente" data-pendiente={pendiente}>
      {tareas.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}
