---
modulo: "11"
titulo: Selección y sostenibilidad
nivel: avanzado
horas: 10
prerrequisitos: ["08", "10"]
verificado: 2026-08-19
fuentes: [ford-evolutionary-architectures, bass-software-architecture-practice, richards-ford-fundamentals, adr-github, nist-ssdf, slsa, spdx-licenses, osi-licenses, semver, forsgren-accelerate]
---

# Módulo 11 — Selección y sostenibilidad

> Elegir un framework es contraer una deuda de mantenimiento a varios años. La
> decisión no se toma con una tabla de funcionalidades: se toma con atributos de
> calidad, capacidades del equipo y una estrategia de salida.

## Prerrequisitos y nivel

**Nivel:** avanzado. **Duración:** 10 horas. Requiere los módulos 08 y 10.

## Objetivos observables

1. Traducir un requisito de producto a atributos de calidad medibles
   [@bass-software-architecture-practice].
2. Construir una matriz de decisión con pesos declarados antes de puntuar.
3. Escribir un registro de decisión de arquitectura con alternativas y
   consecuencias [@adr-github].
4. Evaluar la salud de un proyecto de código abierto con indicadores
   verificables, sin usar la popularidad.
5. Definir una estrategia de salida y una función de aptitud que la proteja
   [@ford-evolutionary-architectures].

## Concepto independiente del framework

### De requisito a atributo medible

«Tiene que ser rápido» no es un requisito: no puede verificarse ni refutarse. Un
atributo de calidad se escribe como un escenario con estímulo, entorno y medida
[@bass-software-architecture-practice].

| Requisito difuso | Atributo de calidad medible |
| --- | --- |
| «Tiene que ser rápido» | Con 200 peticiones por segundo, el percentil 95 de `GET /tasks` está por debajo de 300 ms |
| «Tiene que ser seguro» | Cumple los requisitos de nivel 1 del estándar de verificación y se comprueba en cada entrega |
| «Tiene que ser mantenible» | Una persona nueva entrega un cambio en producción en su primera semana |
| «Tiene que escalar» | Duplicar instancias duplica el rendimiento hasta 8 instancias, con desviación menor del 15 % |

Sin esta traducción, la selección de framework se convierte en una discusión de
preferencias, porque no hay nada contra lo que contrastarla.

### La matriz de decisión, con los pesos primero

El orden importa: **primero los pesos, después las puntuaciones**. Al revés, la
matriz solo justifica la decisión ya tomada.

| Dimensión | Peso | Cómo se puntúa |
| --- | ---: | --- |
| Ajuste al producto y al destino | 20 % | ¿Resuelve el tipo de aplicación sin forzarlo? |
| Capacidades del equipo hoy | 15 % | Personas que pueden entregar sin formación previa |
| Seguridad por omisión | 15 % | Qué protege sin configurar y qué exige configurar |
| Operación y diagnóstico | 15 % | Instrumentación, mensajes de error, reproducibilidad |
| Salud y soporte del proyecto | 15 % | Ver indicadores abajo |
| Coste total de operación | 10 % | Infraestructura, licencias, tiempo de personas |
| Estrategia de salida | 10 % | Coste de sustituirlo dentro de tres años |

Los pesos son del producto, no del framework: cambian entre un panel interno y un
sistema de pagos, y esa diferencia es la que debe conducir la elección.

### Salud de un proyecto: indicadores verificables

Ninguno de estos es el número de estrellas [@forsgren-accelerate]:

| Indicador | Dónde se comprueba | Qué revela |
| --- | --- | --- |
| Cadencia de publicaciones | Historial de versiones | Si el proyecto sigue vivo |
| Política de soporte declarada | Documentación oficial | Hasta cuándo recibirás correcciones |
| Tiempo de respuesta a fallos de seguridad | Avisos publicados | Cómo se comporta bajo presión |
| Número de personas con permiso de publicación | Gobierno del proyecto | Riesgo de una sola persona |
| Licencia y su historial de cambios | Fichero de licencia y SPDX [@spdx-licenses] | Riesgo de cambio de términos |
| Cumplimiento del versionado declarado | Comparación entre versiones [@semver] | Si sus promesas se cumplen |
| Procedencia de los artefactos | Cadena de construcción [@slsa] | Si puedes verificar lo que instalas |

Una licencia aprobada por la OSI [@osi-licenses] da garantías que una licencia
«casi abierta» no da; cambiar de una a otra a mitad de vida de un producto es un
riesgo real y ha ocurrido varias veces en el sector.

### Estrategia de salida

Se escribe **antes** de adoptar, y contesta a: ¿qué parte del código quedaría
inservible si mañana hubiera que sustituirlo? Si la respuesta es «casi todo», la
adopción es una apuesta, no una decisión.

