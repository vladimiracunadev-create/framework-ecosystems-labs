# Clase 104 — Elegir estrategia por pantalla

> [⬅️ Clase 103](../103-hipermedia-como-alternativa/README.md) · [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md) · [105 ➡️](../../parte-8-tiempo-real-y-segundo-plano/105-sondeo/README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🔴 avanzado** · Pista **`fullstack`** (Renderizado y full-stack)
>
> ✅ **Clase construida** — 5 implementaciones verificadas contra [`contrato.json`](contrato.json).
>
> 🏁 **Última clase de la parte 7.** Aquí se junta todo lo anterior en una sola
> aplicación, y sale un criterio que cabe en tres preguntas.

## 🎯 Objetivo

La clase 093 puso la misma pantalla de cuatro maneras para poder compararlas.
Esta pone **tres pantallas distintas de un mismo producto**, cada una con la
estrategia que le toca, en una sola aplicación.

Y lo que hay que llevarse no son las tres decisiones: son **las tres preguntas
que las deciden**, que no son técnicas y se pueden hacer en una reunión.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Elegir la estrategia de una pantalla** con tres preguntas sobre el producto,
  sin discutir de frameworks.
- **Convivir**: tres estrategias en un despliegue, sin proyectos separados.
- **Reconocer que no hay técnicas malas**, solo técnicas mal colocadas: la misma
  línea que arruina una portada es correcta en un editor.
- **Saber dónde declara cada framework la decisión**, y qué cuesta cambiarla.

## 🧩 La situación

Una tienda pequeña, tres pantallas:

- **`/catalogo`** — tres productos. Lo ve todo el mundo, es igual para todos, y
  cambia cuando se publica algo. → **estático**.
- **`/panel`** — las ventas de hoy. Es de quien ha entrado y cambia mientras se
  mira. → **servidor**.
- **`/editor`** — el editor de productos. Detrás de un acceso, nadie comparte su
  enlace, y lo que importa es la interacción. → **cliente**.

Tres pantallas, tres estrategias, **una aplicación y un despliegue**.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /catalogo` | los productos y su sello — y lo guarda |
| 2 | `GET /catalogo` otra vez | **el sello no cambia** |
| 3 | `GET /panel` | las cifras de hoy — y guarda su sello |
| 4 | `GET /panel` otra vez | **el sello sí cambia** |
| 5 | `GET /editor` | el armazón **sin** los datos |
| 6 | `GET /decisiones.json` | las tres decisiones **con su motivo** |

El caso 6 es el que separa esta clase de una demostración técnica: **exige el
porqué**, no solo el qué.

```json
          "las_tres_preguntas": [
            "¿es igual para todo el mundo?",
            "¿cambia mas o menos a menudo que los despliegues?",
            "¿importa el primer pintado?"
          ]
```

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Next.js** | react-metaframework de JavaScript/TypeScript (TypeScript) | 2016 | MIT | Vercel |
| **Nuxt** | vue-metaframework de JavaScript/TypeScript (TypeScript) | 2016 | MIT | proyecto independiente |
| **SvelteKit** | svelte-metaframework de JavaScript/TypeScript (TypeScript) | 2022 | MIT | proyecto independiente |
| **Remix** | react-metaframework de JavaScript/TypeScript (TypeScript) | 2021 | MIT | proyecto independiente |
| **Astro** | web-metaframework de JavaScript/TypeScript (TypeScript) | 2021 | MIT | proyecto independiente |

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
| `app/catalogo/page.js` | código JavaScript |
| `app/datos.js` | código JavaScript |
| `app/decisiones.js` | código JavaScript |
| `app/decisiones.json/route.js` | código JavaScript |
| `app/editor/page.js` | código JavaScript |
| `app/layout.js` | código JavaScript |
| `app/panel/page.js` | código JavaScript |
| `app/productos.json/route.js` | código JavaScript |

### 🔧 Nuxt

El equivalente de Next.js sobre Vue, con un motor de servidor propio reutilizable fuera del framework.

- **Documentación oficial:** <https://nuxt.com/docs>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `nuxt ^3.16.1, vue ^3.5.13`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
pnpm exec nuxt build
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node .output/server/index.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `datos.ts` | código TypeScript |
| `decisiones.ts` | código TypeScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `nuxt.config.ts` | código TypeScript |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pages/catalogo.vue` | archivo del proyecto |
| `pages/editor.vue` | archivo del proyecto |
| `pages/panel.vue` | archivo del proyecto |

### 🔧 SvelteKit

Enrutado por sistema de archivos y adaptadores de despliegue intercambiables, que es una estrategia de salida incorporada al diseño.

- **Documentación oficial:** <https://svelte.dev/docs/kit>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `@sveltejs/adapter-node ^5.2.12, @sveltejs/kit ^2.20.2, @sveltejs/vite-plugin-svelte ^5.0.3, svelte ^5.25.3, vite ^6.2.3`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
pnpm exec vite build
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node build/index.js
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `src/app.html` | plantilla o marcado |
| `src/datos.js` | código JavaScript |
| `src/decisiones.js` | código JavaScript |
| `src/routes/catalogo/+page.server.js` | código JavaScript |

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
| `app/datos.js` | código JavaScript |
| `app/decisiones.js` | código JavaScript |
| `app/root.jsx` | componente en JSX |
| `app/routes/catalogo.jsx` | componente en JSX |
| `app/routes/decisiones[.]json.js` | código JavaScript |
| `app/routes/editor.jsx` | componente en JSX |
| `app/routes/panel.jsx` | componente en JSX |
| `app/routes/productos[.]json.js` | código JavaScript |

### 🔧 Astro

Arquitectura de islas: por omisión no envía JavaScript y cada componente interactivo se declara explícitamente. Permite mezclar React, Vue y Svelte en la misma página, lo que lo hace un banco de pruebas ideal para comparar.

- **Documentación oficial:** <https://docs.astro.build/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `astro ^5.6.1, @astrojs/node ^9.1.3`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
pnpm exec astro build
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node ./dist/server/entry.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `astro.config.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `src/datos.mjs` | código JavaScript (módulo ES) |
| `src/decisiones.js` | código JavaScript |
| `src/pages/catalogo.astro` | archivo del proyecto |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### Las tres preguntas, idénticas en las cinco

[`astro/src/decisiones.js`](implementaciones/astro/src/decisiones.js) — y es el
resultado de la parte entera:

```javascript
 * Este objeto es el resultado de esta parte entera. No dice qué estrategia usa
 * cada pantalla —eso se ve pidiéndolas— sino **por qué**, y el porqué se
 * responde con tres preguntas que no son técnicas:
 *
 *   1. ¿Es igual para todo el mundo?
 *   2. ¿Cada cuánto cambia, comparado con cada cuánto se despliega?
 *   3. ¿Importa el primer pintado?
 *
 * Las tres son sobre el producto. Ninguna es sobre el framework, y esa es la
 * conclusión de la parte 7.
```

Con cada decisión razonada y con su precio declarado:

```javascript
    por_que:
      "las cifras son de quien ha entrado y cambian mientras se miran: cachearlas es enseñar datos de otro o datos viejos",
    que_se_paga: "un proceso trabajando por cada visita, y una latencia que crece con la consulta",
```

Y por qué el contenido de las tres pantallas es distinto aquí y era el mismo en
la clase 093 — [`astro/src/datos.mjs`](implementaciones/astro/src/datos.mjs):

```javascript
 * Es la diferencia con la clase 093, donde tres pantallas enseñaban tres
 * estrategias sobre el mismo contenido para poder compararlas. Aquí el contenido
 * es distinto en cada una **porque las tres pantallas son distintas de verdad**,
 * y la estrategia de cada una sale de lo que esa pantalla es:
```

### Astro · una línea por página, y la de al lado dice lo contrario

[`astro/src/pages/panel.astro`](implementaciones/astro/src/pages/panel.astro):

```astro
// La misma línea con el valor contrario, en la pantalla de al lado. Eso es lo
// que esta clase quiere dejar claro: **la decisión es por pantalla y cabe en una
// línea**, no es una configuración del proyecto.
```

Y la tercera pantalla, con la frase que cierra la parte —
[`editor.astro`](implementaciones/astro/src/pages/editor.astro):

```astro
// Esa tercera respuesta es la que autoriza a hacer aquí lo que en el catálogo
// sería un error. No es una técnica peor: es la técnica correcta para una
// pantalla con estas respuestas.
```

### Next.js · y una forma de perder la decisión sin querer

[`nextjs/app/catalogo/page.js`](implementaciones/nextjs/app/catalogo/page.js):

```javascript
 * En Next hay además una forma de perder esto sin querer: usar `cookies()` o
 * `headers()` en cualquier punto del árbol convierte la ruta en dinámica.
 * `force-static` la protege, y de paso deja escrito que la decisión fue
 * deliberada.
```

Y el editor, con la conclusión dicha sin rodeos —
[`app/editor/page.js`](implementaciones/nextjs/app/editor/page.js):

```javascript
 * Eso es lo que esta clase quiere dejar dicho: **no hay técnicas malas, hay
 * técnicas mal colocadas**. La misma línea que arruina una portada es correcta
 * aquí.
```

Con un detalle de React que se descubrió aquí y vale para cualquier prueba —
[`app/panel/page.js`](implementaciones/nextjs/app/panel/page.js):

```javascript
      {/* Una sola expresión y no tres: React separa los trozos de texto con
          comentarios en el HTML, y entonces «12 pedidos» deja de estar seguido.
          Es invisible en pantalla y se ve en cuanto algo lee la respuesta. */}
```

### SvelteKit · dos formas de renderizar en el cliente, y no son iguales

[`sveltekit/src/routes/editor/+page.js`](implementaciones/sveltekit/src/routes/editor/+page.js)
— este hallazgo es el más aprovechable de la clase:

```javascript
 * SvelteKit tiene la declaración más explícita de las cinco para esto:
 * `ssr = false` dice literalmente «esta pantalla no se renderiza en el
 * servidor». Se probó y se quitó, por un motivo que se ve en el HTML: con
 * `ssr = false` **no se renderiza ni el hueco**. El documento llega con un
 * `<div>` vacío, sin la lista, sin la marca de «cargando» y sin nada donde
 * reservar el espacio.
```

```javascript
 * La diferencia entre las dos formas de «renderizar en el cliente» no está en
 * ninguna comparativa y se ve en dos líneas de `curl`.
```

Y su límite, en el panel —
[`panel/+page.server.js`](implementaciones/sveltekit/src/routes/panel/+page.server.js):

```javascript
 * En SvelteKit hay un detalle que conviene saber al tomar estas decisiones: el
 * adaptador manda por encima. Con `adapter-static` esta línea no serviría de
 * nada, porque no habría servidor donde ejecutarla. La decisión por pantalla
 * solo existe si el destino la permite.
```

### Nuxt · las tres decisiones se leen juntas

[`nuxt/nuxt.config.ts`](implementaciones/nuxt/nuxt.config.ts):

```typescript
 * Nuxt es el único de los cinco donde estas tres líneas se leen juntas, y ese es
 * su argumento para esta clase: **se puede auditar la arquitectura de la
 * aplicación sin abrir una sola pantalla**.
```

```typescript
 * Y su desventaja, que es la misma vista del revés: la decisión sobre el
 * catálogo está lejos del catálogo. Quien edite `pages/catalogo.vue` no tiene
 * ninguna pista de que esa pantalla se genera al construir, y puede meterle una
 * consulta que dependa de quién mira sin que nada proteste hasta producción.
```

Y la pantalla, que confirma el precio —
[`nuxt/pages/catalogo.vue`](implementaciones/nuxt/pages/catalogo.vue):

```vue
// LA PRIMERA PANTALLA. En el archivo no hay ninguna marca de que sea estática:
// hay que ir a `nuxt.config.ts`. Ese es el precio de tener las decisiones
// juntas, y conviene saberlo antes de elegir esta forma.
```

### Remix · el que dice que esta clase no hace falta

[`remix/vite.config.js`](implementaciones/remix/vite.config.js):

```javascript
 * Su argumento —el de la clase 093— es que lo estático es un caso particular de
 * lo dinámico con una caché delante, y que esa caché la resuelve mejor una red
 * de distribución con `Cache-Control` que el framework con un modo aparte.
```

**Y la honestidad que el contrato obliga a escribir** —
[`app/routes/catalogo.jsx`](implementaciones/remix/app/routes/catalogo.jsx):

```jsx
 * Decirlo importa: el contrato ve el mismo sello dos veces en los cinco, y solo
 * en cuatro de ellos eso significa lo que parece.
```

Y el coste de apartarse de su camino —
[`app/routes/editor.jsx`](implementaciones/remix/app/routes/editor.jsx):

```jsx
 * Es la manera más clara de ver la postura del framework: **el camino cómodo es
 * el del servidor**, y apartarse de él cuesta más código, no menos.
```

## 🔬 Comparación

| | Dónde se declara | Qué cuesta cambiar de estrategia |
| --- | --- | --- |
| **Astro** | una línea por página | una palabra: `true` o `false` |
| **Next.js** | una línea por ruta | una palabra, y el constructor publica el resultado |
| **SvelteKit** | constantes por ruta, con el adaptador por encima | una palabra, si el adaptador lo permite |
| **Nuxt** | una tabla central | una línea de la tabla, sin tocar la pantalla |
| **Remix** | **en ningún sitio** | no se cambia: se resuelve fuera, con `Cache-Control` |

Cuatro lecturas, y la última es la de la parte entera:

- **Las tres estrategias conviven en una aplicación y un despliegue.** No hacen
  falta tres proyectos, ni tres repositorios, ni tres equipos. Eso es lo que los
  cinco metaframeworks vinieron a resolver, y en cuatro de los cinco cuesta una
  palabra por pantalla.
- **Cerca o junto: los dos sitios tienen el mismo defecto invertido.** La
  decisión al lado de la pantalla se lee al editarla y no se ve de conjunto; en
  una tabla central se audita entera y se olvida al editar. Elegir es elegir cuál
  de los dos olvidos prefieres.
- **Remix se planta, y su argumento aguanta.** Una caché con `Cache-Control`
  delante de un servidor hace lo mismo que una página estática, y es la clase 025
  aplicada. Lo que se pierde es que la decisión esté escrita en el repositorio:
  vive en la configuración del despliegue, donde no la revisa nadie.
- **La conclusión de la parte 7 no es sobre frameworks.** Las tres preguntas
  —¿es igual para todos?, ¿cambia más o menos que los despliegues?, ¿importa el
  primer pintado?— se contestan mirando el producto. Cualquiera de los cinco
  ejecuta la respuesta; ninguno la da.

## ⚠️ Errores frecuentes

- **Elegir una estrategia para todo el proyecto.** Es lo que esta parte viene a
  desmontar desde la clase 093, y aquí queda demostrado que no hace falta.
- **Copiar la técnica sin las respuestas.** Cargar en el cliente es correcto en
  el editor y es un desastre en el catálogo. La misma línea, dos resultados
  opuestos.
- **Confundir «no se renderiza en el servidor» con «llega vacío».** Con
  `ssr = false`, SvelteKit no manda ni el armazón: ni la marca de carga, ni el
  espacio reservado. Es una decisión distinta y hay que tomarla a propósito.
- **Dejar la decisión en la configuración del despliegue.** Con `Cache-Control` y
  una red de distribución se consigue lo mismo, y deja de estar en el
  repositorio. Funciona hasta que alguien cambia la configuración y nadie se
  entera.
- **Olvidar que en Next una cookie convierte la ruta en dinámica.** Leer la
  sesión en cualquier punto del árbol basta. `force-static` protege la decisión y
  la deja escrita.

## ✅ Verificación

```bash
node scripts/run-class.mjs 104
```

Para verlo tú, la prueba de una línea que descubre la estrategia de cualquier
pantalla:

```bash
curl -s http://127.0.0.1:4100/catalogo | grep -o 'data-sello="[^"]*"'
```

Ejecútalo dos veces contra `/catalogo` y dos contra `/panel`.

## 🧪 Reto de transferencia

1. **Haz las tres preguntas sobre tus pantallas.** Escribe la lista de rutas de
   tu aplicación y contesta las tres para cada una. La tabla que salga es tu
   arquitectura de renderizado, la hubieras decidido o no.
2. **Busca la pantalla mal colocada.** Casi siempre hay una: contenido público
   que se carga desde el navegador, o un panel privado que se genera al
   construir. Las dos se ven con el `curl` de arriba.
3. **Escribe el porqué al lado de la decisión.** Un comentario de una línea en la
   ruta, o una fila en la tabla. Dentro de un año, la decisión seguirá ahí y el
   motivo no, salvo que esté escrito.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 093](../093-las-cuatro-estrategias-de-renderizado/README.md) — las cuatro estrategias, una por una
- [Clase 087](../../parte-6-la-interfaz/087-efectos-y-ciclo-de-vida/README.md) — por qué el editor llega vacío
- [Clase 103](../103-hipermedia-como-alternativa/README.md) — la cuarta respuesta: no tener estado en el cliente
- [Índice de la parte 7](../README.md)

## Fuentes

- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@astro-docs] *Astro — Documentación oficial* — <https://docs.astro.build/>
- [@sveltekit-docs] *SvelteKit — Documentación oficial* — <https://svelte.dev/docs/kit>
- [@nuxt-docs] *Nuxt — Documentación oficial* — <https://nuxt.com/docs>
- [@remix-docs] *Remix — Documentación oficial* — <https://remix.run/docs>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
