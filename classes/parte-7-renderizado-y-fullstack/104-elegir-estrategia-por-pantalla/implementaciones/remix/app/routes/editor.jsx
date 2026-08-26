import { useEffect, useState } from "react";

/**
 * LA TERCERA PANTALLA, y en Remix cuesta más código que en los otros cuatro.
 *
 * No hay forma de decir «esta ruta no se renderiza en el servidor»: hay que no
 * usar el `loader` y pedir los datos desde un efecto, que es escribir a mano lo
 * que los demás declaran en una línea.
 *
 * Es la manera más clara de ver la postura del framework: **el camino cómodo es
 * el del servidor**, y apartarse de él cuesta más código, no menos.
 */
export default function Editor() {
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
