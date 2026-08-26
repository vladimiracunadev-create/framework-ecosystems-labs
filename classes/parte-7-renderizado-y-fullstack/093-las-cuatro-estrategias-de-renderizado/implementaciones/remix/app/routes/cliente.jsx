import { useEffect, useState } from "react";

/**
 * LA TERCERA ESTRATEGIA, sin `loader`.
 *
 * En Remix, no escribir un `loader` es exactamente la forma de renunciar al
 * servidor: sin él no hay datos que renderizar, así que el HTML sale vacío y el
 * efecto los trae después.
 *
 * Es la manera más clara de ver la postura del framework: **el camino cómodo es
 * el del servidor**, y hacerlo en el cliente cuesta más código, no menos.
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