La defensa es la del módulo 02: dominio independiente, adaptadores en el borde.
Una función de aptitud —una prueba automática que falla si la arquitectura se
degrada— convierte esa defensa en algo que no depende de la disciplina
[@ford-evolutionary-architectures].

## Anatomía comparada

Ejemplo aplicado: mismo equipo, dos productos, pesos distintos.

| Dimensión | Panel interno (peso) | Pasarela de pagos (peso) |
| --- | ---: | ---: |
| Ajuste al producto | 20 % | 15 % |
| Capacidades del equipo | 25 % | 10 % |
| Seguridad por omisión | 5 % | 30 % |
| Operación y diagnóstico | 15 % | 20 % |
| Salud del proyecto | 10 % | 15 % |
| Coste de operación | 20 % | 5 % |
| Estrategia de salida | 5 % | 5 % |

Con los mismos candidatos y las mismas puntuaciones, estas dos columnas eligen
frameworks distintos. Ese es el resultado correcto: no hay un ganador absoluto,
hay un ganador por contexto [@richards-ford-fundamentals].

## Implementación mínima

Matriz de decisión calculada, para que los pesos sean auditables:

```javascript
// decision.mjs — node decision.mjs
export function decidir({ pesos, candidatos }) {
  const suma = Object.values(pesos).reduce((a, b) => a + b, 0);
  // Si los pesos no suman 100, la puntuación no es comparable entre matrices.
  if (Math.abs(suma - 100) > 0.001) throw new Error(`los pesos suman ${suma}, deben sumar 100`);

  return Object.entries(candidatos)
    .map(([nombre, notas]) => {
      const faltantes = Object.keys(pesos).filter((d) => notas[d] === undefined);
      if (faltantes.length) throw new Error(`${nombre} sin puntuar en: ${faltantes.join(", ")}`);
      const total = Object.entries(pesos).reduce((acc, [d, peso]) => acc + (notas[d] * peso) / 100, 0);
      return { nombre, total: Number(total.toFixed(2)), notas };
    })
    .sort((a, b) => b.total - a.total);
}
```

Y una **función de aptitud** que protege la estrategia de salida:

```javascript
// aptitud.test.mjs — falla si el dominio empieza a depender del framework
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { test } from "node:test";

const PROHIBIDO = /^import .* from "(express|@nestjs|fastify|next)/m;

test("el dominio no importa ningún framework", () => {
  const archivos = fs
    .readdirSync("src/dominio", { recursive: true })
    .filter((f) => String(f).endsWith(".mjs"));
  const infractores = archivos.filter((f) =>
    PROHIBIDO.test(fs.readFileSync(path.join("src/dominio", String(f)), "utf8")),
  );
  assert.deepEqual(infractores, [], "el dominio se acopló a un framework");
});
```

Esta prueba vale más que un acuerdo verbal: la erosión arquitectónica ocurre
cambio a cambio, y solo se detiene con algo que falle.

## Pruebas compartidas

1. **Pesos antes que puntuaciones.** El registro muestra que se declararon en ese
   orden, con fecha.
2. **Matriz completa.** Ningún candidato queda sin puntuar en ninguna dimensión.
3. **Evidencia por puntuación.** Cada nota se apoya en un hecho verificable, no
   en una impresión.
4. **Registro de decisión.** Existe un documento con contexto, alternativas
   consideradas, decisión y consecuencias [@adr-github].
5. **Función de aptitud.** Al menos una prueba automática protege la propiedad
   arquitectónica que sostiene la estrategia de salida.
6. **Procedencia de dependencias.** Las dependencias directas se instalan con
   versión fijada y verificable [@nist-ssdf].

## Seguridad y accesibilidad

- **La cadena de suministro es parte de la elección.** Adoptar un framework es
  adoptar su árbol de dependencias. Marcos publicados describen qué prácticas
  reducen ese riesgo [@nist-ssdf] y qué niveles de procedencia puede alcanzar un
  artefacto [@slsa].
- **Versiones fijadas y verificables.** Un fichero de bloqueo con integridad
  comprobada es lo que impide que una publicación comprometida entre sin que
  nadie lo note.
- **Licencias y obligaciones.** El identificador SPDX exacto [@spdx-licenses] y
  la aprobación OSI [@osi-licenses] determinan qué puedes distribuir. Un
  incumplimiento de licencia es un riesgo legal, no un detalle.
- **Accesibilidad como criterio de selección.** Si el ecosistema de componentes
  del framework no ofrece patrones accesibles, la accesibilidad la pagará tu
  equipo en cada componente. Eso es coste de operación y debe entrar en la
  matriz, no descubrirse después.
- **Idioma y localización.** Un framework sin soporte real de internacionalización
  obliga a construirlo; si el producto lo necesita, es una dimensión con peso.

