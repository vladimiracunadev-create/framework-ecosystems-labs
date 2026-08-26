# Por qué sí y por qué no — Elegir estrategia por pantalla

> [⬅️ Clase 104](README.md) · [📚 Parte 7](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Astro](../../../atlas/fichas/astro.md) | Una línea por página, y la de al lado puede decir lo contrario | Sin visión de conjunto: hay que abrir todas para auditar | Recordar poner la línea en cada página nueva |
| [Next.js](../../../atlas/fichas/nextjs.md) | El constructor publica la estrategia de cada ruta con un símbolo | Leer una cookie convierte la ruta en dinámica sin avisar | Auditar construyendo, no leyendo |
| [SvelteKit](../../../atlas/fichas/sveltekit.md) | Dos constantes distintas para dos decisiones distintas | El adaptador manda por encima de lo que digan las rutas | Dos sitios donde mirar cuando algo no sale como se pidió |
| [Nuxt](../../../atlas/fichas/nuxt.md) | La arquitectura entera se lee en una tabla de tres líneas | La decisión está lejos de la pantalla y se desincronizan | Una tabla que hay que mantener a mano |
| [Remix](../../../atlas/fichas/remix.md) | Nada que decidir: una sola forma y ninguna documentación | La decisión se va a la configuración del despliegue | Que el criterio deje de estar en el repositorio |

## 🧭 Lo que este contrato no puede probar

- **Que las decisiones sean las correctas para tu producto.** Lo que se verifica
  es que cada pantalla hace lo que dice hacer y que el motivo está escrito. Si el
  motivo es malo, el contrato pasa igual.
- **El revalidado.** La cuarta estrategia de la clase 093 sigue sin medirse: hace
  falta esperar a que venza un plazo, y los cinco lo implementan distinto.
- **Qué pasa desplegado.** El catálogo estático servido por una red de
  distribución y el mismo catálogo servido por Node son la misma construcción con
  rendimientos incomparables.
- **La estrategia de Remix.** Su catálogo devuelve el mismo sello dos veces y no
  es una página estática: es un módulo evaluado una vez. El contrato ve lo mismo
  en los cinco y solo en cuatro significa lo mismo. Está declarado en su código,
  no verificado.

## 💡 Lo que hay que llevarse

Esta clase cierra la parte 7, y lo que cierra no es una comparación de
frameworks: es un criterio. **Tres preguntas, todas sobre el producto:**

1. **¿Es igual para todo el mundo?** Si no, se cae lo estático.
2. **¿Cambia más o menos a menudo que los despliegues?** Menos: estático. Mucho
   más y con muchas páginas: revalidado. A cada minuto: servidor.
3. **¿Importa el primer pintado?** Si la pantalla está detrás de un acceso y
   nadie comparte su enlace, normalmente no, y el cliente sale barato.

Ninguna de las tres menciona un framework. Los cinco de esta parte ejecutan la
respuesta; ninguno la da, y confundir las dos cosas es el error que la clase 093
abrió y esta cierra.

De ahí sale la frase que resume la parte entera: **no hay técnicas malas, hay
técnicas mal colocadas**. Cargar los datos desde el navegador arruina un catálogo
y es correcto en un editor. Generar al construir es lo mejor que le puede pasar a
una portada y una mentira en un panel de ventas. La misma línea, dos resultados
opuestos, y lo que decide cuál es no está en la documentación de nadie.

Y hay una lección de método que conviene llevarse aparte, porque se repitió tres
veces al construir esta parte: **la decisión hay que comprobarla, no deducirla**.
El sello que no cambia se comprueba pidiendo dos veces. Que la pantalla llegue
vacía se comprueba con un `grep`. Que `ssr = false` no renderice ni el armazón se
descubrió mirando el HTML, no leyendo la documentación. Un criterio sin una forma
de verificarlo se convierte en una costumbre en dos años.

## Fuentes

- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@astro-docs] *Astro — Documentación oficial* — <https://docs.astro.build/>
- [@sveltekit-docs] *SvelteKit — Documentación oficial* — <https://svelte.dev/docs/kit>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
