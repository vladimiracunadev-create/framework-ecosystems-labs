import { pedirUsuario } from "../fuente.js";

export const dynamic = "force-dynamic";

/**
 * LA DISPOSICIÓN CARGA, Y NO BLOQUEA A LA PÁGINA. HUBO QUE MEDIRLO PARA CREERLO.
 *
 * La deducción natural es la contraria: una disposición es un componente `async`
 * y sus hijos son lo que devuelve, así que hasta que este `await` no termine no
 * debería existir nada dentro. Los dos retardos deberían sumarse.
 *
 * No se suman. `children` no es el resultado de esta función: es un elemento que
 * el enrutador ya había creado antes de llamarla, y React puede resolverlo
 * mientras esta espera. La medición sale igual que en Remix y en SvelteKit.
 *
 * Es la lección de método de la clase, y por eso el comentario está escrito así
 * en lugar de borrar el error: **un modelo mental convincente no es una
 * medición**. La cascada entre niveles se busca cronometrando, no razonando.
 *
 * Lo que sí bloquea en Next es una cascada dentro del mismo componente, o un
 * componente que espera a otro para poder empezar. Para eso está `<Suspense>` y
 * el flujo de la clase 100.
 */
export default async function Disposicion({ children }) {
  const usuario = await pedirUsuario();
  return (
    <div data-capa="padre" data-usuario={usuario.nombre}>
      {children}
    </div>
  );
}
