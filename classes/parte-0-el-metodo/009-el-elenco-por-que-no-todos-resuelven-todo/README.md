# Clase 009 — El elenco: por qué no todos resuelven todo

> [⬅️ 008](../008-leer-la-documentacion-oficial-y-el-codigo-fuente/README.md) · [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [010 ➡️](../010-el-metodo-de-esta-obra/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> ✅ **Clase construida** — 10 afirmaciones verificadas contra [`contrato.json`](contrato.json).

> 🧭 **Esta clase no levanta servidores**, como la
> [004](../004-taxonomia-que-compite-de-verdad-con-que/README.md): lo que
> verifica es qué problemas puede atacar cada tecnología, y eso está en el
> catálogo, no en un puerto.

## 🎯 Objetivo

Aceptar que **los frameworks no son intercambiables como los lenguajes**.

Cualquier lenguaje de propósito general resuelve cualquier problema, mejor o
peor. Un framework no: está hecho para un tipo de problema y **no toca los
demás**. Esa asimetría es la razón de que este programa hable de «elenco» y no
de «el mejor».

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Descartar** de golpe las tecnologías que no atacan tu problema, antes de
  comparar ninguna.
- **Reconocer** cuándo una comparación mezcla piezas que se usan juntas en lugar
  de piezas que se sustituyen.
- **Explicar** por qué un elenco de cuatro puede no tener ni un solo par
  comparable.
- **Sospechar** de una categoría con un solo miembro, y saber qué significa.

## 🧩 La situación

Un elenco de cuatro: **Express**, **React**, **Prisma** y **Flutter**.

Cualquiera diría que son cuatro opciones. No lo son: son **cuatro problemas
distintos**, y en un proyecto real tres de ellas pueden convivir sin rozarse.
Express atiende peticiones, React dibuja, Prisma guarda, y Flutter dibuja en
sitios donde React no llega.

La pregunta de la clase no es cuál elegir. Es **cuál puede siquiera presentarse**
a cada problema, y la respuesta está escrita en el catálogo.

## 🧮 El contrato

Cada entrada del catálogo declara a qué problemas se dirige, en un campo
`targets`. Diez afirmaciones sobre ese campo:

| # | Afirmación | Cómo se comprueba |
| --- | --- | --- |
| 1 | Express: `backend` y `api`, **no** `web` ni `mobile` ni `persistencia` | incluye / excluye |
| 2 | React: `web` y `native`, **no** `backend` | incluye / excluye |
| 3 | Prisma: `persistencia`, y nada más | lista exacta |
| 4 | Flutter: `mobile`, `web`, `desktop`, **no** `backend` | incluye / excluye |
| 5 | Ninguna biblioteca de interfaz atiende peticiones | recuento = 0 |
| 6 | **Ningún ORM del catálogo atiende peticiones** | recuento = 0 |
| 7 | Atender peticiones: el problema más poblado (≥ 40) | recuento |
| 8 | Dibujar en móvil: mucho menos (15–25) | recuento |
| 9 | Guardar datos: menos todavía (8–20) | recuento |
| 10 | Flutter no tiene competidores en su categoría | lista vacía |

**Los casos 5 y 6 son el corazón de la clase.** No dicen que Prisma no atienda
peticiones: dicen que **ninguno de los ocho ORM del catálogo lo hace**. La
separación no es una convención de este repositorio ni una casualidad de estas
cuatro piezas — es cómo está construido el ecosistema entero.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Elenco**](../../../glosario/README.md#elenco) | Los frameworks para los que el problema de una clase existe de verdad. Los lenguajes son intercambiables y los frameworks no: Spring Boot no implementa reactividad en el cliente. Si un framework no lo hace de verdad, **sale del elenco con su explicación** — no se simula. |


<!-- fin generado: fichas -->

## 🧰 Las piezas, una por una

Cuatro tecnologías, cuatro problemas que no se tocan. Para cada una: a qué se
dirige, a qué **no**, y con quién se usa junto en lugar de en lugar de.

### Express — `backend`, `api`

Escucha en un puerto, encamina y responde.

- **No hace:** interfaz, persistencia, móvil.
- **Se usa junto a:** un ORM debajo y una biblioteca de interfaz delante. En un
  proyecto de este repositorio, Express + Prisma + React es una pila entera.
- **Se sustituye por:** Fastify, hapi o Koa dentro de Node —lo verificó la
  [clase 004](../004-taxonomia-que-compite-de-verdad-con-que/README.md)— o por
  Django, Flask o Gin si además cambias de lenguaje.

### React — `web`, `native`

Convierte estado en árbol de componentes y lo pinta.

- **No hace:** atender peticiones, hablar con una base de datos.
- **Se usa junto a:** cualquier cosa que sirva datos. Le da igual qué haya
  detrás, y esa indiferencia es su diseño.
- **El detalle de `native`:** es la única entrada del catálogo con ese destino, y
  no significa que React dibuje en un móvil. Significa que **su modelo de
  componentes se reutiliza fuera del navegador**, que es lo que hace React
  Native.

### Prisma ORM — `persistencia`

Un solo destino, y es el suyo.

- **No hace:** absolutamente nada de lo anterior.
- **Se usa junto a:** el framework de servidor que sea. Prisma no sabe si hay un
  Express, un NestJS o un proceso por lotes por encima.
- **La afirmación fuerte:** el caso 6 comprueba que **los ocho ORM del catálogo
  declaran cero destinos de servidor**. Un ORM que atendiera peticiones sería
  otra cosa —un framework de pila completa— y estaría en otra casilla.

### Flutter — `mobile`, `web`, `desktop`

El único con tres destinos de los cuatro, y el único con un motor de dibujo
propio.

- **No hace:** servidor ni persistencia.
- **Y no tiene competidores en su categoría.** El caso 10 lo comprueba: `ui-sdk`
  tiene **un solo miembro**.

Esa última línea merece una lectura, porque una categoría de uno es siempre una
señal:

- O bien **la taxonomía está demasiado fina** y habría que meterlo con los
  frameworks de interfaz.
- O bien **la pieza es de verdad distinta a todo lo demás**, y ese es el caso
  aquí: Flutter no usa los controles del sistema ni el navegador, dibuja cada
  píxel con su propio motor. Compararlo con React Native —que sí usa controles
  nativos— es cruzar una frontera real.

Cuando te encuentres una categoría con un solo miembro, pregúntate cuál de las
dos cosas es. La respuesta cambia con quién se compara.

## 🔬 Comparación

| | Express | React | Prisma | Flutter |
| --- | :---: | :---: | :---: | :---: |
| Atender peticiones | ✅ | — | — | — |
| Dibujar interfaz web | — | ✅ | — | ✅ |
| Dibujar en móvil | — | — | — | ✅ |
| Guardar datos | — | — | ✅ | — |
| Competidores en su categoría | 28 | 2 | 7 | **0** |

**No hay una sola casilla donde dos de las cuatro coincidan del todo.** Cuatro
tecnologías famosas, del mismo mundo, y ni un par comparable — salvo Flutter y
React en la fila de la web, y ahí la comparación cruza de biblioteca a kit
completo.

Y los recuentos del catálogo dicen algo más:

| Problema | Cuántas tecnologías lo atacan |
| --- | ---: |
| Atender peticiones (`backend`) | 44 |
| Dibujar en la web (`web`) | 38 |
| Dibujar en un móvil (`mobile`) | 16 |
| Guardar datos (`persistencia`) | 9 |

**Los problemas no están igual de poblados.** Elegir framework de servidor es
elegir entre cuarenta y cuatro; elegir ORM, entre nueve. Cuanto menos poblada
está la casilla, más pesa la decisión y menos alternativas hay si sale mal — que
es la dimensión «salir» de la
[clase 006](../006-coste-total-aprender-mantener-contratar-salir/README.md).

## ⚠️ Errores frecuentes

- **Comparar piezas que se usan juntas.** «React o Express» no es una elección:
  es una pila. Lo mismo con «Prisma o Express» y con «Next.js o React».
- **Tratar un elenco como una lista de opciones.** El elenco de una clase de este
  programa es «para quiénes tiene sentido este problema», no «entre quiénes
  elegir».
- **Suponer que un framework popular sirve para tu problema.** La popularidad no
  cambia la casilla. Flutter es enorme y no atiende una sola petición.
- **Ignorar que hay problemas casi vacíos.** Cuando en tu casilla hay tres
  opciones y no cuarenta, la decisión pesa más y conviene mirarla dos veces.
- **Aceptar sin más una categoría de un solo miembro.** O la clasificación es
  demasiado fina, o la pieza es realmente distinta. Las dos cosas cambian la
  comparación.

## ✅ Verificación

```bash
node scripts/run-class.mjs 009
```

No hay implementaciones que arrancar: se verifica en cualquier máquina con
Node.js, en menos de un segundo.

Para preguntarle tú al catálogo:

```bash
node -e "import('./scripts/lib/preguntas.mjs').then(m=>console.log(m.responder({cuantas:{targets:'mobile'}})))"
```

## 🧪 Reto de transferencia

1. **Escribe tu problema en una frase** y decide a qué destino pertenece:
   `backend`, `web`, `mobile`, `persistencia`… Luego mira cuántas tecnologías del
   catálogo lo atacan. Ese número es el tamaño real de tu decisión.
2. **Coge tu pila actual** y comprueba que no hay dos piezas en la misma casilla.
   Si las hay, o una sobra, o una de las dos está haciendo algo que no le toca.
3. **Busca en el catálogo otra categoría con un solo miembro** y decide cuál de
   las dos explicaciones es. Es el mismo ejercicio que la clase hace con Flutter.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — para qué está cada una y con qué se junta
- [Clase 004](../004-taxonomia-que-compite-de-verdad-con-que/README.md) — clasificar antes de comparar
- [Clase 006](../006-coste-total-aprender-mantener-contratar-salir/README.md) — qué cuesta la casilla poco poblada
- [Atlas: por clasificación](../../../atlas/frameworks.md#por-clasificación) — las 37 categorías con su definición
- [Índice de la parte 0](../README.md)

## Fuentes

- [@richards-ford-fundamentals] Richards, M.; Ford, N. *Fundamentals of Software Architecture: An Engineering Approach*. O'Reilly Media, 2020. ISBN 9781492043454 — <https://openlibrary.org/isbn/9781492043454>
- [@react-native-architecture] *React Native Architecture Overview*. Meta — <https://reactnative.dev/architecture/overview>
- [@brooks-mythical-man-month] Brooks, Frederick P. *The Mythical Man-Month*, ed. aniversario. Addison-Wesley, 1995. ISBN 9780201835953 — <https://openlibrary.org/isbn/9780201835953>
