# Clase 096 — Componentes de servidor

> [⬅️ Clase 095](../095-islas/README.md) · [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md) · [097 ➡️](../097-carga-de-datos-junto-a-la-ruta/README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🔴 avanzado** · Pista **`fullstack`** (Renderizado y full-stack)
>
> ✅ **Clase construida** — 2 implementaciones verificadas contra [`contrato.json`](contrato.json).

> 👥 **Dos implementaciones, y es la comparación entera.** Next.js tiene
> componentes de servidor. Remix no. Los dos son React, los dos consiguen que el
> código del servidor no viaje, y lo consiguen por caminos que no se parecen en
> nada. Esta clase existe para poner esos dos caminos uno al lado del otro.

## 🎯 Objetivo

Un componente de React no podía importar `node:fs`. Nunca. Lo que se importa
desde un componente acaba en el paquete del navegador, y ahí `node:fs` no
existe.

Los componentes de servidor rompen esa regla. **¿Cómo se comprueba que la
rompen sin filtrar nada?** Descargando todo el JavaScript que la página manda y
buscando dentro.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Comprobar por ti mismo** que el código de un componente no llega al
  navegador, sin fiarte de la documentación de nadie.
- **Explicar la regla** de qué puede importar qué en el App Router, y por qué un
  componente de cliente puede *recibir* uno de servidor pero no *importarlo*.
- **Reconocer el mecanismo de Remix** —borrar los `loader` del paquete de
  cliente— y decir qué resuelve y qué no.
- **Nombrar el problema real** que los componentes de servidor vinieron a
  resolver, que no es la seguridad.

## 🧩 La situación

Un almacén con tres artículos, guardados en un archivo JSON en el disco del
servidor. Una página que dice cuántos hay.

Y un módulo que **no puede viajar**: importa `node:fs`, lee el archivo y
contiene una llave escrita en claro. Si esa llave apareciera en cualquier
archivo que el navegador descarga, sería una filtración de verdad.

El botón de «Cerrar» está ahí por un motivo: obliga a que haya un componente de
cliente **envolviendo** al que lee el disco.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | el resultado del componente, con `data-cuantos="3"` leído del disco |
| 2 | `GET /` | y va dentro de un componente interactivo, que sí viaja |
| 3 | `GET /componentes.json` | **la llave no está en ninguno de los archivos descargados** |
| 4 | `GET /componentes.json` | y la comprobación es real: se descargaron archivos con bytes |
| 5 | `GET /componentes.json` | cada uno declara si los tiene y qué cuesta lo suyo |
| 6 | `GET /` | la página no expone la llave por otra vía |

El caso 3 no es una afirmación: es un registro de una búsqueda.

```json
        "json_contiene": {
          "la_llave_no_viaja": true,
          "guiones_con_la_llave": 0,
          "guiones_con_node_fs": 0,
          "el_resultado_si_llega": true
        }
```

Y el caso 4 está ahí porque un cero es fácil de conseguir haciendo trampa: si no
se descarga nada, no se encuentra nada. `json_distinto` exige que
`guiones_descargados` y `bytes_descargados` no sean cero.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Componente de servidor**](../../../glosario/README.md#componente-de-servidor) | Un componente que se ejecuta **solo** en el servidor y cuyo resultado viaja ya pintado. Su código y sus dependencias no llegan al navegador — puede leer de la base de datos directamente. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Next.js** | react-metaframework de JavaScript/TypeScript (TypeScript) | 2016 | MIT | Vercel |
| **Remix** | react-metaframework de JavaScript/TypeScript (TypeScript) | 2021 | MIT | proyecto independiente |

### 🔧 Next.js

Convirtió el renderizado en servidor en la opción por omisión del ecosistema React. Su acoplamiento con una plataforma concreta es la dimensión que el módulo 11 obliga a puntuar.

- **Documentación oficial:** <https://nextjs.org/docs>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `next ^15.2.4, react ^19.1.0, react-dom ^19.1.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
pnpm exec next build
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 pnpm exec next start -p 3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `almacen/existencias.json` | datos en JSON usados por la implementación |
| `app/Inventario.jsx` | componente en JSX |
| `app/Marco.jsx` | componente en JSX |
| `app/componentes.json/route.js` | código JavaScript |
| `app/layout.js` | código JavaScript |
| `app/page.js` | código JavaScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `next.config.mjs` | código JavaScript (módulo ES) |

### 🔧 Remix

Apostó por los estándares de la plataforma web —formularios, respuestas, caché— frente a abstracciones propias. Su fusión con React Router es un ejemplo de convergencia entre proyectos.

- **Documentación oficial:** <https://remix.run/docs>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `@remix-run/node ^2.16.3, @remix-run/react ^2.16.3, @remix-run/serve ^2.16.3, isbot ^5.1.25, react ^18.3.1, react-dom ^18.3.1, @remix-run/dev ^2.16.3, vite ^6.2.3`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
pnpm exec remix vite:build
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 pnpm exec remix-serve ./build/server/index.js
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `almacen/existencias.json` | datos en JSON usados por la implementación |
| `app/Inventario.jsx` | componente en JSX |
| `app/Marco.jsx` | componente en JSX |
| `app/root.jsx` | componente en JSX |
| `app/routes/_index.jsx` | componente en JSX |
| `app/routes/componentes[.]json.js` | código JavaScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### El módulo que no puede viajar, idéntico en las dos

[`nextjs/servidor/secretos.js`](implementaciones/nextjs/servidor/secretos.js):

```javascript
 * Que un componente pueda importar esto y seguir siendo un componente es la
 * novedad entera de los componentes de servidor. Antes había que sacar el dato
 * en una función aparte —un `loader`, un `getServerSideProps`— y pasarlo hacia
 * abajo por propiedades.
 */

/** Si esta cadena aparece en un archivo que el navegador descarga, hay una
 *  filtración. El contrato la busca en todos, uno por uno. */
export const LLAVE_QUE_NO_DEBE_VIAJAR = "llave-de-servidor-7c1f9e";
```

```javascript
/** Lee el almacén del disco. `node:fs` no existe en el navegador: si este
 *  módulo acabara en el paquete de cliente, la construcción fallaría o el
 *  navegador reventaría al importarlo. */
export function leerElAlmacen() {
```

### La comprobación, también idéntica

[`nextjs/servidor/medicion.js`](implementaciones/nextjs/servidor/medicion.js) —
a la fuerza bruta, que aquí es lo correcto:

```javascript
 * La promesa de un componente de servidor es que **su código no llega al
 * navegador**. Eso no se comprueba leyendo documentación: se comprueba
 * descargando lo que el navegador descargaría y buscando dentro.
```

Con un detalle que hace que valga para los dos frameworks:

```javascript
/** Toda ruta absoluta a un `.js` que el documento mencione, sin repetir. Vale
 *  para los dos frameworks porque no depende de cómo declaren sus guiones. */
export function guionesQueMenciona(html) {
```

Y con su límite declarado, porque un verificador que oculta lo que no mira no
sirve de nada:

```javascript
    lo_que_no_cubre:
      "solo se sigue un nivel: lo que esos archivos importen a su vez no se descarga",
```

### Next.js · un componente que lee el disco

[`nextjs/app/Inventario.jsx`](implementaciones/nextjs/app/Inventario.jsx) — las
dos cosas a la vez son la novedad:

```jsx
 * Las dos cosas a la vez son la novedad. Antes de los componentes de servidor,
 * un componente de React no podía importar `node:fs`: lo que se importa desde un
 * componente acaba en el paquete del navegador, y ahí `node:fs` no existe.
```

```jsx
 * La forma de resolverlo era sacar la lectura fuera del componente —a un
 * `loader`, a `getServerSideProps`— y pasar el resultado hacia abajo por
 * propiedades. Eso funciona, y tiene un coste concreto: el dato tiene que
 * atravesar todos los componentes que haya en medio, aunque no les importe.
```

**Y la regla que hay que memorizar**, en el componente que envuelve —
[`app/Marco.jsx`](implementaciones/nextjs/app/Marco.jsx):

```jsx
 * Funciona porque lo que se pasa no es el componente sino **su resultado ya
 * renderizado**. El navegador recibe un hueco relleno, no una función que
 * ejecutar. Por eso `Inventario` puede leer el disco aun estando dentro de esto.
 *
 * La regla que se deduce, y que vale para cualquier proyecto: un componente de
 * cliente no puede IMPORTAR uno de servidor, pero sí puede RECIBIRLO.
```

Y lo que desaparece de la página — [`app/page.js`](implementaciones/nextjs/app/page.js):

```javascript
 * Fíjate en lo que NO hay aquí: ninguna función de carga de datos, ningún
 * `loader`, ningún objeto que baje por propiedades. La página compone y ya está;
 * quien necesita el dato va a buscarlo.
```

### Remix · borrar el `loader` del paquete

[`remix/vite.config.js`](implementaciones/remix/vite.config.js) — el mecanismo,
que es más viejo y más simple:

```javascript
 * Su mecanismo es más viejo y más simple: al construir el paquete del navegador,
 * **borra las exportaciones `loader` y `action` de cada archivo de ruta** y todo
 * lo que solo ellas usaban. Por eso un `loader` puede importar `node:fs` sin que
 * `node:fs` acabe en el navegador.
```

Y lo que sí y lo que no:

```javascript
 * Lo que Remix no puede hacer es que **un componente** lea el disco. El dato lo
 * saca la ruta y baja por propiedades. Con un nivel no se nota; con seis, sí.
```

La diferencia cabe en un archivo —
[`app/routes/_index.jsx`](implementaciones/remix/app/routes/_index.jsx):

```jsx
 * Lo que no puede hacer es que `Inventario` lo pida por su cuenta. El número
 * sale de aquí, entra por `useLoaderData` y baja por propiedades a través de
 * `Marco`, que no lo necesita para nada.
```

**Y la mitad honesta de la comparación**, escrita en el componente que se quedó
sin poder leer — [`app/Inventario.jsx`](implementaciones/remix/app/Inventario.jsx):

```jsx
 * Así que recibe el número ya hecho. Funciona perfectamente, y esa es la mitad
 * honesta de la comparación: **lo que los componentes de servidor resuelven no
 * es un problema de imposibilidad, es uno de acoplamiento**. El dato tiene que
 * atravesar todo lo que haya entre la ruta y quien lo usa.
```

Con una ventaja de Remix que no conviene pasar por alto —
[`app/Marco.jsx`](implementaciones/remix/app/Marco.jsx):

```jsx
 * Es un modelo más fácil de explicar que el de Next —no hay dos clases de
 * componente— y más caro de ejecutar, porque no hay forma de que algo se quede
 * en el servidor.
```

## 🔬 Comparación

| | Next.js | Remix |
| --- | --- | --- |
| ¿Tiene componentes de servidor? | ✅ | ❌ |
| Qué se queda en el servidor | cualquier componente sin `"use client"` | solo `loader` y `action` |
| ¿Puede un componente leer el disco? | ✅ | ❌ |
| ¿Hay que pasar el dato por propiedades? | ❌ | ✅ |
| Clases de componente que aprender | dos, con reglas entre ellas | una |
| Archivos descargados por la página | 6 | 5 |
| Bytes descargados | 463 706 B | 262 266 B |
| **Archivos con la llave** | **0** | **0** |

Cuatro lecturas:

- **Los dos ceros de la última fila son el resultado principal.** Ninguno de los
  dos filtra nada. Quien elija entre los dos por seguridad está eligiendo por un
  motivo que no existe.
- **Lo que separa a los dos es el acoplamiento, no la capacidad.** Todo lo que
  hace la página de Next se puede hacer con un `loader`. Lo que cambia es cuánta
  gente tiene que enterarse: en Remix, `Marco` recibe y reenvía un dato que no le
  importa. Con un nivel no duele. Con seis, es el problema que esta tecnología
  vino a resolver.
- **El modelo de Remix es más fácil de explicar, y eso vale dinero.** Una sola
  clase de componente, ninguna regla sobre qué puede importar qué, ningún error
  en tiempo de construcción por poner una importación donde no tocaba. Next paga
  esa complejidad a cambio de la composición.
- **Los bytes no comparan lo mismo.** Next descarga más porque su tiempo de
  ejecución es mayor, no porque los componentes de servidor cuesten. La cifra
  está en la tabla para que no se saque de contexto en otra parte.

## ⚠️ Errores frecuentes

- **Creer que un componente de servidor es una medida de seguridad.** No lo es:
  Remix consigue lo mismo sin tenerlos. Lo que resuelven es el acoplamiento.
- **Importar un componente de servidor desde uno de cliente.** No funciona, y el
  error que da no siempre lo explica. La forma correcta es pasarlo como
  `children`.
- **Poner `"use client"` «por si acaso».** Cada archivo con esa directiva
  arrastra al navegador todo lo que importa. Es la forma más rápida de convertir
  un proyecto con componentes de servidor en uno sin ellos.
- **Suponer que lo que no viaja tampoco se ejecuta.** El componente de servidor
  se ejecuta en cada petición: si lee el disco, lee el disco cada vez. La clase
  099 mira el coste de eso cuando hay varios en cadena.
- **Fiarse de que algo no viaja porque lo dice la documentación.** Descargarlo y
  buscar dentro cuesta veinte líneas, y esas veinte líneas están en esta clase.

## ✅ Verificación

```bash
node scripts/run-class.mjs 096
```

Para hacerlo tú, con cualquiera arrancada, la versión de una línea:

```bash
curl -s http://127.0.0.1:4100/componentes.json
```

Y la comprobación manual, que es la que de verdad convence: abre el código
fuente de la página, copia una de las rutas `.js`, descárgala y busca dentro
`llave-de-servidor-7c1f9e`.

## 🧪 Reto de transferencia

1. **Busca tus propias llaves.** Descarga el JavaScript de tu aplicación y busca
   dentro las cadenas de tus variables de entorno. Es la comprobación más barata
   de seguridad que existe y casi nadie la hace.
2. **Cuenta los saltos.** En tu pantalla más profunda, mira cuántos componentes
   atraviesa un dato desde donde se carga hasta donde se usa. Ese número es la
   medida del problema que esta clase describe.
3. **Convierte un componente en uno de servidor.** Quítale `"use client"` y mira
   qué se rompe. Lo que se rompa te dirá qué parte de él era de verdad
   interactiva.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 094](../094-hidratacion/README.md) — qué cuesta hidratar
- [Clase 095](../095-islas/README.md) — hidratar solo lo que lo necesita
- [Clase 097](../097-carga-de-datos-junto-a-la-ruta/README.md) — dónde se piden los datos
- [Clase 099](../099-la-cascada-de-peticiones/README.md) — qué pasa cuando se encadenan
- [Índice de la parte 7](../README.md)

## Fuentes

- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@react-server-components] *React Server Components*. Meta — React — <https://react.dev/reference/rsc/server-components>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
- [@riva-nextjs] Riva, Michele. *Real-World Next.js*. Packt Publishing, 2022. ISBN 9781801073493 — <https://openlibrary.org/isbn/9781801073493>
