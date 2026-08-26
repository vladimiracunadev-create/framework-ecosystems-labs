# Por qué sí y por qué no — Componentes de servidor

> [⬅️ Clase 096](README.md) · [📚 Parte 7](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Next.js](../../../atlas/fichas/nextjs.md) | Quien necesita el dato lo pide donde está, sin que nadie más se entere | Dos clases de componente con reglas entre ellas, y errores que solo aparecen al construir | Aprender qué puede importar qué, y revisarlo en cada revisión de código |
| [Remix](../../../atlas/fichas/remix.md) | Una sola clase de componente y ninguna regla que memorizar | El dato baja por propiedades a través de todo lo que haya en medio | Acoplamiento que crece con la profundidad del árbol |

## 🧭 Lo que este contrato no puede probar

- **Que la llave no viaje en el segundo nivel.** El comprobador descarga lo que
  el documento menciona; lo que esos archivos importen a su vez no se sigue. Está
  declarado en el propio JSON, en `lo_que_no_cubre`, porque un verificador que
  oculta lo que no mira es peor que no tener ninguno.
- **El coste del acoplamiento.** Con un componente en medio, pasar el dato por
  propiedades no duele. La clase mide dos implementaciones de un nivel, y el
  problema es de seis.
- **Qué pasa al construir mal.** El error de importar un componente de servidor
  desde uno de cliente aparece en tiempo de construcción, y este contrato solo
  ve proyectos que construyeron bien.
- **El coste de ejecución.** Un componente de servidor se ejecuta en cada
  petición. Si lee el disco, lee el disco cada vez, y con varios en cadena eso es
  la clase 099.

## 💡 Lo que hay que llevarse

Lo primero, y es lo que más se malinterpreta: **los componentes de servidor no
son una medida de seguridad**. Remix no los tiene y consigue exactamente el mismo
cero en la última fila de la tabla. Antes que ellos, `getServerSideProps` hacía
lo mismo. El código del servidor lleva veinte años quedándose en el servidor.

Lo que resuelven es otra cosa, y es un problema de arquitectura: **quién tiene
que enterarse de que un dato existe**. Sin ellos, el dato lo saca la ruta y baja
por propiedades atravesando todo lo que haya en medio. Cada componente
intermedio recibe algo que no le importa y lo reenvía. Con un nivel, da igual.
Con seis, la firma de cada componente está contaminada por las necesidades de sus
hijos, y cambiar lo que un componente hoja necesita obliga a tocar seis archivos.

A cambio hay un precio que la comparación deja claro: **dos clases de
componente**. Un archivo puede importar a otro o no según una directiva que está
en su primera línea, los errores aparecen al construir y no al escribir, y quien
llega nuevo al proyecto tiene que aprender una regla que en Remix no existe.

Ninguno de los dos modelos es el correcto. Lo que sí se puede decir con los
números delante es esto: **si tu árbol es plano, los componentes de servidor te
cobran complejidad sin darte nada.** El problema que resuelven aparece con la
profundidad, y merece la pena comprobar que la tienes antes de pagar por la
solución.

Es el mismo criterio de la clase 095 con las islas: la tecnología se apoya en una
proporción, y la proporción hay que medirla en tu proyecto, no aceptarla del
material de promoción de nadie.

## Fuentes

- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@react-server-components] *React Server Components*. Meta — React — <https://react.dev/reference/rsc/server-components>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
