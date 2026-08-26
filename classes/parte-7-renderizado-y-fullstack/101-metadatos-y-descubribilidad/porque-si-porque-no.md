# Por qué sí y por qué no — Metadatos y descubribilidad

> [⬅️ Clase 101](README.md) · [📚 Parte 7](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Astro](../../../atlas/fichas/astro.md) | Se escribe HTML: no hay nada que aprender ni que recordar | Nada vigila los duplicados: dos componentes, dos títulos | Revisar a mano que solo haya un `<title>` |
| [SvelteKit](../../../atlas/fichas/sveltekit.md) | Etiquetas normales, recogidas por el framework desde cualquier componente | Gana el último renderizado, y eso no se lee en el código | Un orden de renderizado que hay que tener en la cabeza |
| [Next.js](../../../atlas/fichas/nextjs.md) | Un objeto con reglas de herencia, y puede ser asíncrono | Hay que aprender cómo se llama cada cosa en ese objeto | Lo no previsto vuelve al método manual |
| [Nuxt](../../../atlas/fichas/nuxt.md) | Nombres tipados: `ogTitel` es un error de compilación | Dos funciones —`useSeoMeta` y `useHead`— y hay que saber cuál | Recordar qué cabe en cada una |
| [Remix](../../../atlas/fichas/remix.md) | La lista de descriptores recibe los datos del `loader` | El hueco `<Meta />` se pone a mano en el documento raíz | Un archivo más donde no olvidarse |

## 🧭 Lo que este contrato no puede probar

- **Que un buscador lo indexe.** Comprobar que las etiquetas están es lo que se
  puede hacer desde aquí; qué hace un buscador con ellas depende de él y cambia
  cada año.
- **La vista previa de una red social.** Falta la imagen —`og:image`— y falta
  comprobar que la URL de esa imagen sea absoluta y accesible sin sesión, que es
  donde falla en producción.
- **El mapa del sitio y `robots.txt`.** Son parte de la descubribilidad y son
  archivos, no metadatos de una ruta. Los cinco los sirven igual de bien.
- **Que el grafo sea válido.** Se comprueba que está y que no está escapado, no
  que `schema.org` acepte su forma. Para eso hay validadores oficiales.

## 💡 Lo que hay que llevarse

Lo primero, y es el fallo concreto que esta clase encontró construyéndose: **un
título por omisión en la plantilla del documento es una trampa**. No falla nada,
no avisa nadie, la pantalla se ve perfecta, la ruta declara su título — y el
documento acaba con dos `<title>`, de los cuales se lee el primero. La prueba
cuesta un `grep -c` y casi nadie la hace.

Lo segundo es la pregunta que separa a los cinco, y otra vez no es de sintaxis:
**¿qué pasa cuando dos sitios declaran el mismo metadato?** Con etiquetas sueltas
—Astro, SvelteKit— salen las dos y decide el navegador o el orden de renderizado.
Con una API dedicada —Next, Nuxt, Remix— hay una regla escrita. En tres rutas da
igual. En veinte rutas con tres niveles de disposiciones, es la diferencia entre
un sitio indexado y uno que no.

Lo tercero es un límite común y vale la pena verlo: **los cinco dejan fuera
schema.org**. No por dejadez, sino porque es un vocabulario abierto de miles de
tipos que no cabe en una lista de nombres. En los cinco se acaba escribiendo un
`<script>` con JSON dentro, y en los cinco hay que usar la función de escribir
sin escapar —`set:html`, `dangerouslySetInnerHTML`, `{@html}`, `innerHTML`—, con
lo que eso implica si el contenido viene de fuera. La clase 077 explica qué
implica.

Y lo cuarto, que es de encuadre. Todo esto existe porque **hay un cliente que no
ejecuta JavaScript y sí importa**: el rastreador. Es exactamente el mismo
argumento de la clase 081 con la mejora progresiva, con un usuario distinto. Si
alguien necesitaba una razón comercial para que el HTML llegue hecho, esta es la
que convence a quien paga.

## Fuentes

- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@nuxt-docs] *Nuxt — Documentación oficial* — <https://nuxt.com/docs>
- [@remix-docs] *Remix — Documentación oficial* — <https://remix.run/docs>
- [@whatwg-html] *HTML Living Standard*. WHATWG — <https://html.spec.whatwg.org/>
