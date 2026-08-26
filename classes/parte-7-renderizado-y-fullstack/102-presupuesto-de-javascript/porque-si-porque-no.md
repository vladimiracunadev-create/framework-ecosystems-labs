# Por qué sí y por qué no — Presupuesto de JavaScript

> [⬅️ Clase 102](README.md) · [📚 Parte 7](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Astro](../../../atlas/fichas/astro.md) | 10 kB comprimidos para el mismo botón: el suelo más bajo del elenco | Ese suelo sube de golpe con la primera isla —clase 095— | Un motor completo la primera vez que algo se hidrata |
| [SvelteKit](../../../atlas/fichas/sveltekit.md) | 32 kB con enrutador de cliente incluido: no manda motor de árbol virtual | Necesita compilador para todo, siempre | Depender de la herramienta de construcción |
| [Nuxt](../../../atlas/fichas/nuxt.md) | 72 kB con Vue, su enrutador y su carga útil | Cuatro archivos y ninguna forma de partirlo más | Un suelo que no baja aunque la pantalla sea tonta |
| [Remix](../../../atlas/fichas/remix.md) | 84 kB con React 18 y sin excepciones que documentar | No hay interruptor por ruta: la aplicación se hidrata entera | Pagar el suelo también en pantallas que no lo necesitan |
| [Next.js](../../../atlas/fichas/nextjs.md) | 239 kB compran componentes de servidor, flujo y navegación sin recargar | El suelo más alto del elenco, con diferencia | Empezar debiendo un cuarto de megabyte |

## 🧭 Lo que este contrato no puede probar

- **Qué descarga una pantalla concreta.** La báscula pesa todo el directorio de
  cliente, que es lo correcto para un guardián —tiene que enterarse de una
  dependencia añadida en cualquier parte— y no es lo que baja un navegador al
  abrir la portada. Para eso está la técnica de la clase 096.
- **Cuánto tarda en ejecutarse.** Los bytes son una parte del coste; la otra es
  el tiempo que el dispositivo tarda en analizarlos y ejecutarlos, y eso depende
  del teléfono de quien mira.
- **Qué compra cada kilobyte.** La tabla dice que Next pesa veinticuatro veces
  más que Astro para el mismo botón. No dice que Next traiga componentes de
  servidor, flujo y navegación sin recargar, que Astro no da sin añadir otra cosa.
- **El coste de la compresión moderna.** Aquí se mide con gzip porque está en la
  biblioteca estándar de Node. Con brotli los números bajan otro quince o veinte
  por ciento, y las distancias se mantienen.

## 💡 Lo que hay que llevarse

Lo primero es lo único que hay que recordar de esta clase: **un presupuesto sin
`exit 1` no es un presupuesto**. Es un número en un documento. La diferencia
entre las dos cosas son cuatro líneas, y es la diferencia entre un límite que se
respeta durante años y uno que dura hasta la primera semana con prisa.

Lo segundo son las dos decisiones de medición, que parecen detalles y cambian el
número por un factor de tres:

- **Se mide lo comprimido**, porque es lo que viaja.
- **Se mide el directorio de cliente**, porque el código del servidor no lo
  descarga nadie. Meterlo en la cuenta castiga exactamente lo que la parte 7 ha
  venido a premiar.

Lo tercero es sobre la tabla, y conviene decirlo con cuidado. Veinticuatro veces
de diferencia para pintar el mismo botón es un número real y es un número
tramposo si se lee solo. Astro parte de cero porque no manda enrutador de
cliente ni motor de componentes; Next parte de doscientos treinta y nueve
kilobytes porque manda las dos cosas y además el mecanismo de componentes de
servidor. **El suelo alto de uno es la funcionalidad del otro.** Lo que la tabla
sí demuestra sin discusión es que el suelo existe, que es distinto, y que
elegirlo es una decisión que se toma el primer día del proyecto y no se puede
deshacer barato.

Y lo cuarto: **ninguno de los cinco trae esto de serie**. Los cinco traen
analizadores que enseñan qué ocupa qué —útiles para investigar, inútiles para
impedir—. El guardián que impide son cincuenta líneas de JavaScript, sin
dependencias, y funciona igual en los cinco. Cuando algo tan barato falta en
todas partes, casi siempre es porque nadie lo pide, no porque sea difícil.

## Fuentes

- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning Publications, 2016. ISBN 9781617293771 — <https://openlibrary.org/isbn/9781617293771>
- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
