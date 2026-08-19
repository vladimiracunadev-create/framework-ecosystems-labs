# Framework Ecosystems Labs

[![CI](https://github.com/vladimiracunadev-create/framework-ecosystems-labs/actions/workflows/ci.yml/badge.svg)](https://github.com/vladimiracunadev-create/framework-ecosystems-labs/actions/workflows/ci.yml)
[![Pages](https://github.com/vladimiracunadev-create/framework-ecosystems-labs/actions/workflows/pages.yml/badge.svg)](https://github.com/vladimiracunadev-create/framework-ecosystems-labs/actions/workflows/pages.yml)
[![Fuentes verificadas](https://img.shields.io/badge/fuentes-97%20verificadas-0b5fd0)](docs/BIBLIOGRAPHY.md)
[![Licencia](https://img.shields.io/badge/licencia-MIT-informational)](LICENSE)

**Programa comparativo de 180 horas para aprender a entender, comparar y elegir
bibliotecas, frameworks y plataformas de desarrollo.** La unidad de comparación
no es un «Hola mundo»: es el mismo contrato funcional, con las mismas pruebas de
aceptación y los mismos atributos de calidad, implementado en distintos
ecosistemas.

📖 **Sitio del programa:** <https://vladimiracunadev-create.github.io/framework-ecosystems-labs/>

---

## La regla que gobierna este repositorio

> **Ninguna afirmación del programa procede de una fuente difusa.**

Todo lo que aquí se enseña se apoya en un libro, un artículo con revisión por
pares, una norma o la documentación oficial de quien mantiene la tecnología. Y no
es una intención declarada: es una comprobación automática que deja el
repositorio en rojo.

| | |
| --- | ---: |
| Fuentes en el registro | **97** |
| Libros, con ISBN-13 validado contra [Open Library](https://openlibrary.org/) | **41** |
| Artículos, con DOI contrastado en [Crossref](https://www.crossref.org/) | **7** |
| Normas de IETF, W3C, WHATWG, NIST, OWASP y OpenSSF | **28** |
| Documentación oficial y referencias de autor | **21** |
| Fuentes citadas al menos una vez en el texto | **97 / 97** |

```bash
node scripts/verify-sources.mjs   # sin red: determinista y reproducible
node scripts/refresh-sources.mjs  # con red: contrasta con los catálogos públicos
```

`verify-sources.mjs` falla si una cita apunta a una fuente inexistente, si una
lección cita menos de cuatro, si un libro no tiene ISBN válido, si un artículo no
tiene DOI, si una lección omite alguna de las doce secciones obligatorias, o si
alguna entrada del registro **no se cita en ningún texto** — la bibliografía
decorativa también es un fallo.

Detalle completo en [`sources/README.md`](sources/README.md) y
[`docs/BIBLIOGRAPHY.md`](docs/BIBLIOGRAPHY.md).

## Propósito

Al finalizar, una persona podrá:

- diferenciar lenguaje, runtime, biblioteca, framework, metaframework, SDK, ORM y plataforma;
- reconocer inversión de control, convenciones, composición y extensibilidad;
- construir frontend, API, full stack, móvil y escritorio con patrones transferibles;
- comparar routing, estado, validación, persistencia, seguridad, pruebas y despliegue;
- elegir un framework según producto, equipo, riesgo y ciclo de vida;
- migrar sistemas heredados de forma incremental;
- evaluar dependencia, mantenimiento, licencias y cadena de suministro;
- demostrar la misma funcionalidad mediante pruebas compartidas.

## Principio central

```text
mismo dominio + mismo contrato + mismas pruebas + entornos declarados
```

Cambiar requisitos para favorecer una tecnología invalida la comparación.

## El programa

| Módulo | Tema | Nivel | Horas | Fuentes |
| --- | --- | --- | ---: | ---: |
| [00](curriculum/00-taxonomia-y-diagnostico.md) | Taxonomía y diagnóstico | introductorio | 6 | 9 |
| [01](curriculum/01-http-eventos-y-contratos.md) | HTTP, eventos y contratos | introductorio | 16 | 15 |
| [02](curriculum/02-arquitectura-de-frameworks.md) | Arquitectura de frameworks | intermedio | 14 | 5 |
| [03](curriculum/03-frontend-componentes-y-estado.md) | Frontend, componentes y estado | intermedio | 18 | 8 |
| [04](curriculum/04-fullstack-y-renderizado.md) | Full stack y renderizado | intermedio | 14 | 6 |
| [05](curriculum/05-backend-y-api.md) | Backend y API | intermedio | 20 | 8 |
| [06](curriculum/06-persistencia-y-dominio.md) | Persistencia y dominio | intermedio | 14 | 8 |
| [07](curriculum/07-identidad-y-seguridad.md) | Identidad y seguridad | avanzado | 16 | 12 |
| [08](curriculum/08-calidad-rendimiento-y-operacion.md) | Calidad, rendimiento y operación | avanzado | 16 | 15 |
| [09](curriculum/09-movil-escritorio-y-offline.md) | Móvil, escritorio y offline | avanzado | 12 | 6 |
| [10](curriculum/10-modernizacion-y-migracion.md) | Modernización y migración | avanzado | 14 | 6 |
| [11](curriculum/11-seleccion-y-sostenibilidad.md) | Selección y sostenibilidad | avanzado | 10 | 10 |
| [12](curriculum/12-producto-final.md) | Producto final | avanzado | 10 | 8 |

Rutas frontend, backend, full stack y modernización en
[`curriculum/README.md`](curriculum/README.md).

### Anatomía de un módulo

Los trece siguen el mismo contrato de doce secciones, y la validación lo exige:

`Prerrequisitos` · `Objetivos observables` · `Concepto independiente del
framework` · `Anatomía comparada` · `Implementación mínima` · `Pruebas
compartidas` · `Seguridad y accesibilidad` · `Errores frecuentes y diagnóstico` ·
`Comprobación de recuerdo` · `Reto de transferencia` · `Criterios de evaluación`
· `Fuentes`

Por qué esas doce y en ese orden: [`docs/LEARNING-MODEL.md`](docs/LEARNING-MODEL.md),
donde cada decisión pedagógica se apoya en su propia fuente.

## Empezar

Requiere Node.js 22 o superior. **Sin instalar dependencias:**

```bash
node scripts/validate-repository.mjs
node scripts/verify-sources.mjs
node --test labs/01-http-contract/reference-node/server.test.mjs
node scripts/generate-site.mjs   # genera site/ (no se versiona)
```

Con pnpm, que es el único gestor admitido para JavaScript y TypeScript:

```bash
corepack enable
pnpm check
```

## Estructura

```text
catalog/          Registro de frameworks, bibliotecas y plataformas
contracts/        Dominio y contrato TaskFlow compartido
curriculum/       Los 13 módulos del programa
docs/             Taxonomía, arquitectura, selección, seguridad, modelo pedagógico
labs/             Implementaciones y comparaciones ejecutables
projects/         Productos canónicos y proyecto final
assessments/      Diagnóstico y rúbricas
sources/          Registro bibliográfico verificable y su política
templates/        Plantillas de lección, framework y decisión
scripts/          Validaciones y generador del sitio, sin dependencias
```

## Cobertura de «todos los frameworks»

- **Núcleo ejecutable:** tecnologías representativas y mantenidas.
- **Comparaciones guiadas:** implementaciones parciales bajo un contrato común.
- **Catálogo evolutivo:** tecnologías históricas, actuales y emergentes con fuentes.
- **Plantillas:** incorporación consistente de nuevos ecosistemas.

Estar en el catálogo no equivale a una recomendación ni a dominio profesional.

## Proyectos canónicos

Plataforma educativa · comercio electrónico · libro contable y pagos · red social
· panel de agentes y automatizaciones. Cada uno con un atributo de calidad
dominante distinto, en [`projects/canonical-products.md`](projects/canonical-products.md).

## Qué NO promete este programa

- **No garantiza dominio profesional.** Demuestra criterio y capacidad de
  comparar; la competencia se adquiere operando sistemas reales durante meses.
- **No declara ganadores.** No hay un framework mejor: hay uno mejor para un
  producto, un equipo y un horizonte declarados.
- **No es neutral.** Privilegia la comparación honesta y el diagnóstico sobre la
  velocidad de entrega inicial. El sesgo es deliberado y está declarado.

## IA y mantenimiento

[`PROMPT_MAESTRO.md`](PROMPT_MAESTRO.md) define cómo una IA debe investigar,
implementar, probar y documentar cambios sin degradar el repositorio. La regla de
fuentes se le aplica igual que a una persona.

## Licencia

MIT. Los frameworks, nombres y marcas conservan sus licencias y titulares. El
repositorio **no redistribuye** libros ni artículos protegidos: cita, remite y
explica.
