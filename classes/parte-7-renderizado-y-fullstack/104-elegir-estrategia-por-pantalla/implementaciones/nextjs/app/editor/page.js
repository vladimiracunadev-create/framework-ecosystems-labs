"use client";

import { useEffect, useState } from "react";

/**
 * LA TERCERA PANTALLA: el editor, que llega vacío a propósito.
 *
 * `"use client"` más pedir los datos en un efecto es exactamente lo que la clase
 * 087 enseñó a evitar... en una pantalla pública. Aquí las tres preguntas dan
 * otra cosa: está detrás de un acceso, nadie comparte su enlace y el primer
 * pintado no importa.
 *
 * Eso es lo que esta clase quiere dejar dicho: **no hay técnicas malas, hay
 * técnicas mal colocadas**. La misma línea que arruina una portada es correcta
 * aquí.
 */
export default function Pagina() {
  const [productos, setProductos] = useState([]);
  const [pendiente, setPendiente] = useState("si");

  useEffect(() => {
    fetch("/productos.json")
      .then((r) => r.json())
      .then((datos) => {
        setProductos(datos.productos);
        setPendiente("no");
      });
  }, []);

  return (
    <>
      <h1>Editor</h1>
      <ul data-estrategia="cliente" data-pendiente={pendiente}>
        {productos.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </>
  );
}
