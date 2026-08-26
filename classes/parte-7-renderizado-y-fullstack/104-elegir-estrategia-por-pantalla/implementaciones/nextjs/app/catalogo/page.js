import { PRODUCTOS, sello } from "../datos.js";

export const dynamic = "force-static";

/**
 * LA PRIMERA PANTALLA: el catálogo, generado al construir.
 *
 * `force-static` es la decisión, y sale de las tres preguntas: es igual para
 * todo el mundo, cambia menos que los despliegues, y el primer pintado importa.
 *
 * En Next hay además una forma de perder esto sin querer: usar `cookies()` o
 * `headers()` en cualquier punto del árbol convierte la ruta en dinámica.
 * `force-static` la protege, y de paso deja escrito que la decisión fue
 * deliberada.
 */
export default function Pagina() {
  const marca = sello();
  return (
    <>
      <h1>Catálogo</h1>
      <ul data-estrategia="estatico" data-sello={marca}>
        {PRODUCTOS.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </>
  );
}
