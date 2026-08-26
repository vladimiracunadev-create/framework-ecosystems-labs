import { useState } from "preact/hooks";

/**
 * ISLA 2: un filtro sobre la lista.
 *
 * Recibe las tareas como propiedad, así que **las tareas sí viajan**: van
 * serializadas en el atributo `props` de su `<astro-island>`. El artículo no,
 * porque no es propiedad de ninguna isla.
 *
 * Ahí está la regla que hay que llevarse: en este modelo viaja lo que cruza el
 * borde de una isla, y nada más.
 */
export default function Filtro({ tareas }) {
  const [texto, setTexto] = useState("");
  const visibles = tareas.filter((t) => t.includes(texto));
  return (
    <div data-isla="filtro">
      <input value={texto} onInput={(e) => setTexto(e.currentTarget.value)} placeholder="filtrar" />
      <ul>
        {visibles.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