## Errores frecuentes y diagnóstico

| Síntoma | Causa | Diagnóstico |
| --- | --- | --- |
| La matriz confirma lo que ya se había decidido | Pesos puestos después | Fecha y versiona los pesos antes de puntuar |
| «Es el más popular» | Popularidad como criterio | Sustitúyela por los siete indicadores de salud |
| Nadie recuerda por qué se eligió | Sin registro de decisión | Escribe el registro [@adr-github] |
| Sustituirlo obligaría a reescribir todo | Sin estrategia de salida | Aísla el dominio y añade una función de aptitud |
| La arquitectura se degradó sin que nadie lo notara | Sin comprobación automática | Convierte la propiedad en una prueba [@ford-evolutionary-architectures] |
| Un cambio de licencia dejó al producto expuesto | Licencia no vigilada | Revisa licencias en cada actualización |
| Se eligió por el equipo actual y el equipo cambió | Peso excesivo a las capacidades de hoy | Separa «lo que sabemos» de «lo que podemos aprender» |
| Dos productos distintos con el mismo stack impuesto | Pesos no revisados por producto | Rehaz la matriz por producto |

## Comprobación de recuerdo

1. ¿Cómo se convierte «tiene que ser rápido» en algo verificable?
2. ¿Por qué los pesos se declaran antes que las puntuaciones?
3. Nombra cuatro indicadores de salud de un proyecto que no sean popularidad.
4. ¿Qué pregunta contesta una estrategia de salida?
5. ¿Qué es una función de aptitud y qué problema resuelve?

**Repaso espaciado.** Repite al preparar el proyecto final y en su defensa.

## Reto de transferencia

Elige un producto real —tuyo o descrito con detalle— y entrega un registro de
decisión completo [@adr-github]:

1. cuatro atributos de calidad medibles derivados de sus requisitos;
2. los pesos, declarados y fechados antes de puntuar;
3. tres candidatos puntuados, con **la evidencia** de cada nota;
4. los siete indicadores de salud comprobados para el candidato ganador;
5. la estrategia de salida y **la función de aptitud** que la protege, escrita y
   ejecutándose;
6. las consecuencias negativas que aceptas con la decisión.

El punto 6 es obligatorio: un registro de decisión sin consecuencias negativas es
publicidad.

## Criterios de evaluación

| Criterio | Insuficiente | Suficiente | Sólido | Ejemplar |
| --- | --- | --- | --- | --- |
| Atributos de calidad | Requisitos difusos | Algunos medibles | Escenarios con estímulo y medida | Verificados en integración continua |
| Matriz | Sin pesos | Pesos y puntuaciones | Pesos primero, con evidencia | Rehecha por producto y revisada |
| Salud del proyecto | Popularidad | Actividad reciente | Siete indicadores comprobados | Con vigilancia periódica establecida |
| Sostenibilidad | Sin salida | Salida descrita | Función de aptitud en ejecución | Consecuencias negativas aceptadas por escrito |

## Fuentes

- [@ford-evolutionary-architectures] Ford, Neal; Parsons, Rebecca; Kua, Patrick; Sadalage, Pramod. *Building Evolutionary Architectures*, 2.ª ed. O'Reilly Media, 2023. ISBN 9781492097549 — <https://openlibrary.org/isbn/9781492097549>
- [@bass-software-architecture-practice] Bass, Len; Clements, Paul; Kazman, Rick. *Software Architecture in Practice*, 4.ª ed. Pearson Education, 2021. ISBN 9780136886099 — <https://openlibrary.org/isbn/9780136886099>
- [@richards-ford-fundamentals] Richards, Mark; Ford, Neal. *Fundamentals of Software Architecture*. O'Reilly Media, 2020. ISBN 9781492043454 — <https://openlibrary.org/isbn/9781492043454>
- [@forsgren-accelerate] Forsgren, Nicole; Humble, Jez; Kim, Gene. *Accelerate*. IT Revolution Press, 2018. ISBN 9781942788355 — <https://openlibrary.org/isbn/9781942788355>
- [@adr-github] Architectural Decision Records — <https://adr.github.io/>
- [@nist-ssdf] SP 800-218 — Secure Software Development Framework, NIST, 2022 — <https://csrc.nist.gov/pubs/sp/800/218/final>
- [@slsa] SLSA — Supply-chain Levels for Software Artifacts, OpenSSF — <https://slsa.dev/spec/v1.0/>
- [@spdx-licenses] SPDX License List, Linux Foundation — <https://spdx.org/licenses/>
- [@osi-licenses] OSI Approved Licenses, Open Source Initiative — <https://opensource.org/licenses>
- [@semver] Semantic Versioning 2.0.0 — <https://semver.org/>
